import { join } from 'node:path'

export const executeLoaders = async (cwd, inputDirectory, filepath, loaders) => {
	let atLeastOneLoader
	const results = await Promise.all(loaders.map(
		load => load({ cwd, inputDirectory, filepath })
			.then(out => {
				atLeastOneLoader = true
				return out
			})
			.catch(error => {
				console.error(`Error while loading file at "${join(cwd, inputDirectory, filepath)}":`, error)
			}),
	))
	if (!atLeastOneLoader) console.warn('File was loaded due to file extension, but no loader was configured for it?', filepath)
	return results.filter(Boolean).pop()
}
