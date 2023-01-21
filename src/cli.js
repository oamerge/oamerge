import { isAbsolute, resolve, join } from 'node:path'

import sade from 'sade'

import { mutateConsoleLogger } from './lib/mutate-console-logger.js'
import { configWatcherLoader } from './lib/config-watcher-loader.js'
import { simpleThrottle } from './lib/simple-throttle.js'
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
	.option('-o, --output', 'Folder to write generated files.')
	.option('-l, --loader', 'The name of the loader plugin. Multiple allowed, order is preserved.')
	.option('-g, --generator', 'The name of the generator plugin. Multiple allowed, order is preserved.')
	.option('--cwd', 'Set the working directory to change path resolution.')
	.option('--no-colors', 'Disable color printing to console.')
	.option('-w, --watch', 'Rebuild on detected file changes.')
	.option('--verbose', 'Log debug information.')

	.example(`-c # Use the default configuration file (${DEFAULT_CONFIG}).`)
	.example('-c my-api.config.js # Use a different configuration file.')
	.example('-c -i ./folder1 -i ./folder2 # Multiple input folders, use default extension (@) and api prefix (/).')
	.example('-c -i "dir=./folder1;ext=@;api=/" # Specify all input values (careful to wrap in quotes).')
	.example('-c -g @oamerge/generator-routes # Use a generator with its default settings.')
	.example('-c -g @oamerge/loader-markdown # Use a loader with its default settings.')

	.action(opts => {
		// These are only used for the CLI, so in order to avoid confusion
		// later down the stream they are removed here.
		delete opts['no-colors']
		delete opts['verbose']

		if (!opts.config && (!opts.input || !opts.output)) {
			console.error('Must specify input(s) and output folder if no configuration file is specified.')
			process.exit(1)
		}

		opts.cwd = opts.cwd
			? (isAbsolute(opts.cwd) ? opts.cwd : resolve(opts.cwd))
			: process.cwd()

		const remappedProperties = [
			[ 'input', 'inputs' ],
			[ 'generator', 'generators' ],
			[ 'loader', 'loaders' ],
		]
		for (const [ from, to ] of remappedProperties) {
			if (opts[from]) {
				opts[to] = Array.isArray(opts[from]) ? opts[from] : [ opts[from] ]
				delete opts[from]
			}
		}

		let configFilepath
		if (typeof opts.config === 'string') configFilepath = isAbsolute(opts.config)
			? opts.config
			: resolve(opts.cwd, opts.config)
		else if (opts.config) configFilepath = join(opts.cwd, DEFAULT_CONFIG)

		// Very simple throttle to only run oamerge one at a time, but if the config file
		// changes while it's running, queue up one more re-run.
		let mostRecentConfig
		const runOamerge = simpleThrottle(() => oamerge(Object.assign({}, mostRecentConfig || {}, opts)))

		const start = Date.now()
		const success = () => {
			if (!opts.watch) console.info(`Build completed after ${Date.now() - start}ms.`)
			process.exit(0)
		}
		const fail = error => {
			console.error('Unexpected error from OAMerge!', error)
			process.exit(1)
		}

		if (configFilepath) {
			const emitter = configWatcherLoader(configFilepath, opts.watch)
			emitter.on('config', config => {
				mostRecentConfig = config
				runOamerge().then(success).catch(fail)
			})
		} else {
			runOamerge().then(success).catch(fail)
		}
	})
	.parse(process.argv)
