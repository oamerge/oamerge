import { test } from 'uvu'
import * as assert from 'uvu/assert'
import timers from 'node:timers/promises'

import { simpleThrottle } from './simple-throttle.js'


test('simple-throttle', async () => {
	let executions = 0
	const work = async () => {
		executions++
		await timers.setTimeout(100)
	}
	const throttle = simpleThrottle(() => work())
	throttle() // the first should always fire
	await timers.setTimeout(25)
	throttle() // the first one has not finished so this asks for another
	await timers.setTimeout(25)
	throttle() // still not done so this asks for one more, but the previous one is now ignored
	await timers.setTimeout(150)
	await throttle() // the first should be done and the second one, so this should fire a third time
	// (have to await the last throttle call or execution ends early)
	assert.equal(executions, 3, 'the first, the in-between, and after-completed should trigger')
})

test.run()
