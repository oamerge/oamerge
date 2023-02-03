# OpenAPI Merge > Generator > Security

Generate security scheme handlers from OpenAPI filepaths using OA Merge.

View more documentation at [OAMerge.com](https://oamerge.com).

## Install

```bash
npm install @oamerge/generator-security
```

## Use with OA Merge

```js
import security from '@oamerge/generator-security'
export default {
	input: 'api',
	output: 'build',
	generators: [
		security({
			// ...
		})
	]
}
```

## Options

The following options are:

- `output` <`String`> - The output filepath where the generated file will be written, relative to the root `output` property. (Default: `security.js`)

## License

This software and all example code are dedicate to the [public domain](http://en.wikipedia.org/wiki/Public_Domain).
