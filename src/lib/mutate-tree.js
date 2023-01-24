import { parse, sep } from 'node:path'

// This creates the bare tree. All the other operators depend on this structure.
export const createTree = inputs => ({
	inputs: inputs.map(({ dir, ext, api }) => ({ dir, ext, api, files: {} })),
})

// Every time you add/remove/update a file, you need to update
// the file in the inputs map and then at the end you need to
// commit all those changes with the `rebuildTree` function.
export const updateTreeFile = (TREE, inputIndex, filepath, loadedFile) => {
	// First we turn a filepath, relative to an input folder, from this:
	//   paths/hello/world/get.@.js
	// Into this:
	//   [ 'paths', 'hello', 'world', 'get' ]
	let key = filepath.split(sep)
	let { name } = parse(key[key.length - 1])
	if (name.endsWith(`.${TREE.inputs[inputIndex].ext}`)) name = name.substring(0, name.length - TREE.inputs[inputIndex].ext.length - 1)
	key[key.length - 1] = name

	// Then we update the `inputs` portion of the tree, which looks like this:
	// TREE.inputs = [
	// 	// An array of elements, ordered by the build input list, e.g. the `inputs`
	// 	// property from the configuration file. The order matters, because later
	// 	// inputs override previous ones, when properties overlap.
	// 	{
	// 		// The parsed keypath, which will be used later for
	// 		// merging to the OpenAPI model:
	// 		key: [ 'paths', 'hello', 'world', 'get' ],
	// 		// This is whatever comes back from the file loader, e.g.
	// 		// if it's loaded as a string this would be a string, but
	// 		// typically a JavaScript import with properties and sometimes
	// 		// a default export for handlers etc.
	// 		exports: '...',
	// 	},
	// ]
	if (loadedFile !== undefined && loadedFile !== null) TREE.inputs[inputIndex].files[filepath] = { key, exports: loadedFile }
	else delete TREE.inputs[inputIndex].files[filepath]
}
