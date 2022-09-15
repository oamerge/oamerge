import { isAbsolute, resolve, join } from 'node:path'

import sade from 'sade'

import { mutateConsoleLogger } from './lib/mutate-console-logger.js'
import { oamerge } from './oamerge.js'

const VERSION = '__VERSION__'
const DEFAULT_CONFIG = 'oamerge.config.js'

const argvIncludes = (...keys) => !!keys.find(key => process.argv.includes(key))
mutateConsoleLogger({
	printDate: argvIncludes('-w', '--watch'),
	printDebug: argvIncludes('--verbose'),
	useColors: !argvIncludes('--no-colors'),
})

sade('oamerge', true)
	.version(VERSION)
	.option('-c, --config', `Location of the configuration file to use. Default: ${DEFAULT_CONFIG}`)
	.option('-i, --input', 'Folders to ingest. Multiple allowed, order is preserved.')
	.option('-o, --output', 'Folder to write output files.')
	.option('--cwd', 'Set the working directory to change path resolution.')
	.option('--no-colors', 'Disable color printing to console.')
	.option('-w, --watch', 'Rebuild on detected file changes.')
	.option('--verbose', 'Log debug information.')
	.action(opts => {
		// These are only used for the CLI, so in order to avoid confusion
		// later down the stream they are removed here.
		delete opts['no-colors']
		delete opts['verbose']

		if (!opts.config && (!opts.input || !opts.output)) {
			console.error('Must specify input(s) and output if no config file specified.')
			process.exit(1)
		}

		opts.cwd = opts.cwd
			? (isAbsolute(opts.cwd) ? opts.cwd : resolve(opts.cwd))
			: process.cwd()

		const absoluteResolver = dir => isAbsolute(dir) ? dir : resolve(opts.cwd, dir)

		if (typeof opts.config === 'string') opts.config = absoluteResolver(opts.config)
		else opts.config = join(opts.cwd, DEFAULT_CONFIG)

		if (opts.input) opts.input = absoluteResolver(opts.input)
		if (opts.output) opts.output = absoluteResolver(opts.output)

		const start = Date.now()
		oamerge(opts)
			.then(() => {
				if (!opts.watch) console.log(`Build completed after ${Date.now() - start}ms.`)
				process.exit(1)
			})
			.catch(error => {
				console.error('Unexpected error from OAMerge!', error)
				process.exit(1)
			})
	})
	.parse(process.argv)
