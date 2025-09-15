// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import AuthForm from '../components/AuthForm';
import AuthToggle from '../components/AuthToggle';

const Login = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const authMode = 'signin'; // Fixed mode for login page

  const handleModeChange = (newMode) => {
    // Navigate to the appropriate route
    if (newMode === 'register') {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url('/assets/loginbk1.jpg')` }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-black dark:bg-opacity-70 backdrop-blur-sm"></div>

      {/* Auth Toggle - Top Center */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[60]">
        <AuthToggle 
          mode={authMode} 
          onModeChange={handleModeChange} 
          theme={theme}
        />
      </div>

      {/* Auth Card */}
      <div className="relative z-10 flex w-[90%] md:w-[1000px] h-[500px] bg-white dark:bg-black rounded-3xl overflow-hidden shadow-xl mt-16">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <AuthForm mode={authMode} />
        </div>

        {/* Right Video Section */}
        <div className="hidden md:block md:w-1/2 relative">
          <video
            src="/assets/loginvideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover rounded-l-[5%]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
