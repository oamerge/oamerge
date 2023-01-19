import { EventEmitter } from 'node:events'
import { parse } from 'node:path'

import CheapWatch from 'cheap-watch'

const cacheBustingImportPath = (absoluteFilepath) => `${absoluteFilepath}?now=${Date.now()}-${Math.random()}`

export const configWatcherLoader = (absoluteConfigFilepath, watchMode) => {
	const emitter = new EventEmitter()

	let hasLoaded

	const loadConfigFile = async () => {
		let hasErrors
		try {
			const config = await import(cacheBustingImportPath(absoluteConfigFilepath))
			if (!config?.default) {
				console.error('The configuration file does not appear to have a default export, this is required.', absoluteConfigFilepath)
				hasErrors = true
			} else {
				console.info(`Configuration file ${hasLoaded ? 're' : ''}loaded:`, absoluteConfigFilepath)
				hasLoaded = true
				emitter.emit('config', config.default)
			}
		} catch (error) {
			console.error('An error occurred while loading the configuration file!', error)
		}
		// If we aren't in watch mode, or we're running oamerge the first time, we
		// should just bail entirely. If we're in watch mode, we'll keep oamerge
		// running and hope that the user fixes the issue.
		if (hasErrors && (!watchMode || !hasLoaded)) process.exit(1)
	}

	if (watchMode) {
		const { dir, base } = parse(absoluteConfigFilepath)
		const watch = new CheapWatch({
			dir,
			filter: ({ path }) => path === base,
		})
		watch.init().catch(error => {
			console.error('Unexpected error during initialization of configuration file watcher!', error)
			process.exit(1)
		})
		watch.on('+', loadConfigFile)
		watch.on('-', loadConfigFile)
		loadConfigFile()
	} else {
		loadConfigFile()
	}

	return emitter
}
