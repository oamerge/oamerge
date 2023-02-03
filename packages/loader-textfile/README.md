# OpenAPI Merge > Loader > Text File

Load text files as string in OA Merge.

View more documentation at [OAMerge.com](https://oamerge.com).

## Install

```bash
npm install @oamerge/loader-textfile
```

## Use with OA Merge

```js
import textfile from '@oamerge/loader-textfile'
export default {
	input: 'api',
	output: 'build',
	loaders: [
		textfile({
			// ...
		})
	]
}
```

## License

This software and all example code are dedicated to the [public domain](http://en.wikipedia.org/wiki/Public_Domain).
