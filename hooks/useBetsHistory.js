import { gql, useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
 
const QUERY = `
  query BetsHistory($first: Int, $where: Bet_filter!) {
    bets(
      first: $first,
      orderBy: createdBlockTimestamp,
      orderDirection: desc,
      where: $where,
      subgraphError: allow
    ) {
      id
      betId
      amount
      potentialPayout
      status
      isRedeemed
      odds
      result
      createdAt: createdBlockTimestamp
      txHash: createdTxHash
      core {
        address
        liquidityPool {
          address
        }
      }
      _games {
        id
        participants {
          name
          image
        }
        sport {
            name
          }
          league {
            name
            country {
              name
            }
          }
        startsAt
      }
    }
  }
`
 
export default function useBetsHistory(betHist) {
  const { account } = useEthers()
  console.log("bet hist", betHist)
  if (betHist) {
    return useQuery(gql`${QUERY}`, {
      variables: {
        first: 50, // in this tutorial, only 10 bets are loaded. In production, pagination loading should be implemented to avoid heavy requests which can lead to GraphQL errors
        where: {
          actor: account?.toLowerCase(),
        },
      },
      skip: !account,
    })
  } else {
    return useQuery(gql`${QUERY}`, {
      variables: {
        first: 50, // in this tutorial, only 10 bets are loaded. In production, pagination loading should be implemented to avoid heavy requests which can lead to GraphQL errors
        where: {
          actor: account?.toLowerCase(),
          isRedeemed: betHist,
          result: 'Won'
        },
      },
      skip: !account,
    })
  }
  
}