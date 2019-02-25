import { ApolloServer } from 'apollo-server'
import { importSchema } from 'graphql-import'
import { resolvers } from './resolvers/index'

const typeDefs = importSchema('./src/schema.graphql')
// set up any dataSources our resolvers need

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context(request) {
        return {
            request
        }
    }
})

export { server as default }