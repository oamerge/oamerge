/*

This file simply looks at the files in an examples "expected-build" folder and
compares it to the contents of the "build" folder. To pass, the file list must
be identical, and the contents of every file must also be identical.

This overlaps a great deal of other test code, but it means small changes that
produce differing or non-deterministic output will be caught with very little
effort, so the maintenance cost is worth it.

*/

import { join } from 'node:path'
import { readdir, readFile } from 'node:fs/promises'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

const dirs = await readdir('./examples', { withFileTypes: true })
	.then(results => results.filter(r => r.isDirectory()).map(r => r.name))

const listFiles = async (example, folder) => readdir(join('examples', example, folder))
	.then(results => results.filter(r => ![ '.DS_Store' ].includes(r)))

for (const exampleFolder of dirs) {
	test(exampleFolder, async () => {
		const expectedFiles = await listFiles(exampleFolder, 'expected-build')
		const actualFiles = await listFiles(exampleFolder, 'build')
		assert.equal(expectedFiles, actualFiles, 'list of files is the same')
		for (const file of expectedFiles) {
			assert.equal(
				await readFile(join('examples', exampleFolder, 'expected-build', file), 'utf8'),
				await readFile(join('examples', exampleFolder, 'build', file), 'utf8'),
				file,
			)
		}
	})
}

test.run()
