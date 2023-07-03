import { useEthers } from '@usedapp/core'
import dayjs from 'dayjs'
import { getMarketName, getSelectionName } from '@azuro-org/dictionaries'
import dictionaries from '@/dictionaries'
import useBetsHistory from '@/hooks/useBetsHistory'
import useRedeemBet from '@/hooks/useRedeemBet'

const BetInfo = ({ data }) => {
  const { id, betId, amount, potentialPayout, status, isRedeemed, odds, createdAt, txHash, outcome } = data

  const isWin = outcome.outcomeId === outcome.condition.wonOutcome?.outcomeId
  const isResolved = status === 'Resolved'
  const isCanceled = status === 'Canceled'

  const marketName = getMarketName({ outcomeId: outcome.outcomeId, dictionaries })
  const selectionName = getSelectionName({ outcomeId: outcome.outcomeId, dictionaries })
  const {redeem} = useRedeemBet({tokeId:betId})
  return (
    <div className="w-full py-4 px-6" style={{background:"black"}}>
      <div className="text-md text-gray-600">
        {dayjs(+createdAt * 1000).format('DD MMMM YYYY HH:mm')}
      </div>
      <div className="">
        <div>
          <div className="text-gray-400">Bet Type</div>
          <div className="mt-1 font-semibold">{marketName}</div>
        </div>
        <div>
          <div className="text-gray-400">Side</div>
          <div className="mt-1 font-semibold">{selectionName}</div>
        </div>
        <div>
          <div className="text-gray-400">Odds</div>
          <div className="mt-1 font-semibold">{parseFloat(odds).toFixed(4)}</div>
        </div>
        <div>
          <div className="text-gray-400">Bet Amount</div>
          <div className="mt-1 font-semibold">{+parseFloat(amount).toFixed(2)} USDT</div>
        </div>
      </div>
      <div >
        <div>
          <div className="text-gray-400">Possible Win</div>
          <div className="mt-1 font-semibold">
            {+parseFloat(potentialPayout).toFixed(2)} USDT
          </div>
        </div>
        <div>
          <div className="text-gray-400">Status</div>
          <div className="mt-1 font-semibold">
            {
              isResolved ? (
                isWin ? (
                  <span className="text-green-600">Win</span>
                ) : (
                  <span className="text-gray-400">Lose</span>
                )

              ) : (
                isCanceled ? (
                  <span className="text-red-700">Canceled</span>
                ) : (
                  <span className="text-yellow-500">Pending</span>
                )
              )
            }
          </div>
          <div>
          {
              isResolved ? (
                isRedeemed ? (
                  <span className="text-green-600">Redeemed</span>
                ) : (
                  isWin ? (<button onClick={redeem}>REDEEM</button>) :(<></>)
                )

              ) : (
                isCanceled ? (
                  <span className="text-red-700">Canceled</span>
                ) : (
                  <span className="text-yellow-500">Pending</span>
                )
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const GameInfo = ({ game }) => (
  <div className="w-full py-4 px-6 ">
    <div className="flex justify-between text-md">
      <span>{game.sport.name}</span>
      <span>{dayjs(game.startsAt * 1000).format('DD MMM HH:mm')}</span>
    </div>
    <div className="mt-1 text-md text-gray-400">
      {game.league.country.name} &middot; {game.league.name}
    </div>
    <div className="mt-3 space-y-2">
      {
        game.participants.map(({ image, name }) => (
          <div key={name} className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 mr-2 border border-gray-300 rounded-full">
              <img className="w-4 h-4" src={image} alt={name} />
            </div>
            <span className="text-md">{name}</span>
          </div>
        ))
      }
    </div>
  </div>
)

export default function BetsHistory() {
  const { account } = useEthers()
  const { loading, data } = useBetsHistory()

  if (!account) {
    return (
      <div className="mt-6 py-4 text-md text-center bg-red-200 rounded-md">
        Please, connect wallet to see your bets history
      </div>
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{color:'white', textAlign:'center', background:'#401624', alignItems:'center', width:'full', borderRadius:'15px', padding:'5px', margin:'6px', boxShadow:'1px 1px 1px 1px black'}}>
      {
        data?.bets.map((bet) => (
          <div
            key={bet.id}
            // className="grid grid-cols-[auto_minmax(400px,520px)] justify-items-start bg-gray-50 border border-gray-200 overflow-hidden rounded-xl"
          style={{alignItems:'center', width:'full', borderRadius:'15px', padding:'10px', margin:'6px', boxShadow:'1px 1px 1px 1px black', background:'linear-gradient(to right bottom, #0D131C, #132133)'}}
          >
            <GameInfo game={bet.game} />
            <BetInfo data={bet} />
          </div>
        ))
      }
    </div>
  )
}