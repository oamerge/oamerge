import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { treeToJavascript } from './tree-to-javascript.js'

export const generator = ({ output: outputDirFilepath }) => async ({ cwd, output: outputDir, TREE: { inputs } }) => {
	const outputFullFilepath = join(outputDir, outputDirFilepath)
	await mkdir(dirname(outputFullFilepath), { recursive: true })
	const code = treeToJavascript({ cwd, outputDir: dirname(outputFullFilepath), inputs })
	await writeFile(outputFullFilepath, code, 'utf8')
}
