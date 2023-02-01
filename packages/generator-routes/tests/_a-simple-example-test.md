The test framework is a bespoke, home-grown design.

This text here is not used by the test, you can write anything you want, and it's
not going to change the test itself.

To make a test, you just need two code blocks, one identified with `#config` and the
other with `#expected`. Here's the config one (note that you need to `return` the
constructed configuration object):

```js #config
return {
	cwd: '/root',
	outputDir: './build',
	inputs: [
		{
			// You can even put comments in the #config code, to better
			// describe the test, if it would be helpful.
			dir: 'folder1',
			ext: '@',
			api: '/v1',
			files: {
				'paths/hello/world/get.@.js': {
					key: [ 'paths', 'hello', 'world', 'get' ],
					exports: {
						default: _ => _,
					},
				},
			},
		},
	],
}
```

In between, or anywhere else, you can write markdown, or other JavaScript code blocks,

```js
const like_this = 'but only do this if helpful'
```

The `#expected` block is compared to the generated output by string strict equality, so whatever
is here is *exactly* what will be asserted as equal. (In other words, no comments here.)

```js #expected
import handler_0 from "../folder1/paths/hello/world/get.@.js"

export const routes = [
	{
		path: "/v1/hello/world",
		method: "get",
		handler: handler_0,
	},
]

```
