import React from "react";
import ReactDOM from "react-dom";
import {Products} from "./Products";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache()
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Products />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("app")
);
