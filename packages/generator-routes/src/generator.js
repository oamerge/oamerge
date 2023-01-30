export const generator = ({ output: outputFilepath }) => async ({ cwd, output: outputDir, TREE: { inputs } }) => {
	console.debug('Running generator:', { outputFilepath, cwd, outputDir, inputs })
}
