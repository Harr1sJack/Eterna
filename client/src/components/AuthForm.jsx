import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GoogleLogin } from '@react-oauth/google';

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  // Email validation regex - RFC 5322 compliant pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Name validation regex - only alphabets and spaces
  const nameRegex = /^[A-Za-z\s]+$/;

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Current theme:', theme);
    }, 3000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [theme]);

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateName = (name) => {
    if (!name) {
      return 'Name is required';
    }
    if (!nameRegex.test(name.trim())) {
      return 'Name should contain only letters and spaces';
    }
    if (name.trim().length < 2) {
      return 'Name should be at least 2 characters long';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Real-time email validation
    if (name === 'email') {
      const error = validateEmail(value);
      setEmailError(error);
    }

    // Real-time name validation for register mode
    if (name === 'name' && mode === 'register') {
      const error = validateName(value);
      setNameError(error);
    }
  };

  const handleEmailBlur = () => {
    // Validate email on blur for better UX
    const error = validateEmail(form.email);
    setEmailError(error);
  };

  const handleNameBlur = () => {
    // Validate name on blur for register mode
    if (mode === 'register') {
      const error = validateName(form.name);
      setNameError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate email before submission
    const emailValidationError = validateEmail(form.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      toast.error('Please fix the email address');
      return;
    }

    // Additional validation for name in register mode
    if (mode === 'register') {
      const nameValidationError = validateName(form.name);
      if (nameValidationError) {
        setNameError(nameValidationError);
        toast.error('Please enter a valid name');
        return;
      }
    }

    if (!form.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        // Admin login check
        if (form.email === "admin@gmail.com" && form.password === "admin123") {
          navigate("/qpdvimeg7354920pdhe7812");
          return;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
          {
            email: form.email,
            password: form.password,
          }
        );

        const token = res.data?.token;
        if (token) {
          login(token);
          toast.success('Logged in successfully!');
          navigate('/');
        } else {
          toast.success(res.data?.msg || 'Logged in successfully!');
          navigate('/');
        }
      } else {
        // Register
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
          {
            name: form.name,
            email: form.email,
            password: form.password,
          }
        );

        const token = res.data?.token;
        if (token) {
          login(token);
        }

        toast.success('Signed Up Successfully!');
        toast("Edit your profile later for\npersonalized experience!", { duration: 6000, icon: '😀' });
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.msg || error.response?.data?.message || 
                  (mode === 'signin' ? 'Login failed' : 'Registration failed');
      toast.error(msg);
      console.error('Auth error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    if (loading) return;
    setLoading(true);

    try {
      console.log('🔐 Google auth success:', credentialResponse);
      
      // Send Google token to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/google`, 
        {
          token: credentialResponse.credential
        }
      );

      // Use your existing AuthContext login
      login(response.data.token);
      
      if (mode === 'signin') {
        toast.success('Welcome back! Signed in with Google 🎉');
      } else {
        toast.success('Welcome! Account created with Google 🎉');
      }
      
      navigate('/');
      
    } catch (error) {
      console.error('Google auth error:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Account with this email already exists');
      } else {
        toast.error('Google authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Google OAuth Error Handler
  const handleGoogleError = () => {
    console.error('Google auth failed');
    toast.error('Google authentication was cancelled');
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className={`w-full max-w-sm mx-5 p-8 rounded-[40px] ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}>
        {/* Header */}
        <h2 className={`text-center font-black text-3xl mb-2 ${
          theme === 'dark' ? 'text-purple-500' : 'text-blue-500'
        }`}>
          {mode === 'signin' ? 'Sign In' : 'Get Started Now'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5">
          {/* Name field for register with validation */}
          {mode === 'register' && (
            <div className="mt-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleNameBlur}
                required
                disabled={loading}
                className={`w-full p-4 rounded-[20px] border-2 transition-all duration-200 outline-none ${
                  nameError 
                    ? 'border-red-500 shadow-red-500/30 shadow-lg' 
                    : 'border-transparent'
                } ${
                  theme === 'dark' 
                    ? 'bg-gray-900 text-white placeholder-gray-400 shadow-purple-500/30 shadow-lg focus:border-purple-500' 
                    : 'bg-white text-black placeholder-gray-400 shadow-cyan-200 shadow-lg focus:border-blue-500'
                } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {nameError}
                </p>
              )}
            </div>
          )}

          {/* Email field with validation */}
          <div className="mt-4">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              required
              disabled={loading}
              className={`w-full p-4 rounded-[20px] border-2 transition-all duration-200 outline-none ${
                emailError 
                  ? 'border-red-500 shadow-red-500/30 shadow-lg' 
                  : 'border-transparent'
              } ${
                theme === 'dark' 
                  ? 'bg-gray-900 text-white placeholder-gray-400 shadow-purple-500/30 shadow-lg focus:border-purple-500' 
                  : 'bg-white text-black placeholder-gray-400 shadow-cyan-200 shadow-lg focus:border-blue-500'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {emailError}
              </p>
            )}
          </div>

          {/* Password field */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            className={`w-full p-4 rounded-[20px] mt-4 border-2 border-transparent transition-all duration-200 outline-none ${
              theme === 'dark' 
                ? 'bg-gray-900 text-white placeholder-gray-400 shadow-purple-500/30 shadow-lg focus:border-purple-500' 
                : 'bg-white text-black placeholder-gray-400 shadow-cyan-200 shadow-lg focus:border-blue-500'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          />

          {/* Submit Button */}
          <input
            type="submit"
            value={loading ? (mode === 'signin' ? 'Signing in...' : 'Signing up...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
            disabled={loading || emailError || (mode === 'register' && nameError)}
            className={`w-full py-4 mt-5 rounded-[20px] text-white font-bold transition-all duration-200 cursor-pointer ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-500/40 shadow-xl hover:scale-105 hover:shadow-purple-500/50 active:scale-95 active:shadow-purple-500/30'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-cyan-400/60 shadow-xl hover:scale-105 hover:shadow-cyan-400/70 active:scale-95 active:shadow-cyan-400/50'
            } ${loading || emailError || (mode === 'register' && nameError) ? 'opacity-60 cursor-not-allowed transform-none' : ''}`}
          />
        </form>

        {/* Google OAuth Section */}
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <hr className={`flex-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Or {mode === 'signin' ? 'sign in' : 'sign up'} with
            </span>
            <hr className={`flex-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
          </div>
          
          {/* Google Login Button */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-xs relative">
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={handleGoogleError} 
                theme={theme === 'dark' ? 'filled_black' : 'filled_blue'} 
                size="large" 
                text={mode === 'signin' ? 'signin_with' : 'signup_with'} 
                shape="rectangular" 
                width={320}
                disabled={loading}
              />

              {/* Loading overlay for Google button */}
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[20px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms notice for register */}
        {mode === 'register' && (
          <p className={`text-xs mt-4 text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
