import { join, relative, resolve } from 'node:path'

const parseReference = string => {
	[ , ...string ] = string.split('/')
	let segments = []
	for (let segment of string) segments.push(segment.replaceAll('~1', '/').replaceAll('~0', '~'))
	return segments
}

const jsPropName = string => string
const jsString = string => string.includes("'") ? JSON.stringify(string) : `'${string}'`

const makeSecurity = (name, importsIndex) => `\t${jsPropName(name)}: handler_${importsIndex},`

const isSecurityScheme = keys => keys[0] === 'components'
	&& keys[1] === 'securitySchemes'
	&& keys.length === 3

export const treeToJavascript = ({ cwd, outputDir, inputs }) => {
	const buildPath = resolve(cwd, outputDir)

	/*
	First, we construct a flat tree which is a simple key-value map:

		{
			[SECURITY_SCHEME_NAME]: {
				dir: [INPUT_DIR],
				filepath: [INPUT_FILEPATH],
				handler: [BOOLEAN]
			}
		}

	The merge order is:
	- Last `inputs` array element wins.
	- Sorted files first, first to last.
	*/
	const securitySchemes = {}

	// Create the merged tree, last-in-wins. Note that if the default export is `null` it means
	// to remove that security scheme.
	for (const { dir, files } of inputs) {
		for (const filepath of Object.keys(files).sort()) {
			if (!isSecurityScheme(files[filepath].key)) continue
			if (files[filepath].exports?.default !== undefined) {
				securitySchemes[files[filepath].key[2]] = {
					dir,
					filepath,
					handler: !!files[filepath].exports?.default,
				}
			}
		}
	}
	// We loop once more, to resolve references.
	for (const { dir, files } of inputs) {
		for (const filepath of Object.keys(files).sort()) {
			if (!isSecurityScheme(files[filepath].key)) continue

			let ref = files[filepath].exports?.$ref
			if (!ref) continue

			if (ref && !ref.startsWith('/') && !ref.startsWith('#/')) {
				console.error(`References must be schema-relative, e.g. start with "/" or "#/". Found non-relative reference "${ref}" in "${join(dir, filepath)}".`)
				continue
			}

			const keypath = parseReference(ref)
			if (!isSecurityScheme(keypath)) {
				console.error(`OA Merge does not yet support security scheme references to non-security-scheme objects. Found reference "${ref}" in "${join(dir, filepath)}".`)
				continue
			}
			if (!securitySchemes[keypath[2]]) {
				console.error(`Could not resolve reference "${ref}" in "${join(dir, filepath)}".`)
				continue
			}

			securitySchemes[files[filepath].key[2]] = securitySchemes[keypath[2]]
		}
	}

	/*
	Once the merged tree is built, we turn that into a list of imports
	and an exported list of router-consumable objects.
	*/
	const imports = []
	const handlers = {}
	// Resolve the handlers as default exports, removing nullified handlers.
	for (const schemeName of Object.keys(securitySchemes).sort()) {
		if (securitySchemes[schemeName].handler) {
			const filepath = join(securitySchemes[schemeName].dir, securitySchemes[schemeName].filepath)
			let importsIndex = imports.indexOf(filepath)
			if (importsIndex < 0) {
				importsIndex = imports.length
				imports.push(filepath)
			}
			handlers[schemeName] = importsIndex
		}
	}

	let importsLines = imports.map((filepath, index) => `import handler_${index} from ${jsString(relative(buildPath, resolve(buildPath, join(cwd, filepath))))}`)
	importsLines = importsLines.length
		? `${importsLines.join('\n')}\n\n`
		: ''
	const securityLines = Object.keys(handlers).length
		? `export const security = {\n${Object.keys(handlers).sort().map(key => makeSecurity(key, handlers[key])).join('\n')}\n}\n`
		: 'export const security = {}\n'

	return importsLines + securityLines
}
