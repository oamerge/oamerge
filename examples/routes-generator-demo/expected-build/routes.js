import handler_0 from '../api-3/paths/aliased-path/get.@.js'
import handler_1 from '../api-1/paths/hello/[name]/patch.@.js'
import handler_2 from '../api-3/paths/hello/[name]/post.@.js'
import handler_3 from '../api-2/paths/hello/[name]/put.@.js'
import handler_4 from '../api-3/paths/hello/[name]/get.@.js'

export const routes = [
	{
		path: '/aliased-path',
		method: 'get',
		handler: handler_0,
	},
	{
		path: '/aliased-path',
		method: 'patch',
		handler: handler_1,
	},
	{
		path: '/aliased-path',
		method: 'post',
		handler: handler_2,
	},
	{
		path: '/aliased-path',
		method: 'put',
		handler: handler_3,
	},
	{
		path: '/hello/{name}',
		method: 'get',
		handler: handler_4,
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
