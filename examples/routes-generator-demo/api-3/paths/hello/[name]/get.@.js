export const summary = 'Says Hello (Overwrite)'
export const description = 'Say hello in a different way!'
export default async (request, response) => {
	response.statusCode = 200
	response.setHeader('Content-Type', 'text/plain')
	response.end('Hello World!')
}
