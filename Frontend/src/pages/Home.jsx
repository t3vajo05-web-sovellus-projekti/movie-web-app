import '../components/global.css'
import React from 'react'
import HomeWelcome from '../components/homeWelcome.jsx'
import HomeMostRecent from '../components/homeMostRecent.jsx'
import HomeInTheatres from '../components/homeInTheatres.jsx'

export default function Home() 
{
    return (
      <>
        <HomeWelcome />
        <HomeMostRecent />
        <HomeInTheatres />        
      </>
    )
}
