import { ApolloServer, gql } from 'apollo-server'
import axios from 'axios'

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type changed to match the JSON file.
  type Book {
    id: ID!
    isbn: String!
    title: String!
    subtitle: String
    author: String!
    publisher: Publisher
    pages: Int
    description: String
  }
  type Publisher {
    id: ID!
    name: String!
    books: [Book]
  }
  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
    book(id: ID!): Book
    publisher(id: ID!): Publisher
    publishers: [Publisher]
  }
`

// Resolvers define the technique for fetching the types in the typeDefs
// in this case the Book.publisher and Publisher.books fields as well as the Queries
const resolvers = {
  // need to tell the Book type how to fetch its associated publisher record
  // the publisher function receives all of the book fields as an argument so deconstruct the PublisherId field
  Book: {
    publisher({publisherId}) {return axios.get(`http://localhost:3000/publishers/${publisherId}`).then(res => res.data)}
  },
  // need to tell the Publisher type how to fetch the associated books
  // the books function receives all of the publisher fields as an argument so deconstruct the publishers id
  Publisher: {
    books({id}){ return axios.get(`http://localhost:3000/publishers/${id}/books`).then(res => res.data) }
  },
  Query: {
    // axios returns everything in a data object so we return the contents of data
    // all query function receive parent, argument, context and info parameters, we need to use the argument field for some
    books(parent, args, ctx, info) {return axios.get('http://localhost:3000/books').then(res => res.data)},
    book(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/books/${id}`).then(res => res.data)},
    publishers(parent, args, ctx, info) {return axios.get('http://localhost:3000/publishers').then(res => res.data)},
    publisher(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/publishers/${id}`).then(res => res.data)}
  }
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers })

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})