import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content px-4 py-6">
      {/* Top Section */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="text-sm sm:text-base leading-relaxed">
          <span className="font-semibold">Why Eterna?</span>
          <br />🔐 Secure & Verified Listings
          <br />🌐 Exclusive Community of Collectors
          <br />💬 Direct Chat with Buyers & Sellers
          <br />🚫 No Commission – 100% Yours
        </div>

        {/* Logo and copyright */}
        <div className="flex items-center gap-2 mt-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <path d="M22.672 15.226l-2.432.811... (shortened for brevity) ..." />
          </svg>
          <p className="text-sm">
            Copyright © {new Date().getFullYear()} — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
