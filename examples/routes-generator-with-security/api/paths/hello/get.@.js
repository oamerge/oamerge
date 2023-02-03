export const summary = 'Says Hello, Securely'
export const security = [
	{ api_key: [] },
]
export default async (request, response) => {
	response.statusCode = 200
	response.setHeader('Content-Type', 'text/plain')
	response.end('Hello World!')
}
