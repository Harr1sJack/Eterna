import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 sm:px-6">
      <div className="flex-1">
        <Link
          to="/"
          className="text-3xl sm:text-4xl font-sans font-extralight text-primary"
        >
          Eterna
        </Link>
      </div>

      <div className="hidden lg:flex gap-2 text-[#431363] items-center">
        {/* Other nav links */}
        <Link to="#" className="btn btn-ghost text-lg font-sans hover:scale-105">
          Explore Products
        </Link>
        <Link to="#" className="btn btn-ghost text-lg font-sans hover:scale-105">
          Upload Product
        </Link>
        <Link to="#" className="btn btn-ghost text-lg font-sans hover:scale-105">
          My Uploads
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

          {/* Dropdown shown only when open */}
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
