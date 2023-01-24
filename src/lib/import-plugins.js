import { isAbsolute, resolve } from 'node:path'

const load = async (prefix, cwd, string) => {
	let mod
	try {
		// First we try to load it as-is, which works for normal NodeJS module resolution.
		mod = await import(string)
	} catch (error) {
		// If the module wasn't found, it could be that it's a relative filepath, so we
		// attempt loading it that way.
		if (error.code === 'ERR_MODULE_NOT_FOUND' && !isAbsolute(string)) {
			try {
				mod = await import(resolve(cwd, string))
			} catch (error) {
				console.error(`${prefix} "${string}" could not be loaded:`, error.code)
			}
		} else console.error(`${prefix} "${string}" could not be loaded:`, error.code)
	}
	if (mod?.default) return mod.default
	else console.error(`${prefix} module "${string}" did not have a default export. To use ${prefix.toLowerCase()}s with named exports, you will need to use a configuration file.`)
}

export const importPlugins = async (prefix, pluginStringOrFunction, cwd) => {
	pluginStringOrFunction = Array.isArray(pluginStringOrFunction)
		? pluginStringOrFunction
		: (pluginStringOrFunction ? [ pluginStringOrFunction ] : [])
	const imported = []
	let hasErrors
	for (const plugin of pluginStringOrFunction) {
		if (typeof plugin === 'string') {
			const mod = await load(prefix, cwd, plugin)
			console.debug(`${prefix} loaded:`, plugin)
			if (mod) imported.push(mod)
			else hasErrors = true
		} else if (plugin) {
			imported.push(plugin)
		}
	}
	if (hasErrors) process.exit(1)
	return imported
}
