import routes from '../../packages/generator-routes/dist/generator.js'

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
