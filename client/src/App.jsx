import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import ChatPage from './pages/ChatPage';
import ChatLayout from './pages/ChatLayout';
import Wishlist from './pages/Wishlist';
import FloatingDock from './components/FloatingDock';

//=======added by shaun========//
import { ThemeProvider } from './context/ThemeContext';
//=======added by shaun========//

const App = () => {
  const location = useLocation();
  
  // Hide footer on chat pages
  const shouldHideFooter = location.pathname === '/chat' || location.pathname.startsWith('/chat/');

  return (
    <ThemeProvider>
      <div data-theme='bumblebee' className="min-h-screen">
        <Toaster
          toastOptions={{
            duration: 5000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-text)'
            }
          }}
        />
        <NavBar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path='/post-product' element={<PostProduct />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/chat/:sellerId" element={<ChatPage />} />
          <Route path="/chat" element={<ChatLayout />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        
        {/* Conditionally render Footer - hide on chat pages */}
        {!shouldHideFooter && <Footer />}
        
        {/* Floating Dock Navigation */}
        <FloatingDock />
        
        <style jsx global>{`
          :root {
            --toast-bg: #6c2d96;
            --toast-text: white;
          }
          
          .dark {
            --toast-bg: #8B5CF6;
            --toast-text: #F8F8FF;
          }
        `}</style>
      </div>
    </ThemeProvider>
  )
}

export default App
