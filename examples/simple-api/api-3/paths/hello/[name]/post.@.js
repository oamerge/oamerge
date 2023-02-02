export const summary = 'Create Person'
export const description = 'Create a new person if the name does not exist already.'
export default async (request, response) => {
	response.statusCode = 200
	response.setHeader('Content-Type', 'text/plain')
	response.end('Hello World!')
}
