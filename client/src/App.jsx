import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register';
import Profile from './pages/Profile'
import About from './pages/About';
import Explore from './pages/Explore';
import PostProduct from './pages/PostProduct';


const App = () => {
  
  return (
    <div data-theme='bumblebee'>
      <Toaster
        toastOptions={{
          duration: 5000, 
          style:{
            background:'#6c2d96',
            color:'white'
          }
        }}
      />
      <NavBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route path='/post-product' element={<PostProduct />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App