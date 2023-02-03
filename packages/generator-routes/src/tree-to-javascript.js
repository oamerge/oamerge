import { join, relative, resolve } from 'node:path'

const METHODS_WITH_HANDLERS = [
	'get',
	'put',
	'post',
	'delete',
	'options',
	'head',
	'patch',
	'trace',
]

const getPath = (file, api, suffix) => {
	if (suffix) suffix = (suffix[0] === '/' ? suffix.substring(1) : suffix)
	else suffix = file.key.slice(1, file.key.length - 1).join('/')
	return `${api.endsWith('/') ? api : (api + '/')}${suffix}`
}

const parseReference = string => {
	[ , ...string ] = string.split('/')
	let segments = []
	for (let segment of string) segments.push(segment.replaceAll('~1', '/').replaceAll('~0', '~'))
	return segments
}

const jsString = string => string.includes("'") ? JSON.stringify(string) : `'${string}'`

const makeRoute = includeSecurity => ({ path, method, importsIndex }) => [
	'\t{',
	`\t\tpath: ${jsString(path)},`,
	`\t\tmethod: ${jsString(method)},`,
	`\t\thandler: handler_${importsIndex},`,
	includeSecurity && `\t\tsecurity: security_${importsIndex},`,
	'\t},',
].filter(Boolean).join('\n')

const routeSorter = (a, b) => (a.path + a.method + a.importsIndex.toString()).localeCompare(b.path + b.method + b.importsIndex.toString())

export const treeToJavascript = ({ cwd, outputDir, inputs, includeSecurity }) => {
	const buildPath = resolve(cwd, outputDir)

	/*
	First, we construct a flatter tree that looks like this:

		{
			[OPENAPI_PATH]: {
				[METHOD]: {
					inputIndex: [INDEX],
					filepath: [INPUT_FILEPATH],
				}
			}
		}

	The merge order is:
	- Last `inputs` array element wins.
	- Files first, then directories.
	*/
	const pathToMethod = {}

	// Create the merged tree, last-in-wins. Note that if the default export is `null` it means
	// to remove that path.
	for (const { dir, api, files } of inputs) {
		for (const filepath of Object.keys(files).sort()) {
			if (files[filepath].key[0] !== 'paths') continue
			const lastKey = files[filepath].key[files[filepath].key.length - 1]
			if (files[filepath].exports?.default !== undefined && METHODS_WITH_HANDLERS.includes(lastKey)) {
				const path = getPath(files[filepath], api)
				const method = lastKey.toLowerCase()
				pathToMethod[path] = pathToMethod[path] || {}
				pathToMethod[path][method] = {
					dir,
					filepath,
					handler: !!files[filepath].exports?.default,
					security: !!files[filepath].exports?.security,
				}
			}
		}
	}
	// We loop again, to resolve references, path overwrites, and underscore method handler overrides.
	const rewrittenPaths = {}
	for (const { dir, api, files } of inputs) {
		for (const filepath of Object.keys(files).sort()) {
			if (files[filepath].key[0] !== 'paths') continue

			// Here we handle path rewrites.
			const originalPath = getPath(files[filepath], api)
			const path = files[filepath].exports?.$path
				? getPath(files[filepath], api, files[filepath].exports?.$path)
				: originalPath
			if (originalPath && path && originalPath !== path) {
				if (rewrittenPaths[originalPath] && rewrittenPaths[originalPath] !== path) {
					console.warn(`The path rewrite "${originalPath}" => "${path}" has a conflict with "${originalPath}" => "${rewrittenPaths[originalPath]}" in file "${join(dir, filepath)}".`)
				} else if (!rewrittenPaths[originalPath]) {
					rewrittenPaths[originalPath] = path
					pathToMethod[path] = pathToMethod[originalPath]
					delete pathToMethod[originalPath]
				}
			}

			const lastKey = files[filepath].key[files[filepath].key.length - 1]
			const secondToLastKey = files[filepath].key[files[filepath].key.length - 2]
			if (lastKey === '_' && METHODS_WITH_HANDLERS.includes(secondToLastKey) && files[filepath].exports?.default) {
				const actualPath = path.split('/')
				actualPath.pop()
				pathToMethod[actualPath.join('/')][secondToLastKey] = {
					dir,
					filepath,
					handler: true,
					security: files[filepath].exports?.security,
				}
				continue
			}

			let ref = lastKey === '_' && files[filepath].exports?.$ref
			if (!ref) continue

			if (ref && !ref.startsWith('/') && !ref.startsWith('#/')) {
				console.error(`References must be schema-relative, e.g. start with "/" or "#/". Found non-relative reference "${ref}" in "${join(dir, filepath)}".`)
				continue
			}

			const keypath = parseReference(ref)
			if (keypath[0] !== 'paths') {
				console.error(`OA Merge does not yet support path references to non-path objects. Found non-path reference "${ref}" in "${join(dir, filepath)}".`)
				continue
			}
			const referencePath = api + keypath[1]
			if (!pathToMethod[referencePath]) {
				console.error(`Could not resolve reference "${ref}" in "${join(dir, filepath)}".`)
				continue
			}

			pathToMethod[path] = pathToMethod[path] || {}
			// If this path doesn't have a method, use the originating references operation object:
			for (const method in pathToMethod[referencePath]) {
				if (!pathToMethod[path][method]) pathToMethod[path][method] = pathToMethod[referencePath][method]
			}
		}
	}

	/*
	Once the merged tree is built, we turn that into a list of imports
	and an exported list of router-consumable objects.
	*/
	const imports = []
	const importIndexToSecurity = {}
	const routes = []
	// Resolve the handlers as default exports, removing nullified handlers.
	for (const path of Object.keys(pathToMethod).sort()) {
		for (const method of Object.keys(pathToMethod[path]).sort()) {
			if (pathToMethod[path][method].handler) {
				const filepath = join(pathToMethod[path][method].dir, pathToMethod[path][method].filepath)
				let importsIndex = imports.indexOf(filepath)
				if (importsIndex < 0) {
					importsIndex = imports.length
					imports.push(filepath)
				}
				importIndexToSecurity[importsIndex] = pathToMethod[path][method].security
				routes.push({ path, method, importsIndex })
			}
		}
	}

	const getImportSignature = index => includeSecurity && importIndexToSecurity[index]
		? `handler_${index}, { security as security_${index} }`
		: `handler_${index}`
	let importsLines = imports.map((filepath, index) => `import ${getImportSignature(index)} from ${jsString(relative(buildPath, resolve(buildPath, join(cwd, filepath))))}`)
	importsLines = importsLines.length
		? `${importsLines.join('\n')}\n\n`
		: ''
	const routesLines = routes.length
		? `export const routes = [\n${routes.sort(routeSorter).map(makeRoute(includeSecurity)).join('\n')}\n]\n`
		: 'export const routes = []\n'

	return importsLines + routesLines
}
