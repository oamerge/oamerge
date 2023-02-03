import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const DEFAULT_EXTENSIONS = [
	'txt',
	'md',
]

const DOT = /^\./

export default opts => {
	const extensions = opts.extensions || DEFAULT_EXTENSIONS
	return async ({ cwd, inputDirectory, filepath }) => {
		if (extensions.includes(extname(filepath).replace(DOT, ''))) {
			return readFile(join(cwd, inputDirectory, filepath), 'utf8')
		}
	}
}
