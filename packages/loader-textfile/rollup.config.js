import nodeResolve from '@rollup/plugin-node-resolve'

export default [
	{
		input: 'src/loader.js',
		output: [
			{
				file: 'dist/loader.js',
				format: 'es',
			},
			{
				file: 'dist/loader.cjs',
				format: 'cjs',
			},
		],
		plugins: [
			nodeResolve(),
		],
	},
]
