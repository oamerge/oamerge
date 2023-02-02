import handler_0 from '../api-3/paths/hello/[name]/get.@.js'
import handler_1 from '../api-1/paths/hello/[name]/patch.@.js'
import handler_2 from '../api-3/paths/hello/[name]/post.@.js'
import handler_3 from '../api-2/paths/hello/[name]/put.@.js'

export const routes = [
	{
		path: '/hello/{name}',
		method: 'get',
		handler: handler_0,
	},
	{
		path: '/hello/{name}',
		method: 'patch',
		handler: handler_1,
	},
	{
		path: '/hello/{name}',
		method: 'post',
		handler: handler_2,
	},
	{
		path: '/hello/{name}',
		method: 'put',
		handler: handler_3,
	},
]
