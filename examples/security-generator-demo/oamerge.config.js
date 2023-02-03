import routes from '../../packages/generator-security/src/generator.js'

export default {
	inputs: [
		'./api-1',
		'./api-2',
		'./api-3',
	],
	output: './build',
	generators: [
		routes(),
	],
}
