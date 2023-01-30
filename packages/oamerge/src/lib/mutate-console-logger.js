const RED = '\x1b[31m%s\x1b[0m'
const YELLOW = '\x1b[33m%s\x1b[0m'
const CYAN = '\x1b[36m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'

const colors = {
	warn: YELLOW,
	debug: CYAN,
	info: GREEN,
	error: RED,
}

/**
 * Used only by the CLI, to make the logged output a little easier to parse and look at.
 *
 * @param {Boolean} printDate - If truthy an ISO-8601 date string will prefix each log entry.
 * @param {Boolean} useColors - If truthy the prefix for log entries will use colors to denote levels.
 * @param {Boolean} printDebug - If not truthy, calls to `console.debug` will not be shown.
 */
export const mutateConsoleLogger = ({ printDate, useColors, printDebug }) => {
	for (const level in colors) {
		// eslint-disable-next-line no-console
		const original = console[level]
		// eslint-disable-next-line no-console
		console[level] = (...args) => {
			const prefix = printDate
				? `[${new Date().toISOString()}]`
				: `[${level.toUpperCase()}]`
			if (useColors) original(colors[level], prefix, ...args)
			else original(prefix, ...args)
		}
	}
	if (!printDebug) console.debug = () => {
		// no-op
	}
}
