import { isAbsolute, resolve } from 'node:path'
import { mkdir } from 'node:fs/promises'

import { simpleThrottle } from './lib/simple-throttle.js'
import { normalizeInputs } from './lib/normalize-inputs.js'
import { importPlugins } from './lib/import-plugins.js'
import { fileWatcher } from './lib/file-watcher.js'
import { loadAllInputs } from './lib/load-all-inputs.js'
import { executeLoaders } from './lib/execute-loaders.js'
import { createTree, updateTreeFile } from './lib/mutate-tree.js'
import { executeGenerators } from './lib/execute-generators.js'

export const oamerge = async ({ input, inputs, output, generators, loaders, cwd, watch }) => {
	const absoluteResolver = dir => isAbsolute(dir) ? dir : resolve(cwd, dir)
	if (output) output = absoluteResolver(output)
	await mkdir(output, { recursive: true })

	inputs = normalizeInputs([ input, inputs ].filter(Boolean).flat())
	if (!inputs.length) console.error('No inputs detected!')
	console.debug('Normalized inputs:\n' + inputs.map(i => `  dir=${i.dir}; ext=${i.ext}; api=${i.api}`).join('\n'))

	if (loaders?.length) loaders = await importPlugins('Loader', loaders, cwd)
	if (generators?.length) generators = await importPlugins('Generator', generators, cwd)

	// This is the big mutable state, it's the complex part of this library!
	let TREE = createTree(inputs)

	// Very simple throttle to only run the generators one *batch* at a time, so they
	// will all run at least once, but if a change triggers a rebuild in the middle
	// they will always re-run once at the end.
	const generateAll = simpleThrottle(() => executeGenerators(cwd, output, generators, TREE))

	let waitingForInitialLoad = true
	let changedBeforeInitialLoadCompleted
	const handler = (inputIndex, filepath, loaded) => {
		// In the case that the trigger was for a removed file, or if a file was
		// changed or added and no loader was specified, or all loaders succeeded
		// but returned `undefined`, the `loaded` value would be `undefined`.
		// This would cause the file (and its parts) to be deleted from the tree,
		// which is correct behaviour: the final output from the file was undefined.
		if (waitingForInitialLoad) changedBeforeInitialLoadCompleted = true
		else {
			updateTreeFile(TREE, inputIndex, filepath, loaded)
			generateAll()
		}
	}
	if (watch) {
		const emitter = fileWatcher(cwd, inputs)
		emitter.on('file:+', (inputIndex, filepath) => {
			executeLoaders(cwd, inputs[inputIndex].dir, filepath, loaders)
				.then(loaded => handler(inputIndex, filepath, loaded))
		})
		emitter.on('file:-', handler)
	}

	const load = async () => {
		TREE = createTree(inputs) // On load, re-initialize the tree entirely, to avoid stateful errors.
		const results = await loadAllInputs(cwd, inputs, loaders)
		for (const { inputIndex, filepath, loaded } of results) updateTreeFile(TREE, inputIndex, filepath, loaded)
		generateAll()
	}
	await load()
	let retries = 0
	while (changedBeforeInitialLoadCompleted) {
		retries++
		changedBeforeInitialLoadCompleted = false
		await load()
		if (retries > 2) console.warn(`Files were changed in between initial file load and first completion. This happened ${retries} times, which is unusual and probably means some changes are introducing a circular file update trigger.`)
	}

	console.debug({ inputs, output, generators, loaders, cwd, watch })
}
