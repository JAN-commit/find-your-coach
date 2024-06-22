import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Card from './Components/Card'
import CardContainer from './Components/CardContainer'
import Header from './Header'
import HomePage from './Pages/HomePage'
import ContactForm from './Components/ContactForm'
import CoachDetails from './Pages/CoachDetails'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import CoachRegistration from './Pages/CoachRegistration'
import MessageRequest from './Pages/MessageRequest'

function App() {

  return (
    <Router>
      <div id="parent">
        <Header />
        <div className=''>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/CoachDetails/:id' element={<CoachDetails />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/CoachRegistration' element={<CoachRegistration/>} />
            <Route path='/MessageRequest' element={<MessageRequest/>} />
          </Routes>
        </div>

      </div>
    </Router>
  )
}

export default App
