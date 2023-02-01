Setting an export as `null` will remove the handler, as part of merging multiple inputs.

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
			},
		},
		{
			dir: 'folder2',
			ext: '@',
			api: '/v1',
			files: {
				'paths/hello/get.@.js': {
					// The same schema key, except...
					key: [ 'paths', 'hello', 'get' ],
					exports: {
						// The default export is null, e.g. `export default null`
						default: null,
					},
				},
			},
		},
	],
}
```

Because the second input has the same path, and the default export is `null`, the first
path gets removed.

```js #expected
export const routes = []

```
