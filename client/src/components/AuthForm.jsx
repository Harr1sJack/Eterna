import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (mode === 'signin') {
        // Admin login check
        if (form.email === "admin@gmail.com" && form.password === "admin123") {
          navigate("/admin");
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

  const handleGoogleAuth = () => {
    toast.info('Google authentication coming soon!');
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
          {/* Name field for register */}
          {mode === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full p-4 rounded-[20px] mt-4 border-2 border-transparent transition-all duration-200 outline-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 text-white placeholder-gray-400 shadow-purple-500/30 shadow-lg focus:border-purple-500' 
                  : 'bg-white text-black placeholder-gray-400 shadow-cyan-200 shadow-lg focus:border-blue-500'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          )}

          {/* Email field */}
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            className={`w-full p-4 rounded-[20px] mt-4 border-2 border-transparent transition-all duration-200 outline-none ${
              theme === 'dark' 
                ? 'bg-gray-900 text-white placeholder-gray-400 shadow-purple-500/30 shadow-lg focus:border-purple-500' 
                : 'bg-white text-black placeholder-gray-400 shadow-cyan-200 shadow-lg focus:border-blue-500'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          />

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

          {/* Forgot Password Link */}
          {mode === 'signin' && (
            <div className="block mt-2 ml-2">
              <a href="#" className={`text-xs ${
                theme === 'dark' ? 'text-purple-500' : 'text-blue-500'
              }`}>
                Forgot Password ?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <input
            type="submit"
            value={loading ? (mode === 'signin' ? 'Signing in...' : 'Signing up...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
            disabled={loading}
            className={`w-full py-4 mt-5 rounded-[20px] text-white font-bold transition-all duration-200 cursor-pointer ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-500/40 shadow-xl hover:scale-105 hover:shadow-purple-500/50 active:scale-95 active:shadow-purple-500/30'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-cyan-400/60 shadow-xl hover:scale-105 hover:shadow-cyan-400/70 active:scale-95 active:shadow-cyan-400/50'
            } ${loading ? 'opacity-60 cursor-not-allowed transform-none' : ''}`}
          />
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <span className={`block text-center text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          }`}>
            Or {mode === 'signin' ? 'Sign in' : 'Sign up'} with
          </span>
          
          <div className="w-full flex justify-center gap-4 mt-1">
            <button
              type="button"
              className={`p-2 rounded-full w-12 h-12 grid place-content-center transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-700 hover:scale-110 active:scale-90'
                  : 'bg-gradient-to-r from-black to-gray-500 border-2 border-white hover:scale-110 active:scale-90'
              } ${loading ? 'opacity-60 cursor-not-allowed transform-none' : 'cursor-pointer'}`}
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <svg className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 488 512">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;