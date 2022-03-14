const express = require('express')
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors')
const { readFileSync } = require('fs')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const url = process.env.DB_URL

// Construct a schema, using GraphQL schema language
const typeDefs = readFileSync('./server/schema.graphql').toString('utf-8');

let db;

// The root provides a resolver function for each API endpoint
const resolvers = {
    Query: {
        getAllProducts: async () => {
            const result = await db.collection('products').find({})
            return result.toArray()
        }
    },
    Mutation: {
        addNewProduct: async ( _, { product }) => {
            const count = await db.collection('products').count()
            const addedProduct = { ...product, id: count}
            const result = await db.collection('products').insertOne(addedProduct);
            return await db.collection('products')
                .findOne({_id: result.insertedId});
        }
    }
};

const app = express()
const port = process.env.PORT
let server;

async function connectToDb() {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
}

async function startServer() {
    await connectToDb()
    server = new ApolloServer({ typeDefs, resolvers });
    await server.start()
    server.applyMiddleware({ app });
    const fileServerMiddleWare = express.static('public');
    app.use(cors())
    app.use('/', fileServerMiddleWare);
}

startServer().then(() => {
    app.listen(port , () =>
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
    );
})
