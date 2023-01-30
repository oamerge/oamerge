/*

This file is just used to assert that the types in 'types.d.ts' are sane.

*/

import {
	OamergeConfiguration,
	OamergeConfigurationInput,
	OamergeLoaderPlugin,
	OamergeGeneratorPlugin,
	OamergeTreeInputs,
	OamergeLoaderParameters,
	OamergeTree,
	OamergeGeneratorParameters,
} from './types'

const config_minimal: OamergeConfiguration = {
	inputs: 'folder1',
	output: 'build',
}
const config_minimal_with_plugins: OamergeConfiguration = {
	inputs: 'folder1',
	output: 'build',
	loaders: 'load1',
	generators: 'gen1',
}

const input2: OamergeConfigurationInput = { dir: 'folder2' }
const input3: OamergeConfigurationInput = { dir: 'folder3', ext: '$' }
const input4: OamergeConfigurationInput = { dir: 'folder4', api: '/v1' }
const input5: OamergeConfigurationInput = { dir: 'folder5', ext: '#', api: '/v2' }

const loader1: OamergeLoaderParameters = {
	cwd: '/root',
	inputDirectory: 'folder1',
	filepath: 'paths/hello/world/get.@.js',
}
const plugin1: OamergeLoaderPlugin = async (params: OamergeLoaderParameters) => {
	console.log(params.cwd.substring(0))
	console.log(params.inputDirectory.substring(0))
	console.log(params.filepath.substring(0))
}

const tree_input: OamergeTreeInputs = {
	dir: 'folder1',
	ext: '@',
	api: '/v1',
	files: {
		'paths/hello/world/get.@.js': {
			key: [ 'paths', 'hello', 'world', 'get' ],
			exports: {
				description: 'Hello, World!'
			}
		}
	}
}
const tree: OamergeTree = {
	inputs: [ tree_input ],
}
const generator1: OamergeGeneratorParameters = {
	cwd: '/root',
	output: 'build',
	TREE: tree,
}
const plugin2: OamergeGeneratorPlugin = async (opts: OamergeGeneratorParameters) => {
	console.log(opts.cwd.substring(0))
	console.log(opts.output.substring(0))
}

const config_everything: OamergeConfiguration = {
	cwd: '/root',
	watch: true,
	inputs: [ 'folder1', input2, input3, input4, input5 ],
	output: 'build',
	loaders: [ 'load1', plugin1 ],
	generators: [ 'gen1', plugin2 ]
}

console.log({
	config_minimal,
	config_minimal_with_plugins,
	loader1,
	generator1,
	config_everything,
})
