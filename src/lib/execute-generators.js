export const executeGenerators = async (cwd, output, generators, TREE) => Promise.all(generators.map(
	generate => generate({ cwd, output, TREE })
		.catch(error => {
			console.error('Error while generating output!', error)
		}),
))
