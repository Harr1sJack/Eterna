import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  // Get wishlist from localStorage
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(savedWishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background decorative elements matching existing theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-300/8 to-pink-300/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 z' fill='none' stroke='%23431363' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)'/%3e%3c/svg%3e")`,
        }}></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        {/* Header section with gradient text matching existing theme */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-800 via-purple-600 to-slate-800 dark:from-gray-300 dark:via-purple-400 dark:to-gray-300 bg-clip-text text-transparent">
              Your Wishlist
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Save your favorite items and never lose track of what you love
          </p>
        </div>

        {/* Wishlist content */}
        {wishlistItems.length === 0 ? (
          // Empty wishlist state
          <div className="max-w-md mx-auto text-center">
            <div className="bg-[#f8f8f8] dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              {/* Empty wishlist icon */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500/20 to-indigo-500/20 dark:from-purple-400/20 dark:to-indigo-400/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">❤️</span>
                </div>
              </div>

              {/* Empty state text */}
              <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-200 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-slate-600 dark:text-gray-400 mb-6">
                Start adding items you love to build your wishlist
              </p>

              {/* CTA button matching theme */}
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span className="mr-2">🏠</span>
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          // Wishlist items grid (when items exist)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <div 
                key={item.id}
                className="bg-[#f8f8f8] dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                {/* Item image */}
                <div className="aspect-square bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl mb-4 overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}/${item.images[0]}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/default-product.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Item details */}
                <h4 className="font-semibold text-slate-800 dark:text-gray-200 mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm mb-2">
                  {item.description}
                </p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4">
                  ₹{item.price}
                </p>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <Link 
                    to={`/products/${item.id}`}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-center"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-all duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions section */}
        <div className="mt-16 text-center">
          <div className="inline-flex space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200/30 dark:border-gray-600/30 rounded-xl text-slate-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-white/30 dark:hover:bg-gray-700/30 hover:scale-105"
            >
              ← Go Back
            </button>
            <button 
              onClick={() => window.location.href = '/explore'}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Explore More
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacing for floating dock */}
      <div className="h-24"></div>
    </div>
  );
};

export default Wishlist;