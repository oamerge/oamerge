import timers from 'node:timers/promises'

export const simpleThrottle = promiseFn => {
	let running
	let oneMoreToGo
	const run = async () => {
		if (running) {
			if (!oneMoreToGo) {
				oneMoreToGo = true
				return timers.setTimeout(1).then(() => run())
			}
			return undefined
		}
		running = true
		return promiseFn()
			.then(() => {
				running = false
				if (oneMoreToGo) {
					oneMoreToGo = false
					return run()
				}
			})
	}
	return run
}
