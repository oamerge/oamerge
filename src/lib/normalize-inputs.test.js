import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { normalizeInputs } from './normalize-inputs.js'

test('normalize-inputs', () => {
	assert.equal(
		normalizeInputs('foo'),
		[
			{ dir: 'foo', ext: '@', api: '/' },
		],
		'single plain string',
	)
	assert.equal(
		normalizeInputs([ 'foo', 'bar' ]),
		[
			{ dir: 'foo', ext: '@', api: '/' },
			{ dir: 'bar', ext: '@', api: '/' },
		],
		'multiple plain string',
	)
	assert.equal(
		normalizeInputs('dir=foo;ext=$;api=/fizz'),
		[
			{ dir: 'foo', ext: '$', api: '/fizz' },
		],
		'single cli string',
	)
	assert.equal(
		normalizeInputs([ 'dir=foo;ext=$;api=/fizz', 'dir=boo;ext=!;api=/biz' ]),
		[
			{ dir: 'foo', ext: '$', api: '/fizz' },
			{ dir: 'boo', ext: '!', api: '/biz' },
		],
		'multiple cli strings',
	)
	assert.equal(
		normalizeInputs({ dir: 'foo', ext: '$', api: '/bar' }),
		[
			{ dir: 'foo', ext: '$', api: '/bar' },
		],
		'single object',
	)
	assert.equal(
		normalizeInputs([
			{ dir: 'foo', ext: '$', api: '/bar' },
			{ dir: 'fizz', ext: '!', api: '/buzz' },
		]),
		[
			{ dir: 'foo', ext: '$', api: '/bar' },
			{ dir: 'fizz', ext: '!', api: '/buzz' },
		],
		'multiple objects',
	)
})

test.run()
