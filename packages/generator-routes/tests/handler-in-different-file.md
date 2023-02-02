A default export in an underscore file will override the method file handler.

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
				'paths/hello/get/_.@.js': {
					key: [ 'paths', 'hello', 'get', '_' ],
					exports: {
						default: _ => _,
					},
				},
			},
		},
	],
}
```

Because the underscore file is more specific, that handler is used instead of the first.

```js #expected
import handler_0 from '../folder1/paths/hello/get/_.@.js'

export const routes = [
	{
		path: '/v1/hello',
		method: 'get',
		handler: handler_0,
	},
]

```
