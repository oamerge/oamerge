import { isAbsolute, resolve, join } from 'node:path'

import sade from 'sade'

import { mutateConsoleLogger } from './lib/mutate-console-logger.js'
import { oamerge } from './oamerge.js'

const VERSION = '__VERSION__'
const DEFAULT_CONFIG = 'oamerge.config.js'
const DEFAULT_EXTENSION = '@'
const DEFAULT_API = '/'

const argvIncludes = (...keys) => !!keys.find(key => process.argv.includes(key))
mutateConsoleLogger({
	printDate: argvIncludes('-w', '--watch'),
	printDebug: argvIncludes('--verbose'),
	useColors: !argvIncludes('--no-colors'),
})

const normalizeInputString = string => {
	const normalized = {
		dir: string,
		ext: DEFAULT_EXTENSION,
		api: DEFAULT_API,
	}
	if (string.includes(';') || string.includes('=')) {
		for (const pair of string.split(';')) {
			const [ key, value ] = pair.split('=')
			if (key && value && normalized[key]) normalized[key] = value
		}
	}
	console.debug(`Normalized input string "${string}":`, normalized)
	return normalized
}

const importModules = async (prefix, moduleNames) => {
	moduleNames = Array.isArray(moduleNames)
		? moduleNames
		: (moduleNames ? [ moduleNames ] : [])
	const imported = []
	let hasErrors
	for (const name of moduleNames) {
		try {
			const mod = await import(name)
			if (mod?.default) imported.push(mod.default)
			else {
				hasErrors = true
				console.error(`${prefix} module "${name}" did not have a default export. To use ${prefix.toLowerCase()}s with named exports, you will need to use a configuration file.`)
			}
		} catch (error) {
			hasErrors = true
			console.error(`${prefix} "${name}" could not be loaded:`, error.code)
			console.debug(error)
		}
	}
	if (hasErrors) process.exit(1)
	return imported
}

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

		const absoluteResolver = dir => isAbsolute(dir) ? dir : resolve(opts.cwd, dir)

		if (typeof opts.config === 'string') opts.config = absoluteResolver(opts.config)
		else opts.config = join(opts.cwd, DEFAULT_CONFIG)

		if (opts.output) opts.output = absoluteResolver(opts.output)

		// Here we are normalizing the "input" CLI option to the normalized "inputs"
		// and dropping the "input" to avoid confusion downstream.
		if (opts.input) {
			const inputs = []
			for (const input of (Array.isArray(opts.input) ? opts.input : [ opts.input ])) {
				const normalized = normalizeInputString(input)
				if (normalized.dir) normalized.dir = absoluteResolver(normalized.dir)
				inputs.push(normalized)
			}
			opts.inputs = inputs
			delete opts.input
		}

		let start = Date.now()
		Promise.all([
			importModules('Generator', opts.generator),
			importModules('Loader', opts.loader),
		])
			.then(([ generators, loaders ]) => {
				opts.generators = generators
				delete opts.generator
				opts.loaders = loaders
				delete opts.loader
				return oamerge(opts)
			})
			.then(() => {
				if (!opts.watch) console.info(`Build completed after ${Date.now() - start}ms.`)
				process.exit(0)
			})
			.catch(error => {
				console.error('Unexpected error from OAMerge!', error)
				process.exit(1)
			})
	})
	.parse(process.argv)
