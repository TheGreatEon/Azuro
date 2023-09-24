import { useState } from 'react'
import { Polygon, useEthers, useTokenBalance, useTokenAllowance, useContractFunction, ERC20Interface } from '@usedapp/core'
import { formatUnits, parseUnits } from '@ethersproject/units'
import * as ethers from 'ethers'

const USDT_DECIMALS = 6
const USDT_ADDRESS = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
const LP_ADDRESS = '0x200BD65A3189930634af857C72281abE63C3da5e'
const CORE_ADDRESS = '0xA40F8D69D412b79b49EAbdD5cf1b5706395bfCf7'
const LP = "0x7043E4e1c4045424858ECBCED80989FeAfC11B36" 

const LP_ABI = [{"inputs":[],"name":"IncorrectValue","type":"error"},{"inputs":[{"internalType":"enum SafeCast.Type","name":"to","type":"uint8"}],"name":"SafeCastError","type":"error"},{"inputs":[{"internalType":"address","name":"lp","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"addLiquidityNative","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"lp","type":"address"},{"components":[{"internalType":"address","name":"core","type":"address"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint64","name":"expiresAt","type":"uint64"},{"components":[{"internalType":"address","name":"affiliate","type":"address"},{"internalType":"uint64","name":"minOdds","type":"uint64"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct IBet.BetData","name":"extraData","type":"tuple"}],"internalType":"struct IProxyFront.BetData[]","name":"data","type":"tuple[]"}],"name":"bet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"lp","type":"address"},{"internalType":"uint48","name":"depositId","type":"uint48"},{"internalType":"uint40","name":"percent","type":"uint40"}],"name":"withdrawLiquidityNative","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"core","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bool","name":"isNative","type":"bool"}],"internalType":"struct IProxyFront.WithdrawPayoutData[]","name":"data","type":"tuple[]"}],"name":"withdrawPayouts","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const USDTContract = new ethers.Contract(USDT_ADDRESS, ERC20Interface)
const lpContract = new ethers.Contract(LP_ADDRESS, LP_ABI)

export default function usePlaceBet({ outcome, onBetPlace }) {
  const [ amount, setAmount ] = useState('')
  const { account, chainId } = useEthers()

  const isRightChain = chainId === Polygon.chainId
  const rawBalance = useTokenBalance(USDT_ADDRESS, account)
  const balance = rawBalance ? formatUnits(rawBalance, USDT_DECIMALS) : '0'

  const rawAllowance = useTokenAllowance(USDT_ADDRESS, account, LP_ADDRESS)
  const isAllowanceFetching = rawAllowance === undefined
  const allowance = rawAllowance && formatUnits(rawAllowance, USDT_DECIMALS)
  const isApproveRequired = +allowance < +amount

  const { state: approveState, send: _approve } = useContractFunction(USDTContract, 'approve', { transactionName: 'Approve' })
  const isApproving = approveState.status === 'PendingSignature' || approveState.status === 'Mining'

  const approve = () => {
    // to prevent the need to ask for approval before each bet, the user will be asked to approve a "maximum" amount
    const amount = ethers.constants.MaxUint256

    _approve(LP_ADDRESS, amount)
  }

  const { send: _placeBet } = useContractFunction(lpContract, 'bet', { transactionName: 'Bet' })

  const placeBet = () => {
    const { conditionId, outcomeId, currentOdds } = outcome

    const slippage = 5 // 5%
    const minOdds = 1 + (currentOdds - 1) * (100 - slippage) / 100 // the minimum value at which a bet should be made
    const oddsDecimals = 12 // current protocol version odds has 12 decimals
    const rawMinOdds = parseUnits(minOdds.toFixed(oddsDecimals), oddsDecimals)

    const amountDecimals = 6 // USDT decimals
    const rawAmount = parseUnits(amount, amountDecimals)

    const deadline = Math.floor(Date.now() / 1000) + 2000 // the time (in seconds) within which the transaction should be submitted
    const affiliate = "0xF3331347f937496570A2e525c671623a81DBc930" // your affiliate wallet address
    
    const data = ethers.utils.defaultAbiCoder.encode(
      [ 'uint256', 'uint64' ],
      [ conditionId, outcomeId ]
    )

    const betData = {
      core: CORE_ADDRESS,
      amount: rawAmount,
      expiresAt: deadline,
      extraData: {
        affiliate,
        data,
        minOdds: rawMinOdds,
      },
    }

    _placeBet(LP, [betData])

    onBetPlace()
  }

  return {
    isRightChain,
    balance,
    amount,
    setAmount,
    isAllowanceFetching,
    isApproveRequired,
    approve,
    isApproving,
    placeBet,
  }
}
