import React from 'react'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Login from './pages/Login'

const App = () => {
  return (
    <div data-theme='bumblebee'>
      <NavBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App