import { readFileSync } from 'node:fs'

import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))

export default [
	{
		input: 'src/oamerge.js',
		output: [
			{
				file: 'dist/oamerge.js',
				format: 'es',
			},
			{
				file: 'dist/oamerge.cjs',
				format: 'cjs',
			},
		],
		plugins: [
			nodeResolve(),
		],
	},
	{
		input: 'src/cli.js',
		output: [
			{
				file: 'dist/cli.js',
				format: 'es',
			},
		],
		plugins: [
			nodeResolve(),
			replace({
				preventAssignment: true,
				values: {
					__VERSION__: version,
				},
			}),
		],
	},
]
