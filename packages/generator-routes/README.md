# OpenAPI Merge > Generator > Routes

Generate common routes from OpenAPI filepaths using OA Merge.

View more documentation at [OAMerge.com](https://oamerge.com).

## Install

```bash
npm install @oamerge/generator-routes
```

## Use with OA Merge

```js
import routes from '@oamerge/generator-routes'
export default {
	input: 'api',
	output: 'build',
	generators: [
		routes({
			// ...
		})
	]
}
```

## Options

The following options are:

- `output` <`String`> - The output filepath where the generated file will be written, relative to the root `output` property. (Default: `routes.js`)

## License

This software and all example code are dedicated to the [public domain](http://en.wikipedia.org/wiki/Public_Domain).
