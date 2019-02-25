import jwt from 'jsonwebtoken'
import { isNull } from 'util';
const getUserId = (request, requireAuth = true) => {
  // mutations & queries use http and subscriptions use websockets so check is http header exists
  const header = request.req ? request.req.headers.authorization : req.connection.context.Authorization

  if (header) {
    const token = header.replace('Bearer ','')
    if (isNull(token) || token == 'null' ){
      return null
    }
    // this throws an error if it does not verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.userId
  }
  // return null if no auth else error
  if (requireAuth) {
    throw new Error('Authentication required')
  }
  return null
}

export { getUserId as default }