import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { treeToJavascript } from '../src/tree-to-javascript.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const files = await readdir(__dirname).then(items => items.filter(i => i.endsWith('.md')))

const CONFIG_LINE = /^```js\s+#config$/
const EXPECTED_LINE = /^```js\s+#expected$/

const parseFile = async filename => {
	const string = await readFile(join(__dirname, filename), 'utf8')
	const config = []
	const expected = []
	let currentBlock = ''
	for (const line of string.split('\n')) {
		if (line === '```') {
			currentBlock = undefined
			if (config.length && expected.length) break
		} else if (currentBlock === 'config') config.push(line)
		else if (currentBlock === 'expected') expected.push(line)
		else if (!currentBlock && line.startsWith('```js ')) {
			if (CONFIG_LINE.test(line)) currentBlock = 'config'
			else if (EXPECTED_LINE.test(line)) currentBlock = 'expected'
		}
	}
	return {
		name: filename.replace(/\.md$/, ''),
		config: new Function(config.join('\n'))(),
		expected: expected.join('\n'),
	}
}

for (const file of files) {
	const { name, config, expected } = await parseFile(file)
	test('tree-to-javascript: ' + name, () => {
		assert.equal(treeToJavascript(config), expected)
	})
}

test.run()
