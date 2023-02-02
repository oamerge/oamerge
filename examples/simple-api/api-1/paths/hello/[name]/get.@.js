export const summary = 'Says Hello'
export const description = 'Simple example using the NodeJS http request/response model.'
export default async (request, response) => {
	response.statusCode = 200
	response.setHeader('Content-Type', 'text/plain')
	response.end('Hello World!')
}
