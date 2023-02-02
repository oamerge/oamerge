import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const javascriptLoader = async ({ cwd, inputDirectory, filepath, ext }) => {
	if (ext === 'js') try {
		return await import(join(cwd, inputDirectory, filepath))
	} catch (error) {
		console.warn(`Default JavaScript loader could not load file [dir=${inputDirectory}, file=${filepath}]:`, error)
	}
}

const jsonLoader = async ({ cwd, inputDirectory, filepath, ext }) => {
	if (ext === 'json') try {
		return JSON.parse(await readFile(join(cwd, inputDirectory, filepath), 'utf8'))
	} catch (error) {
		console.warn(`Default JSON loader could not load file [dir=${inputDirectory}, file=${filepath}]:`, error)
	}
}

const defaultLoaders = [
	javascriptLoader,
	jsonLoader,
]

export const executeLoaders = async (cwd, inputDirectory, filepath, loaders) => {
	let atLeastOneLoader
	const ext = extname(filepath).replace(/^\./, '')
	const results = await Promise.all([ ...defaultLoaders, ...(loaders || []) ].filter(Boolean).map(
		load => load({ cwd, inputDirectory, filepath, ext })
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
