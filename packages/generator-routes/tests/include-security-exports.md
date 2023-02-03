If you pass in `security: true` in the generator options, you get the security exports included.

```js #config
return {
	cwd: '/root',
	outputDir: './build',
	includeSecurity: true,
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
						// It doesn't matter what is exported, just that
						// there be an export.
						security: [],
					},
				},
			},
		},
	],
}
```

The output renames the exports, to prevent collisions:

```js #expected
import handler_0, { security as security_0 } from '../folder1/paths/hello/get.@.js'

export const routes = [
	{
		path: '/v1/hello',
		method: 'get',
		handler: handler_0,
		security: security_0,
	},
]

```
