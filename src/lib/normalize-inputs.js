const DEFAULT_EXTENSION = '@'
const DEFAULT_API = '/'

export const normalizeInputs = any => {
	const normalized = {
		dir: undefined,
		ext: DEFAULT_EXTENSION,
		api: DEFAULT_API,
	}
	if (typeof any === 'string') {
		if (any.includes(';') || any.includes('=')) {
			for (const pair of any.split(';')) {
				const [ key, value ] = pair.split('=')
				if (key && value && key in normalized) normalized[key] = value
			}
			console.debug(`Normalized input string "${any}":`, normalized)
		} else {
			normalized.dir = any
		}
	} else if (Array.isArray(any)) {
		return any.map(normalizeInputs)
	} else if (typeof any === 'object') {
		for (const key in normalized) if (any[key]) normalized[key] = any[key]
	}
	if (!normalized.dir) {
		console.error('Could not understand how to get "dir" from input:', any)
		process.exit(1)
	}
	return normalized
}
