import Link from 'next/link'
import Image from 'next/image'
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
      <div className="max-w-[600px] mx-auto mt-12 space-y-6">
        {
          markets.map(({ marketName, outcomes: row }) => (
            <div key={marketName} className="" >
              <div className="mb-2 font-semibold">{marketName}</div>
              <div className="space-y-1" style={{color:'black'}}>
                {
                  row.map((outcomes, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex gap-1 w-full">
                        {
                          outcomes.map((outcome) => (
                            <div
                              key={outcome.selectionName}
                              className="flex justify-between py-2 px-3 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition"
                              style={{ width: `calc(100% / ${outcomes.length})` }}
                              onClick={() => handleOutcomeClick(outcome)}
                            >
                              <span className="text-gray-500">{outcome.selectionName}</span>
                              <span className="font-medium">{parseFloat(outcome.odds).toFixed(2)}</span>
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
  const { loading, game, markets } = useSportEvent()
  console.log("game", markets)
  return (
  <div style={{alignItems:'center', width:'full', borderRadius:'15px', padding:'10px', margin:'6px', boxShadow:'1px 1px 1px 1px black', background:'linear-gradient(to right bottom, #0D131C, #132133)'}}>
  <div>
  <Link
    // className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
    href={`/games/${id}`}
  >
    <div className="flex justify-between text-sm"  style={{color:'white'}}>
      <span>{sport.name}</span>
      <span>{dayjs(startsAt * 1000).format('DD MMM HH:mm')}</span>
    </div>
    <div className="mt-2 text-sm text-gray-400">
      {league.country.name} &middot; {league.name}
    </div>
    <div className="mt-3 space-y-1">
      {
        participants.map(({ image, name }) => (
          <div key={name} className="flex items-center"  style={{color:'white'}}>
            <div className="flex items-center justify-center w-8 h-8 mr-2 border border-gray-300 rounded-full">
              <img className="w-4 h-4" src={image} alt={name} />
            </div>
            <span className="text-md">{name}</span>
          </div>
        ))
      }
    </div>
    <div>

    </div>
  </Link>
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
  

  if (loading || loading1) {
    return <main style={{display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',}}>
     <Image src={loadingGIF} height={700} width={700} />
    </main>
  } 

  const games_list = ["Football", "Baseball", "Rugby", "MMA", "Boxing", "Basketball", "Tennis", "Ice Hockey"]
  function handleGameChange(name) {
    setTheGame(name)
  }

  
  return (
    <main style={{boxShadow:"-1px -1px 4px 4px black", padding:'10px', borderRadius:'10px', background:'#0F1319', display:'flex'}}> 
    <div style={{width:'75%'}}>
      <Slideshow />
      {/* className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2" */}
      <div style={{textAlign:'center', boxShadow:'-1px -1px 3px 3px linear-gradient(to right bottom, #132133, #0D131C)', borderRadius:'10px', margin:'10px'}}>
        {games_list.map((gamename) => (
            <div style={{display:'inline-block'}}>
              { gamename == theGame ?
              <button style={{margin:'10px', color:'white', margin:'10px', fontWeight:'bolder', fontSize:'18px'}} onClick={() => handleGameChange(gamename)}>
                {gamename}
              </button> 
              :
              <button style={{margin:'10px', color:'white', margin:'10px', color:'gray'}} onClick={() => handleGameChange(gamename)}>
                {gamename}
              </button> 
              } 
            </div>  
        ))}
      </div>
        <div style={{color:'white', textAlign:'center', background:'#401624', alignItems:'center', width:'full', borderRadius:'15px', padding:'5px', margin:'6px', boxShadow:'1px 1px 1px 1px black'}}>
          <label>
            {theGame}
          </label>
        </div>
        {data1 &&
          data1.games.map((game) => (
            <GameCard key={game.id} {...game} />
          ))
        }
        </div>
        <div style={{width:'25%'}}>
        <div style={{color:'white', textAlign:'center', background:'#401624', alignItems:'center', width:'full', borderRadius:'15px', padding:'5px', margin:'6px', boxShadow:'1px 1px 1px 1px black'}}>
          <label>
            Bets
          </label>
        </div>
        <BetsHistory />
        </div>
    </main>
  )
}
