import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral dark:bg-gray-900 text-neutral-content dark:text-gray-300 px-4 py-6">
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
          <p className="text-sm">
            Copyright © {new Date().getFullYear()} — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
