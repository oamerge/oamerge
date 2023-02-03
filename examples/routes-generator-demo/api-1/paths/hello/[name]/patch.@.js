export const summary = 'Update Person'
export const description = 'Update sparse properties of a person.'
export default async (request, response) => {
	response.statusCode = 200
	response.setHeader('Content-Type', 'text/plain')
	response.end('Hello World!')
}
