"use client"

import "@styles/globals.css";
import Nav from "@components/Nav";
import Web3ContextProvider from "../Context/Web3Context";

import GraphExample from "@graphExample";
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client"
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/48685/rockpaperscissorsgame/v0.0.1"
})



// export const metadata = {
//     title: "Promptopia",
//     description: "Discover and share AI prompts"
// }

const RootLayout = ({children}) => {
  return (

    <html lang="en">
        <body className="bg-cyan-900">
            <ApolloProvider client={client}>
              <Web3ContextProvider>
                <main className="app">
                    <GraphExample />
                    <Nav />
                    {children}
                </main>
              </Web3ContextProvider>
            </ApolloProvider>
        </body>
    </html>
  )
}

export default RootLayout