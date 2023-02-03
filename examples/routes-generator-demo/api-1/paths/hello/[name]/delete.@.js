export const summary = 'Remove Person'
export const description = 'Remove a person.'
export default async (request, response) => {
	response.statusCode = 200
	response.setHeader('Content-Type', 'text/plain')
	response.end('Hello World!')
}
