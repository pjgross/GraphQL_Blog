import axios from 'axios'

const Query = {
  // all query function receive parent, argument, context and info parameters, we need to use the argument field for some
  books(parent, args, ctx, info) {return axios.get('http://localhost:3000/books').then(res => res.data)},
  book(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/books/${id}`).then(res => res.data)},
  publishers(parent, args, ctx, info) {return axios.get('http://localhost:3000/publishers').then(res => res.data)},
  publisher(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/publishers/${id}`).then(res => res.data)},
  users(parent, args, {prisma}, info) {
    const opArgs = {
      first: args.first,
      skio: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
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
      opArgs.where = {
        bookId: args.query
      }
    }
    // the query from the client comes through on info
    return prisma.query.booklikes(opArgs, info)

  }
}

export { Query as default }