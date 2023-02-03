import handler_0, { security as security_0 } from '../api/paths/hello/get.@.js'

export const routes = [
	{
		path: '/hello',
		method: 'get',
		handler: handler_0,
		security: security_0,
	},
]
