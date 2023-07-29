import '@/styles/globals.css'
import * as ethers from 'ethers'
import { DAppProvider, Polygon, useEthers } from '@usedapp/core'
import Link from 'next/link'
import stars from '../styles/background.svg'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { useState } from 'react'

const apolloClient = new ApolloClient({
  uri: 'https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-polygon',
  cache: new InMemoryCache(),
})

const config = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    // in this tutorial we use Ankr public RPC. It's free and has it's own limits
    // in the production version with a large number of users, we do not recommend using it
    [Polygon.chainId]: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/polygon'),
  },
}

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()

  // 'account' being undefined means that user is not connected
  const title = account ? 'Disconnect Wallet' : 'Connect Wallet'
  const action = account ? deactivate : activateBrowserWallet
  

  return (
    <button className="connectbutton" onClick={() => action()}>{title}</button>
  )
}

const PageLayout = ({ children }) => {
  const { account } = useEthers()
  return (
  <div  style={{color:'white', backgroundColor:'rgb(7,5,18)', backgroundImage: `url('${stars.src}')`}}>
    <div className={account ? 'container': 'container'} >
    <div className="flex items-center justify-between pt-3 pb-16">
      <Link className="text-lg font-semibold" href="/">Normies | Powered by AZURO</Link>
      <div className="flex space-x-8">
        {/* <Link className="text-md" href="/">Events</Link> */}
        {/* <Link className="text-md" href="/bets-history">Bets History</Link> */}
      </div>
      <ConnectButton />
    </div>
    {children}
    </div>
  </div>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <DAppProvider config={config}>
      <ApolloProvider client={apolloClient}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ApolloProvider>
    </DAppProvider>
  )
}
