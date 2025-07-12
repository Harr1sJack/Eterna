import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* Desktop nav */}
      <div className="hidden lg:flex gap-2">
        <Link to="#" className="btn btn-ghost text-lg font-sans hover:scale-105">
          Explore Products
        </Link>
        <Link to="#" className="btn btn-ghost text-lg font-sans hover:scale-105">
          Upload Product
        </Link>
        <Link to="#" className="btn btn-ghost text-lg font-sans hover:scale-105">
          My Uploads
        </Link>
        <Link to="#" className="btn btn-ghost text-lg font-sans hover:scale-105">
          Login / Register
        </Link>
      </div>

      {/* Mobile dropdown */}
      <div className="lg:hidden">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-[64px] right-4 w-48 bg-base-200 rounded-box p-4 shadow-md flex flex-col gap-2 z-50">
          <Link to="#" className="btn btn-ghost justify-start font-sans text-base">
            Explore Products
          </Link>
          <Link to="#" className="btn btn-ghost justify-start font-sans text-base">
            Upload Product
          </Link>
          <Link to="#" className="btn btn-ghost justify-start font-sans text-base">
            My Uploads
          </Link>
          <Link to="#" className="btn btn-ghost justify-start font-sans text-base">
            Login / Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
