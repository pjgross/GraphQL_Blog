import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Book from './Book'
import Publisher from './Publisher'
import User from './User'

const resolvers = {
  Query,
  Mutation,
  Book,
  Publisher,
  User
}

// need to use fragment replacements to make sure we always get the
// fields we require see user.js
const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }