import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, matched, shouldScroll }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldScroll && ref.current) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [shouldScroll]);

  return (
    <Link
      to={`/explore?category=${encodeURIComponent(category.title)}`}
      aria-label={`Browse ${category.title}`}
      ref={ref}
      className={`card bg-[#ffffff] w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto
                  shadow-md transition duration-300 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.04]
                  focus:outline-none focus:ring focus:ring-primary
                  ${matched ? 'ring-2 ring-green-500 scale-[1.02] border border-green-400' : ''}`}
    >
      <div className="relative">
        <figure className="aspect-[4/3] relative overflow-hidden">
          <img
            src={category.imageUrl} 
            alt={category.title}
            loading="lazy"
            className="w-full h-full object-cover rounded-t-[0.75rem] rounded-b-none"
          />
          <div
            className="absolute left-0 bottom-0 w-full h-5 sm:h-9 lg:h-9 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(253,251,255,0) 0%, #fdfbff 100%)',
            }}
          />
        </figure>
        <div className="card-body items-center text-center px-4 pb-0.5 -mt-8 sm:-mt-10 lg:-mt-12 relative z-10">
          <h2 className="card-title text-sm sm:text-base lg:text-lg font-sans leading-tight">
            {category.title}
          </h2>
          <p className="text-xs sm:text-sm font-sans text-gray-500">{category.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
