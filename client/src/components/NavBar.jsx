import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const goBack = () => navigate(-1);

  return (
    <div className="navbar fixed top-0 z-50 w-full px-4 sm:px-6 backdrop-blur-md bg-white/40 border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-3xl sm:text-4xl font-semibold tracking-wide font-sans text-[#431363]">
          Eterna
        </div>
      </div>

      <div className="flex gap-3 items-center text-[#431363]">
        <Link
          to="/"
          className="btn btn-ghost text-lg font-sans text-[#431363] hover:scale-105"
        >
          Home
        </Link>
        <Link to="/about" className="btn btn-ghost text-lg font-sans hover:scale-105">
          About
        </Link>
        <Link to="/contact" className="btn btn-ghost text-lg font-sans hover:scale-105">
          Contact
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="btn btn-ghost text-lg font-sans text-[#431363] hover:scale-105 transition-all"
          >
            Login / Sign Up
          </Link>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-lg font-sans text-[#431363] hover:scale-105 transition-all"
            >
              Log Out
            </button>
            <Link to="/profile">
              <div className="avatar cursor-pointer">
                <div className="w-11 h-11 rounded-full border-purple-300">
                  <img
                    src="/profile/default.png"
                    alt="Profile"
                    className="object-cover"
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
