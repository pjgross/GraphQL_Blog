import { ApolloServer } from 'apollo-server'
import { importSchema } from 'graphql-import'
import { resolvers, fragmentReplacements } from './resolvers/index'
import prisma from './prisma'

const typeDefs = importSchema('./src/schema.graphql')
// set up any dataSources our resolvers need

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context(request) {
        return {
            prisma,
            request
        }
    },
    fragmentReplacements
})

export { server as default }