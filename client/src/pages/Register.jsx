// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
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
      toast("Edit your profile later for\npersonalized experience!",{duration:6000,icon:'😀'})
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.msg || error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      console.error('Error during registration:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url('/assets/loginbk1.jpg')` }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

      {/* Auth Card */}
      <div className="relative z-10 flex w-[90%] md:w-[1000px] h-[500px] bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-start items-center pt-14">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Started Now</h2>

          <form className="space-y-4 w-[350px]" onSubmit={handleSubmit}>
            <div>
              <p className="text-sm text-gray-700">Name</p>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
                required
                disabled={loading}
              />
            </div>

            <div>
              <p className="text-sm text-gray-700">Email Address</p>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
                required
                disabled={loading}
              />
            </div>

            <div>
              <p className="text-sm text-gray-700">Password</p>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: '#431363' }}
              className="w-full text-white py-2 rounded-md hover:opacity-90 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
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