import jwt from 'jsonwebtoken'
const getUserId = (request, requireAuth = true) => {
  // muatations & queries use http and subscriptions use websockets so check is http header exists
  const header = request.req ? request.req.headers.authorization : req.connection.context.Authorization

  if (header) {
    const token = header.replace('Bearer ','')
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