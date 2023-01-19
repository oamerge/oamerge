export const setupPlugins = async (prefix, pluginNames) => {
	pluginNames = Array.isArray(pluginNames)
		? pluginNames
		: (pluginNames ? [ pluginNames ] : [])
	const imported = []
	let hasErrors
	for (const name of pluginNames) {
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
