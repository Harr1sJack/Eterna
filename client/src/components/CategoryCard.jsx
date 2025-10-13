import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const CategoryCard = ({ category, matched, shouldScroll }) => {
  const { theme } = useTheme();
  const ref = useRef(null);

  useEffect(() => {
    if (shouldScroll && ref.current) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [shouldScroll]);

  const gradient = theme === 'dark'
    ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #111827 100%)'
    : 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 100%)';

  return (
    <Link
      to={`/explore?category=${category._id}`}  // Fixed: Use category._id instead of title
      aria-label={`Browse ${category.title}`}
      ref={ref}
      className={`card bg-[#e8e8e8] dark:bg-[#121212] w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto
shadow-md transition duration-300 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.04]
focus:outline-none focus:ring focus:ring-primary ${matched ? 'ring-2 ring-purple-500' : ''}`}
    >
      <div className="relative">
        <figure className="aspect-[4/3] relative overflow-hidden">
          <img
            src={category.imageUrl} 
            alt={category.title}
            loading="lazy"
            className="w-full h-full object-cover rounded-t-[0.75rem] rounded-b-none transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src = '/assets/default-category.jpg'; // Fallback image
            }}
          />
          <div
            className="absolute left-0 bottom-0 w-full h-5 sm:h-9 lg:h-9 pointer-events-none"
            style={{
              background: gradient
            }}
          />
          
          {/* Optional: Add a subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </figure>
        
        <div className="card-body items-center text-center px-4 pb-0.5 -mt-4 sm:-mt-6 lg:-mt-8 relative z-10">
          <h2 className={`card-title text-sm sm:text-base lg:text-lg font-sans leading-tight text-[#3d165f] dark:text-[#D3D3D3] text-outline-black-light transition-colors duration-300 ${
            matched ? 'text-purple-600 dark:text-purple-400 font-bold' : ''
          }`}>
            {category.title}
          </h2>

          <p className={`text-xs sm:text-sm font-sans text-gray-500 dark:text-gray-400 transition-colors duration-300 ${
            matched ? 'text-purple-500 dark:text-purple-300' : ''
          }`}>
            {category.description}
          </p>
          
          {/* Optional: Show product count if available */}
          {category.productCount && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {category.productCount} products
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
