import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Card from './Components/Card'
import CardContainer from './Components/CardContainer'
import Header from './Header'
import HomePage from './Pages/HomePage'
import ContactForm from './Components/ContactForm'
import CoachDetails from './Pages/CoachDetails'

function App() {

  return (
    <div id="parent">
      <Header />

{/* <CoachDetails/> */}


      <div className='px-10'>
        <HomePage />
      </div>

    </div>
  )
}

export default App
