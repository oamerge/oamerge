If multiple `inputs` have a `$path` override, they will all be handled
together as a group correctly.

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
				'paths/hello/_.@.js': {
					key: [ 'paths', 'hello', '_' ],
					exports: {
						// The unescaped path string.
						$path: '/not/hello'
					},
				},
				'paths/hello/get.@.js': {
					key: [ 'paths', 'hello', 'get' ],
					exports: {
						default: _ => _,
					},
				},
			},
		},
		{
			dir: 'folder2',
			ext: '@',
			api: '/v1',
			files: {
				'paths/hello/_.@.js': {
					key: [ 'paths', 'hello', '_' ],
					exports: {
						// The unescaped path string.
						$path: '/not/hello'
					},
				},
				'paths/hello/patch.@.js': {
					key: [ 'paths', 'hello', 'patch' ],
					exports: {
						default: _ => _,
					},
				},
			},
		},
	],
}
```

```js #expected
import handler_0 from '../folder1/paths/hello/get.@.js'
import handler_1 from '../folder2/paths/hello/patch.@.js'

export const routes = [
	{
		path: '/v1/not/hello',
		method: 'get',
		handler: handler_0,
	},
	{
		path: '/v1/not/hello',
		method: 'patch',
		handler: handler_1,
	},
]

```
