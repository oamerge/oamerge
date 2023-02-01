import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { createTree, updateTreeFile } from './mutate-tree.js'

const HANDLER1 = _ => _

const scenarios = [
	// Each scenario is an array with these ordered properties (the first
	// test is the most basic, for descriptive purposes):
	// - 0: description of the test
	// - 1: an array of normalized input objects, e.g. OamergePluginInput[]
	// - 2: an array of mutations to apply to the tree
	// - 3: the expected resulting tree state
	// For example:
	[
		// This is a short description of what the test demonstrates, in case it ever fails:
		'Applying two files, mostly to show how the tests work.',
		// These are the ordered normalized input objects:
		[
			{ dir: './folder1', ext: '@', api: '/v1' },
		],
		// These are the ordered mutations to apply to the tree, by calling `mutateTree`:
		[
			// These are the same ordered properties provided to `mutateTree` *except* that the
			// test runner will handle passing the `TREE` property around.
			[
				// The index of the input array (0 if a single string).
				0,
				// The filepath relative to the input folder.
				'paths/hello/world/get.@.js',
				// The output from the loader, e.g. the "contents" of the file.
				{
					summary: 'Says Hello',
					description: 'Simple example...',
					default: HANDLER1,
				},
			],
			// If you were applying another mutation, you'd do it here:
			// [ inputIndex, filepath, loadedFile ],
		],
		{
			inputs: [
				{
					dir: './folder1', ext: '@', api: '/v1',
					files: {
						'paths/hello/world/get.@.js': {
							key: [ 'paths', 'hello', 'world', 'get' ],
							exports: {
								summary: 'Says Hello',
								description: 'Simple example...',
								default: HANDLER1,
							},
						},
					},
				},
			],
		},
	],
	// ==========
	[
		'Make sure that the underscore file is extracted correctly.',
		[ { dir: './folder1', ext: '@', api: '/v1' } ],
		[
			[ 0, 'paths/hello/world/_.@.js', { summary: 'path item object' } ],
		],
		{
			inputs: [
				{
					dir: './folder1', ext: '@', api: '/v1',
					files: {
						'paths/hello/world/_.@.js': {
							key: [ 'paths', 'hello', 'world', '_' ],
							exports: { summary: 'path item object' },
						},
					},
				},
			],
		},
	],
]

test('mutate-tree', () => {
	for (const [ description, inputs, states, expected ] of scenarios) {
		const TREE = createTree(inputs)
		for (const [ inputIndex, filepath, loadedFile ] of states) updateTreeFile(TREE, inputIndex, filepath, loadedFile)
		assert.equal(TREE, expected, description)
	}
})

test.run()
