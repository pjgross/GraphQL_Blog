import axios from 'axios'
import getUserId from '../utils/getUserId'
const Query = {
  // all query function receive parent, argument, context and info parameters, we need to use the argument field for some
  books(parent, args, ctx, info) {return axios.get('http://localhost:3000/books').then(res => res.data)},
  book(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/books/${id}`).then(res => res.data)},
  publishers(parent, args, ctx, info) {return axios.get('http://localhost:3000/publishers').then(res => res.data)},
  publisher(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/publishers/${id}`).then(res => res.data)},
  getCurrentUser(parent, args, {prisma, request}, info) {
    const userId = getUserId(request)
    const opArgs = { where: { id: userId}}
    return prisma.query.user(opArgs, info)
  },
  users(parent, args, {prisma}, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = {
          email: args.query
        }
      }
    
    // the query from the client comes through on info
    return prisma.query.users(opArgs, info)
  },
  booklikes(parent, args, {prisma}, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = { OR: [
        {bookId: args.query},{user: { email: args.query}}]
      }
    }
    // the query from the client comes through on info
    return prisma.query.booklikes(opArgs, info)
  }
}

export { Query as default }
