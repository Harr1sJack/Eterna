// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { GoogleLogin } from '@react-oauth/google'; // ✅ CORRECT IMPORT
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthForm from '../components/AuthForm';
import AuthToggle from '../components/AuthToggle';

const Register = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const authMode = 'register'; // Fixed mode for register page

  const handleModeChange = (newMode) => {
    // Navigate to the appropriate route
    if (newMode === 'signin') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  // Google Sign-In Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('🔐 Google register success:', credentialResponse);
      
      // Send Google token to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/google`, 
        {
          token: credentialResponse.credential
        }
      );

      // Use your existing AuthContext login
      login(response.data.token);
      toast.success('Welcome! Account created with Google 🎉');
      navigate('/');
      
    } catch (error) {
      console.error('Google register error:', error);
      if (error.response?.status === 400) {
        toast.error('Account with this email already exists');
      } else {
        toast.error('Google sign-up failed. Please try again.');
      }
    }
  };

  // Google Sign-In Error Handler
  const handleGoogleError = () => {
    console.error('Google register failed');
    toast.error('Google sign-up was cancelled');
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
      <div className="relative z-10 flex w-[90%] md:w-[1000px] h-[600px] bg-white dark:bg-black rounded-3xl overflow-hidden shadow-xl mt-16">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
          {/* Your existing form */}
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

export default Register;
