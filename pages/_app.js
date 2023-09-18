import '@/styles/globals.css'
import * as ethers from 'ethers'
import { DAppProvider, Polygon, useEthers } from '@usedapp/core'
import Link from 'next/link'
import stars from '../styles/background.svg'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import homeimage from '../styles/home.png'

const apolloClient = new ApolloClient({
  uri: 'https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-polygon-v3',
  cache: new InMemoryCache(),
})

const config = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    // in this tutorial we use Ankr public RPC. It's free and has it's own limits
    // in the production version with a large number of users, we do not recommend using it
    [Polygon.chainId]: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/polygon/8ad80e4efbc64c4ed4ba467e4fea2c07b7b83e64bd0249fb6cb8e6f3588779c8'),
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
      <Link className="text-lg font-semibold" href="/"><img src={homeimage.src}></img></Link>
      <div className="flex space-x-8">
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
