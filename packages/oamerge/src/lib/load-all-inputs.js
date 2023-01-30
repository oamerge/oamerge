import { join } from 'node:path'

import { executeLoaders } from './execute-loaders.js'
import { recursivelyListFiles } from './recursively-list-files.js'

const loadInputFiles = (cwd, loaders) => async ({ dir, ext }, inputIndex) => {
	const files = await recursivelyListFiles(join(cwd, dir), ext)
	return Promise.all(files.map(
		filepath => executeLoaders(cwd, dir, filepath, loaders)
			.then(loaded => ({ inputIndex, filepath, loaded })),
	))
}

export const loadAllInputs = async (cwd, inputs, loaders) => Promise.all(inputs.map(loadInputFiles(cwd, loaders)))
