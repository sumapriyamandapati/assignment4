import React from "react";
import ReactDOM from "react-dom";
import {Products} from "./Products";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.API_SERVER,
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
