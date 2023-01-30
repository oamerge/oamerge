import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { recursivelyListFiles } from './recursively-list-files.js'

test('recursively-list-files', async () => {
	const files = await recursivelyListFiles('./', 'test')
	assert.ok(files.includes('packages/oamerge/src/lib/recursively-list-files.test.js'))
})

test.run()
