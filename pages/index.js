import Link from 'next/link'
import Image from 'next/image'
import { useEthers } from '@usedapp/core'
import dayjs from 'dayjs'
import useSportEvents from '@/hooks/useSportEvents'
import useSportEvent from '@/hooks/useSportEvent'
import useSportEventsModified from '@/hooks/useSportEventsModified'
import PlaceBetModal from '@/components/PlaceBetModal'
import { useState } from 'react'
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import loadingGIF from 'styles/LoadingF.gif'
import BetsHistory from './bets-history'

const Markets = ({ game, markets }) => {
  const [ selectedOutcome, setSelectedOutcome ] = useState(null)

  const handleOutcomeClick = (outcome) => {
    setSelectedOutcome(outcome)
  }

  const handleModalClose = () => {
    setSelectedOutcome(null)
  }

  return (
    <>
      <div className="flex justify-between" >
        {
          markets.map(({ marketName, outcomes: row }) => (
            <div key={marketName} className="" >
              {/* <div className="mb-2 font-semibold">{marketName}</div> */}
              <div className="space-y-1" style={{color:'black'}}>
                {
                  row.map((outcomes, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex gap-1 w-full">
                        {
                          outcomes.map((outcome) => (
                            <div
                              key={outcome.selectionName}
                              className="flex justify-between bg-gray-200 rounded-md cursor-pointer transition gamebutton"
                              style={{ width: `190px`, height:'45px'}}
                              onClick={() => handleOutcomeClick(outcome)}
                            >
                              <span className="text-gray-500" >{outcome.selectionName}</span>
                              <span className="font-medium"  >{parseFloat(outcome.currentOdds).toFixed(2)}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
      {
        Boolean(selectedOutcome) && (
          <PlaceBetModal
            game={game}
            outcome={selectedOutcome}
            closeModal={handleModalClose}
          />
        )
      }
    </>
  )
}


const GameCard = ({ id, sport, league, participants, startsAt }) => {
  const { loading, game, markets } = useSportEventsModified(id)
  const { account } = useEthers()

  return (
  <div className='box'>
    <div className="flex justify-between text-sm"  style={{color:'white', width:'100%'}}>
      {/* <span>{sport.name}</span> */}
      <span>{league.country.name} &middot; {league.name}</span>
      <span>{dayjs(startsAt * 1000).format('DD MMM HH:mm')}</span>
    </div>
    <div className="flex justify-between text-sm" style={{padding:'2px', with:'full', margin:'3px'}}>
      <div className='flex'>
      {
        participants.map(({ image, name }) => (
          <div key={name} className="flex items-center"  style={{color:'white', marginRight:'15px', fontSize:'13px', fontWeight:'bold'}}>
            <div style={{padding:'2px'}}>
              {image? <img className="w-12 h-12" src={image} alt={name} /> : <></>}
              
            </div>
            <span className="text-md">{name}</span>
          </div>
        ))
      }
      </div>
      <div className='justify-between text-sm'>
      <div style={{width:'full'} } className="area">
      {account? <Markets game={game} markets={markets? markets.slice(0,1): []}/>: <></>}
      </div>
            <div className='area'>
            {account?
            <div className="flex items-center" style={{padding:'2px', color:'white'}}>
                  <Link href={`/games/${id}`} className='gamebutton'> {'MORE ⏭️'} </Link>
            </div>: 
            <></>
      }
      </div>
            </div>
            
    </div>
  </div>
)
    }

const spanStyle = {
  padding: '20px',
  background: '#efefef',
  color: '#000000'
}

const divStyle = {
  display: 'flex',
  borderRadius:'15px',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}
const slideImages = [
  {
    url: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
  },
  {
    url: 'https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80',
  },
  {
    url: 'https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
  },
];

const Slideshow = () => {
    return (
      <div className="slide-container">
        <Slide>
         {slideImages.map((slideImage, index)=> (
            <div key={index}>
              <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
              </div>
            </div>
          ))} 
        </Slide>
      </div>
    )
}


export default function Home() {

  const [theGame, setTheGame] = useState('Football');
  const { loading, data } = useSportEvents('Baseball')
  const { loading:loading1, data:data1 } = useSportEvents(theGame)
  console.log("game", data)

  if (loading || loading1) {
    return <main style={{display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',}}>
     <Image src={loadingGIF} height={700} width={700} />
    </main>
  } 

  const games_list = ["Football", "Baseball", "Rugby", "MMA", "Boxing", "Basketball", "Tennis", "Ice Hockey"]
  const emojis = {
    Football: '⚽',
    Baseball: '⚾',
    Rugby: '🏉',
    MMA: '🥊',
    Boxing: '🥊',
    Basketball: '🏀',
    Tennis:'🎾',
    "Ice Hockey": '🏒'
  }
  const { account } = useEthers()
  function handleGameChange(name) {
    setTheGame(name)
  }

  
  return (
    
    <div style={{textAlign:'center'}}>
      <div className='diamond'></div>
      <div>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Titan+One&display=swap');
      </style>
      <div>  
      <span className='textwithfont' style={{fontSize:'45px', color:'#6A23FF'}}>{"NormieBet"}</span> 
      </div>
      <div>
      <span className='textwithfont' style={{fontSize:'45px'}}>{"On-Chain Crypto Bookie"}</span>
      </div>
      <div>
      <span className='textwithfont' style={{fontSize:'45px'}}>'No Signup'</span>
      </div>
      
    </div>
    <main className={account ? 'mainalignment justify-between' : ''}> 
    <div>
      <div style={{textAlign:'center', boxShadow:'-1px -1px 3px 3px linear-gradient(to right bottom, #132133, #0D131C)', borderRadius:'10px', margin:'10px'}}>
        {games_list.map((gamename) => (
            <div style={{display:'inline-block'}}>
              { gamename == theGame ?
              <button className='gamebuttonactive' onClick={() => handleGameChange(gamename)}>
                {emojis[gamename]}
                {gamename}
              </button> 
              :
              <button className='gamebutton' onClick={() => handleGameChange(gamename)}>
                {emojis[gamename]}
                {gamename}
              </button> 
              } 
            </div>  
        ))}
      </div>
        {data1 &&
          data1.games.map((game) => (
            <GameCard key={game.id} {...game} />
          ))
        }
        </div>
        {account ? <div className='slip'>
          <div style={{alignItems:'center', width:'full', borderRadius:'15px', padding:'10px', margin:'8px', background:'rgb(105,34,255)'}}>
            Bets
          </div>

          <div className='history'><BetsHistory /></div>
        
        </div> : <></>}
    </main>
    </div>
  )
}
