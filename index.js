import { ApolloServer, gql } from 'apollo-server'
import axios from 'axios'

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type changed to match the JSON file.
  # the ! means a mandatory field
  # base scalar types are ID, String, Int, Float and Boolean
  # for type book we demonstrate here how to give each field a description in the graphql playground
  type Book {
    "Generated by json-server"
    id: ID!
    "ISBN Number"
    isbn: String!
    "Books title"
    title: String!
    "Optional Subtitle"
    subtitle: String
    "Who wrote the book"
    author: String!
    "Publisher if known"
    publisher: Publisher
    "How many pages if known"
    pages: Int
    "What the book is about"
    description: String
  }
  # [] means it returns a list of the object type in this case Book
  type Publisher {
    id: ID!
    name: String!
    books: [Book]
  }
  # The "Query" type is the root of all GraphQL queries.
  # (x: yyy) are the parameters passed into the function
  type Query {
    books: [Book]
    book(id: ID!): Book
    publisher(id: ID!): Publisher
    publishers: [Publisher]
  }
  # Mutations provide the CRUD operations in the interface
  type Mutation {
    addBook(data: CreateBookInput): Book
    deleteBook(id: ID!): DeletePayload
    updateBook(data: UpdateBookInput): Book
  }
  # json-server does not return the deleted record so return status code
  type DeletePayload {
    statuscode: Int
  }
  # define a definition for mutation inputs
  # publisherId has to match the data source not the schema definition
  input CreateBookInput {
    isbn: String!
    title: String!
    subtitle: String
    author: String!
    publisherId: ID!
    pages: Int
    description: String
  }
  # publisherId has to match the data source not the schema definition
  input UpdateBookInput {
    id: ID!
    isbn: String
    title: String
    subtitle: String
    author: String
    publisherId: ID
    pages: Int
    description: String
  }
`

// Resolvers define the technique for fetching the types in the typeDefs
// in this case the Book.publisher and Publisher.books fields as well as the Queries
// axios returns everything in a data object so we return the contents of data
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
    // all query function receive parent, argument, context and info parameters, we need to use the argument field for some
    books(parent, args, ctx, info) {return axios.get('http://localhost:3000/books').then(res => res.data)},
    book(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/books/${id}`).then(res => res.data)},
    publishers(parent, args, ctx, info) {return axios.get('http://localhost:3000/publishers').then(res => res.data)},
    publisher(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/publishers/${id}`).then(res => res.data)}
  },
  Mutation: {
    addBook(parent, {data}, ctx, info) {return axios.post('http://localhost:3000/books', {...data}).then(res => res.data)},
    // always use patch to update the record and check for failure to find record to update
    updateBook(parent, {data}, ctx, info) {return axios.patch(`http://localhost:3000/books/${data.id}`, {...data}).then(res => {
      return res.data}).catch((e)=> {throw new Error('Unable to update record')})},
    // json-server does not return any data from a delete so return a status code and catch the promise error for failed deletions
    deleteBook(parent, {id}, ctx, info) {return axios.delete(`http://localhost:3000/books/${id}`).then((res) => { 
      return {statuscode: res.status}}).catch((e) => { return {statuscode: e.response.status}})}
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