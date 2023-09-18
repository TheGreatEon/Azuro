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
    <div className="justify-between">
      <div className="">
        {/* {<div>
          <div className="text-gray-400">Amount</div>
          <div className="mt-1 font-semibold">{+parseFloat(amount).toFixed(2)} $</div>
        </div>
      </div>
      <div >
        <div>
          <div className="text-gray-400">Win</div>
          <div className="mt-1 font-semibold">
            {+parseFloat(potentialPayout).toFixed(2)} $
          </div>
        </div>} */}
        <div className="flex justify-between">
          <div >
            {
              isResolved ? (
                isWin ? (
                  <span className="text-green-600">Won {+parseFloat(potentialPayout).toFixed(2)} $</span>
                ) : (
                  <span className="text-red-400">Lost {+parseFloat(amount).toFixed(2)} $</span>
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
                  <span className="text-green-600">✔️</span>
                ) : (
                  isWin ? (<button className='gamebutton' onClick={redeem}>REDEEM</button>) :(<></>)
                )

              ) : (
                isCanceled ? (
                  <span className="text-orange-700">Canceled</span>
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
  <div className="w-full">
    <div className="flex justify-between text-md">
      <span style={{color:'rgb(105,34,255)'}}>{game.sport.name}</span>
      <span>{dayjs(game.startsAt * 1000).format('DD MMM HH:mm')}</span>
    </div>
    
    <div className="flex justify-between space-x-2">
      {
        game.participants.map(({ image, name }) => (
          <div key={name} className="justify-between">
            <span style={{fontSize:'13px'}}>{name}</span>
          </div>
        ))
      }
    </div>
  </div>
)

export default function BetsHistory() {
  const { account } = useEthers()
  const { loading, data } = useBetsHistory()
  console.log("dataa", data)
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
    <div>
      {
        data?.bets.map((bet) => (
          <div
            key={bet.id}
            className='font'
            // className="grid grid-cols-[auto_minmax(400px,520px)] justify-items-start bg-gray-50 border border-gray-200 overflow-hidden rounded-xl"
          style={{alignItems:'center', width:'full', borderRadius:'15px', padding:'10px', margin:'8px', background:'black'}}
          >
            <GameInfo game={bet.game} />
            <BetInfo data={bet} />
          </div>
        ))
      }
    </div>
  )
}