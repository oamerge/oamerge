import handler_0 from '../api-1/components/securitySchemes/auth1.@.js'
import handler_1 from '../api-2/components/securitySchemes/auth2.@.js'
import handler_2 from '../api-3/components/securitySchemes/auth3.@.js'
import handler_3 from '../api-3/components/securitySchemes/auth4.@.js'

export const security = {
	aliased: handler_0,
	auth1: handler_0,
	auth2: handler_1,
	auth3: handler_2,
	auth4: handler_3,
}
