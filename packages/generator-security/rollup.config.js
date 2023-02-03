import nodeResolve from '@rollup/plugin-node-resolve'

export default [
	{
		input: 'src/generator.js',
		output: [
			{
				file: 'dist/generator.js',
				format: 'es',
			},
			{
				file: 'dist/generator.cjs',
				format: 'cjs',
			},
		],
		plugins: [
			nodeResolve(),
		],
	},
]
