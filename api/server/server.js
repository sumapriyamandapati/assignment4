const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors')
const { readFileSync } = require('fs')

// Construct a schema, using GraphQL schema language
const typeDefs = readFileSync('./server/schema.graphql').toString('utf-8');

const products = []

// The root provides a resolver function for each API endpoint
const resolvers = {
    Query: {
        getAllProducts: () => {
            return products
        }
    },
    Mutation: {
        getProductById: ( _, { id }) => {
            console.log(id)
            return products.find(value => value.id === id)
        },
        addNewProduct: ( _, { product }) => {
            const addedProduct = { ...product, id: products ? products.length : 0}
            products.push(addedProduct)
            return addedProduct
        }
    }
};

const app = express()
const port = 3000
let server;

async function startServer() {
    server = new ApolloServer({ typeDefs, resolvers });
    await server.start()
    server.applyMiddleware({ app });
    const fileServerMiddleWare = express.static('public');
    app.use(cors())
    app.use('/', fileServerMiddleWare);
}

startServer().then(value => {
    app.listen(port , () =>
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
    );
})
