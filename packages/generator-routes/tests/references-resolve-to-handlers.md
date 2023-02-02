When there is a reference in a Path Item Object, the references are resolved to the correct handler.

```js #config
return {
	cwd: '/root',
	outputDir: './build',
	inputs: [
		{
			dir: 'folder1',
			ext: '@',
			api: '/v1',
			files: {
				'paths/hello/get.@.js': {
					key: [ 'paths', 'hello', 'get' ],
					exports: {
						default: _ => _,
					},
				},
				'paths/hello/patch.@.js': {
					key: [ 'paths', 'hello', 'patch' ],
					exports: {
						default: _ => _,
					},
				},
				'paths/alias/_.@.js': {
					key: [ 'paths', 'alias', '_' ],
					exports: {
						$ref: '#/paths/~1hello',
					},
				},
				'paths/alias/patch.@.js': {
					key: [ 'paths', 'alias', 'patch' ],
					exports: {
						default: _ => _,
					},
				},
			},
		},
	],
}
```

The `alias` inherits all methods, but its own methods will overwrite referenced ones.

```js #expected
import handler_0 from '../folder1/paths/hello/get.@.js'
import handler_1 from '../folder1/paths/alias/patch.@.js'
import handler_2 from '../folder1/paths/hello/patch.@.js'

export const routes = [
	{
		path: '/v1/alias',
		method: 'get',
		handler: handler_0,
	},
	{
		path: '/v1/alias',
		method: 'patch',
		handler: handler_1,
	},
	{
		path: '/v1/hello',
		method: 'get',
		handler: handler_0,
	},
	{
		path: '/v1/hello',
		method: 'patch',
		handler: handler_2,
	},
]

```
