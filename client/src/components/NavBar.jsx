import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const goBack = () => navigate(-1);

  return (
    <div className="navbar fixed top-0 z-50 w-full px-4 sm:px-6 backdrop-blur-md bg-white/40 border-b border-white/10 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <Link
          to="/"
          className="text-3xl sm:text-4xl font-semibold tracking-wide font-sans text-[#431363]"
        >
          Eterna
        </Link>

        <Link
            to="/"
           className="btn btn-ghost text-lg font-sans text-[#431363] hover:scale-105"
         >
            Home
        </Link>

       <button
        onClick={goBack}
        className="btn btn-ghost text-lg font-sans text-[#431363] hover:scale-105"
       >
         Back
       </button>

      </div>

      {/* Right Section */}
      <div className="hidden lg:flex gap-3 text-[#431363] items-center">
        <Link to="/about" className="btn btn-ghost text-lg font-sans hover:scale-105">
        About
        </Link>
  
        <Link to="/contact" className="btn btn-ghost text-lg font-sans hover:scale-105">
          Contact
        </Link>

        {/* Avatar + Dropdown */}
        <div className="relative ml-4">
          <div
            className="avatar cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="w-12 rounded-full border-purple-300">
              <img
                src="/assets/car.jpg"
                alt="Profile"
                className="object-cover"
              />
            </div>
          </div>

          {/* Dropdown */}
          <div className={`absolute right-0 mt-4 w-48 bg-white/90 backdrop-blur-md 
              border border-[#431363] rounded-lg shadow-lg text-[#431363] transform 
              transition-transform duration-300 ease-in-out z-50
              ${dropdownOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Edit Profile</Link>
            <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Register</Link>
            <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
