import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaHome, FaInfoCircle, FaPhone, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();

  const { user, token, logout } = useAuth();
  const isLoggedIn = !!(user && token);

  const [profilePic, setProfilePic] = useState(null);
  const [hover, setHover] = useState({
    home: false,
    about: false,

    contact: false,
    login: false,
    logout: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 UPDATE useEffect TO USE AUTH CONTEXT
  useEffect(() => {

    if (token && user) {
      fetchProfilePic(token);
    } else {
      setProfilePic(null);
    }
  }, [user, token, location]); // Watch user and token instead of location

  const fetchProfilePic = async (token) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.profilePic) {
        // Check for Firebase URL first, then fall back to server URL
        const picUrl = res.data.firebaseProfilePic || res.data.profilePic;
        const isAbsoluteUrl = picUrl.startsWith('http://') || picUrl.startsWith('https://');
  
        const finalUrl = isAbsoluteUrl
          ? picUrl
          : `${import.meta.env.VITE_SERVER_URL}/${picUrl}`;
  
        setProfilePic(finalUrl);
      } else {
        setProfilePic('/profile/default.png');
      }
    } catch (err) {
      console.error("Error fetching profile picture", err);
      setProfilePic('/profile/default.png');
    }
  };

  // 🔥 REPLACE MANUAL LOGOUT WITH AUTH CONTEXT LOGOUT
  const handleLogout = () => {
    logout(); // Use AuthContext logout
    navigate('/login');
  };

  return (
    <div className="navbar fixed top-0 z-50 w-full px-4 sm:px-6 backdrop-blur-md bg-white/40 dark:bg-black/40 border-b border-white/10 dark:border-purple-500/20 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-3xl sm:text-4xl font-semibold tracking-wide font-sans text-[#431363] dark:text-purple-400">
          Eterna
        </div>
        <div className="mr-2 mt-3 text-[#431363] dark:text-purple-400">
          <AnimatedThemeToggler />
        </div>
      </div>

      <div className="flex gap-3 items-center text-[#431363] dark:text-purple-400">
        <Link
          to="/"
          onMouseEnter={() => setHover({ ...hover, home: true })}
          onMouseLeave={() => setHover({ ...hover, home: false })}
          className="btn btn-ghost text-lg font-sans w-20 relative overflow-hidden py-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
        >
          <span
            className={`transition-all duration-300 ${
              hover.home ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
            } absolute inset-0 flex items-center justify-center`}
          >
            Home
          </span>
          <span
            className={`transition-all duration-300 ${
              hover.home ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } absolute inset-0 flex items-center justify-center`}
          >
            <FaHome className="text-[#431363] dark:text-purple-400" />
          </span>
        </Link>

        <Link
          to="/about"
          onMouseEnter={() => setHover({ ...hover, about: true })}
          onMouseLeave={() => setHover({ ...hover, about: false })}
          className="btn btn-ghost text-lg font-sans w-20 relative overflow-hidden py-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
        >
          <span
            className={`transition-all duration-300 ${
              hover.about ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
            } absolute inset-0 flex items-center justify-center`}
          >
            About
          </span>
          <span
            className={`transition-all duration-300 ${
              hover.about ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } absolute inset-0 flex items-center justify-center`}
          >
            <FaInfoCircle className="text-[#431363] dark:text-purple-400" />
          </span>
        </Link>

        <Link
          to="/contact"
          onMouseEnter={() => setHover({ ...hover, contact: true })}
          onMouseLeave={() => setHover({ ...hover, contact: false })}
          className="btn btn-ghost text-lg font-sans w-20 relative overflow-hidden py-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
        >
          <span
            className={`transition-all duration-300 ${
              hover.contact ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
            } absolute inset-0 flex items-center justify-center`}
          >
            Contact
          </span>
          <span
            className={`transition-all duration-300 ${
              hover.contact ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } absolute inset-0 flex items-center justify-center`}
          >
            <FaPhone className="text-[#431363] dark:text-purple-400" />
          </span>
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/login"
            onMouseEnter={() => setHover({ ...hover, login: true })}
            onMouseLeave={() => setHover({ ...hover, login: false })}
            className="btn btn-ghost text-lg font-sans w-36 relative overflow-hidden py-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
          >
            <span
              className={`transition-all duration-300 ${
                hover.login ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
              } absolute inset-0 flex items-center justify-center`}
            >
              Login / Sign Up
            </span>
            <span
              className={`transition-all duration-300 ${
                hover.login ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              } absolute inset-0 flex items-center justify-center`}
            >
              <FaSignInAlt className="text-[#431363] dark:text-purple-400" />
            </span>
          </Link>
        ) : (
          <>
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHover({ ...hover, logout: true })}
              onMouseLeave={() => setHover({ ...hover, logout: false })}
              className="btn btn-ghost text-lg font-sans w-20 relative overflow-hidden py-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
            >
              <span
                className={`transition-all duration-300 ${
                  hover.logout ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                } absolute inset-0 flex items-center justify-center`}
              >
                Log Out
              </span>
              <span
                className={`transition-all duration-300 ${
                  hover.logout ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                } absolute inset-0 flex items-center justify-center`}
              >
                <FaSignOutAlt className="text-[#431363] dark:text-purple-400" />
              </span>
            </button>
            <Link to="/profile">
              <div className="avatar cursor-pointer">
                <div className="w-11 h-11 rounded-full border-purple-300 dark:border-purple-500 overflow-hidden ring-2 ring-purple-200 dark:ring-purple-500 hover:ring-purple-400 dark:hover:ring-purple-400 transition-all duration-300">
                  <img
                    src={profilePic}
                    alt="Profile"
                    onError={e => { e.currentTarget.src = "/profile/default.png"; }}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
