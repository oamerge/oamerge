import { isAbsolute, resolve } from 'node:path'

import { normalizeInputs } from './lib/normalize-inputs.js'
import { setupPlugins } from './lib/setup-plugins.js'

export const oamerge = async ({ inputs, output, generators, loaders, cwd, watch }) => {
	const absoluteResolver = dir => isAbsolute(dir) ? dir : resolve(cwd, dir)
	if (output) output = absoluteResolver(output)
	if (inputs) inputs = normalizeInputs(inputs)
	for (const input of inputs) if (input.dir) input.dir = absoluteResolver(input.dir)

	if (loaders?.length) loaders = await setupPlugins('Loader', loaders)
	if (generators?.length) generators = await setupPlugins('Generator', generators)


	console.debug({ inputs, output, generators, loaders, cwd, watch })
}
