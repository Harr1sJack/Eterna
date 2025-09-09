import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, title, description, price, images = [] } = product;

  return (
    <Link to={`/products/${id}`}>
      <div className="w-[252px] h-[265px] bg-white dark:bg-gray-800 rounded-[30px] transition-all duration-200 hover:cursor-pointer flex flex-col overflow-hidden">
        {/* Image section */}
        <div className="w-full h-[132px] flex-shrink-0 rounded-t-[30px] bg-gradient-to-r from-[#e66465] to-[#9198e5] flex items-start justify-end relative">
          <img
            src={
              images.length > 0
                ? import.meta.env.VITE_SERVER_URL + "/" + images[0]
                : "/placeholder.png"
            }
            alt={title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-[30px]"
          />
          <div className="save transition-all duration-200 rounded-[10px] m-5 w-[30px] h-[30px] bg-white dark:bg-gray-200 flex items-center justify-center hover:scale-110 hover:rotate-[10deg] absolute top-0 right-0">
            <svg className="w-[15px] h-[15px] transition-all duration-200 hover:fill-[#ced8de] fill-gray-600" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0">
            <h3 className="font-['Lucida_Sans'] text-[15px] font-semibold text-black dark:text-white line-clamp-1 mb-1">{title}</h3>
            <p className="font-['Lucida_Sans'] text-[13px] text-[#999999] dark:text-gray-400 line-clamp-2 leading-tight">{description}</p>
          </div>
          
          <div className="w-[70%] p-[10px] bg-[#e3fff9] dark:bg-gray-700 rounded-[10px] flex items-center justify-start flex-shrink-0 mt-2">
            <span className="font-['Lucida_Sans'] text-[13px] font-medium text-[#9198e5] dark:text-blue-400 truncate">₹{price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
