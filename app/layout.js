"use client"

import Nav from "@components/Nav"
import "@styles/globals.css"
import Web3ContextProvider from "../context/Web3Context";
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/48685/definitiverps/version/latest",
})

export const metadata = {
  title: 'RPS Game',
  description: 'Secure Rock Paper Scissors game on-chain',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative">
        <Web3ContextProvider>
          <ApolloProvider client={client}>
            <div className="full-web bg-gradient-to-b from-cyan-400 to-cyan-900 pb-20">
              <Nav />
              {children}
            </div>
          </ApolloProvider>
        </Web3ContextProvider>
      </body>
    </html>
  )
}
