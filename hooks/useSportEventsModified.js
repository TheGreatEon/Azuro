import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { aggregateOutcomesByMarkets } from '@azuro-org/toolkit'
import dictionaries from '@/dictionaries'

const QUERY = `
  query Game($id: String!) {
    game(id: $id) {
      sport {
        name
      }
      league {
        name
        country {
          name
        }
      }
      participants {
        name
        image
      }
      startsAt
      liquidityPool {
        address
      }
      conditions {
        conditionId
        status
        outcomes {
          id
          outcomeId
          odds
        }
        core {
          address
          type
        }
      }
    }
  }
`

export default function useSportEventsModified(name) {
    const query = name.id
  const { loading, data } = useQuery(gql`${QUERY}`, {
    variables: {
      id: query,
    },
  })

  let game
  let markets

  if (data?.game) {
    const { sport, league, participants, startsAt, liquidityPool, conditions } = data.game

    game = { sport, league, participants, startsAt }

    markets = !data ? null : aggregateOutcomesByMarkets({
      lpAddress: liquidityPool.address,
      conditions,
      dictionaries,
    })
  }

  return {
    loading,
    game,
    markets,
  }
}
