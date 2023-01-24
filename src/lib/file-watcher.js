import { join, parse } from 'node:path'
import { EventEmitter } from 'node:events'

import CheapWatch from 'cheap-watch'

export const fileWatcher = (cwd, inputs) => {
	const emitter = new EventEmitter()

	let index = 0
	for (const { dir, ext } of inputs) {
		const suffix = `.${ext}`
		const inputIndex = index
		index++
		const watch = new CheapWatch({
			dir: join(cwd, dir),
			filter: ({ path, stats }) => stats.isFile() && parse(path).name.endsWith(suffix),
		})
		watch.init().catch(error => {
			console.error('Unexpected error during initialization of configuration file watcher!', error)
			process.exit(1)
		})
		watch.on('+', ({ path }) => {
			emitter.emit('file:+', inputIndex, path)
		})
		watch.on('-', ({ path }) => {
			emitter.emit('file:-', inputIndex, path)
		})
	}

	return emitter
}
