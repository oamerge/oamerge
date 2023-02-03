import routes from '../../packages/generator-routes/src/generator.js'

export default {
	input: './api',
	output: './build',
	generators: [
		routes({ security: true }),
	],
}
