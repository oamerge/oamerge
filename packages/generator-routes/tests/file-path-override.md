Setting an export as `$path` will override the filepath based path generation.

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
						// The unescaped path string.
						$path: '/not/hello'
					},
				},
			},
		},
	],
}
```

```js #expected
import handler_0 from "../folder1/paths/hello/get.@.js"

export const routes = [
	{
		path: "/v1/not/hello",
		method: "get",
		handler: handler_0,
	},
]

```
