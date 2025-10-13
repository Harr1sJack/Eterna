import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const ProductCard = ({ product, actionButtons, hideLikeButton }) => {
  const { id, title, description, price, images = [] } = product;
  const navigate = useNavigate();
  
  // Check if product is already in wishlist
  const [isLiked, setIsLiked] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item.id === id);
  });


  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get current wishlist from localStorage
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isLiked) {
      // Remove from wishlist
      const updatedWishlist = currentWishlist.filter(item => item.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsLiked(false);
    } else {
      // Add to wishlist
      const productToAdd = { id, title, description, price, images };
      const updatedWishlist = [...currentWishlist, productToAdd];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsLiked(true);
    }
  };


  return (
  <Link to={`/products/${id}`} className="block w-full max-w-[224px]">
    <div className="group bg-[#f8f8f8] dark:bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-out border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:scale-105 hover:-translate-y-2 transform relative">
      
      {/* Image */}
      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md mb-3 overflow-hidden relative">
        {images.length > 0 ? (
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/${images[0]}`}
            alt={title}
            className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
            style={{
              objectPosition: 'center 25%',
            }}
            onError={(e) => {e.target.src = '/placeholder.png';}}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors duration-300">
            <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
            </svg>
          </div>
        )}


        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-[-100%] group-hover:translate-x-[100%] group-hover:transition-transform group-hover:duration-700"></div>
      </div>


      {/* Title */}
      <div className="relative mb-1">
        <h3 className="text-base font-bold text-transparent bg-gradient-to-r from-slate-800 via-purple-600 to-slate-800 dark:from-gray-300 dark:via-purple-400 dark:to-gray-300 bg-clip-text leading-tight tracking-[-0.015em] font-['Inter','system-ui','-apple-system',sans-serif] transition-all duration-300 ease-out group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-purple-700 dark:group-hover:from-purple-400 dark:group-hover:via-indigo-400 dark:group-hover:to-purple-500 group-hover:scale-105 group-hover:tracking-[-0.025em] overflow-hidden text-ellipsis whitespace-nowrap transform origin-left group-hover:translate-x-0.5">
          {title}
        </h3>
        
        <div className="absolute bottom-0 left-0 w-1/4 h-0.5 bg-gradient-to-r from-purple-500/40 to-indigo-500/40 transition-all duration-300 ease-out group-hover:w-full group-hover:from-purple-500 group-hover:to-indigo-500"></div>
      </div>


      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 truncate font-['Inter','system-ui','-apple-system',sans-serif] leading-relaxed transition-all duration-300 ease-out group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 relative">
        {description}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></span>
      </p>


      {/* Price Badge - GLASSMORPHIC WITH PURPLE THEME */}
     <div className="mb-2">
      <div className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg border-l-4 border-purple-500">
      ₹{price}
      </div>
      </div>


      {/* Animated Heart Checkbox - Only show if not hidden */}
      {!hideLikeButton && (
        <div 
          className="absolute bottom-3 right-3 z-10 w-8 h-8 transition-all duration-300 cursor-pointer"
          title="Like"
          onClick={handleLikeClick}
        >
          {/* Hidden checkbox for state */}
          <input 
            type="checkbox" 
            checked={isLiked}
            onChange={() => {}}
            className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
          />
          
          {/* SVG Container */}
          <div className="w-full h-full flex justify-center items-center relative">
            {/* Heart Outline */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`w-5 h-5 fill-purple-500 dark:fill-purple-400 absolute transition-all duration-300 ${isLiked ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
              viewBox="0 0 24 24"
            >
              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
            </svg>


            {/* Heart Filled */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`w-5 h-5 fill-red-500 absolute transition-all duration-300 ${isLiked ? 'opacity-100 animate-[heartBeat_0.6s_ease-in-out_1]' : 'opacity-0 scale-0'}`}
              viewBox="0 0 24 24"
            >
              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
            </svg>


            {/* Celebration particles */}
            <div className={`absolute inset-0 ${isLiked ? 'animate-[celebration_0.8s_ease-out_1]' : 'opacity-0'}`}>
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-red-400 rounded-full"></div>
              <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-pink-400 rounded-full"></div>
              <div className="absolute bottom-1 left-1.5 w-0.5 h-0.5 bg-red-300 rounded-full"></div>
              <div className="absolute bottom-1 right-1.5 w-0.5 h-0.5 bg-pink-300 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-0.5 h-0.5 bg-red-500 rounded-full"></div>
              <div className="absolute top-1/2 right-0 w-0.5 h-0.5 bg-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}


      {/* Always visible floating elements */}
      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-purple-400/30 dark:bg-purple-500/30 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-indigo-400/20 dark:bg-indigo-500/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Action Buttons - only show if actionButtons prop is provided */}
      {actionButtons && (
        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50" onClick={(e) => {e.preventDefault(); e.stopPropagation();}}>
          {actionButtons}
        </div>
      )}
    </div>
  </Link>
);
};


export default ProductCard;
