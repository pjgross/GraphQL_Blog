import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link'

// The http link is a terminating link that fetches GraphQL results from a GraphQL
// endpoint over an http connection.
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

// Use this link to do some custom logic when a GraphQL or network error happens
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: 
          ${locations}, Path: ${path}`))
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  }
})

// use ApolloLink to add headers to each request to the server
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers

  if (localStorage.getItem('token')) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${localStorage.getItem('token')}` || null
      }
    }))
  }
  return forward(operation)
})

// create the apollo client
const client = new ApolloClient({
  link: from([
    authMiddleware,
    errorLink,
    httpLink
  ]),
  cache: new InMemoryCache()
})

export default client
