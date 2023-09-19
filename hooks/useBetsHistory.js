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
 
export default function useBetsHistory() {
  const { account } = useEthers()
 
  return useQuery(gql`${QUERY}`, {
    variables: {
      first: 10, // in this tutorial, only 10 bets are loaded. In production, pagination loading should be implemented to avoid heavy requests which can lead to GraphQL errors
      where: {
        actor: account?.toLowerCase(),
      },
    },
    skip: !account,
  })
}