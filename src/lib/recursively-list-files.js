import { join, parse } from 'node:path'
import { readdir } from 'node:fs/promises'

export const recursivelyListFiles = async (rootDir, ext, currentChildDir) => {
	const dirEnts = await readdir(join(rootDir, currentChildDir || ''), { withFileTypes: true })
	return Promise.all(dirEnts.map(
		dirEnt => {
			if (dirEnt.isDirectory()) {
				return recursivelyListFiles(rootDir, ext, join(currentChildDir || '', dirEnt.name))
			} else if (dirEnt.isFile()) {
				const { name: filenameWithoutExtension } = parse(dirEnt.name)
				if (filenameWithoutExtension.endsWith(`.${ext}`)) return [ join(currentChildDir || '', dirEnt.name) ]
			}
			return []
		},
	)).then(listOfLists => listOfLists.flat())
}
