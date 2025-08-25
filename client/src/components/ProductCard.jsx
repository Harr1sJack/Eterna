import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, title, description, price, images = [], tags = [] } = product;

  return (
    <Link to={`/products/${id}`} className="block">
      <div className="rounded-xl shadow-lg py-3 px-4 flex gap-3 items-center border border-[#e2e4ed] min-w-[200px] w-full min-h-[190px]
        bg-gradient-to-br from-[#e9d5ff]/50 via-[#f1eff6]/50 to-[#f0c4f8]/50 hover:shadow-xl hover:scale-[1.02] transition">
        
        {/* Image wrapper */}
        <div className="w-36 h-36 flex items-center justify-center">
          <img
            src={
              images.length > 0
                ? import.meta.env.VITE_SERVER_URL + "/" + images[0]
                : "/placeholder.png"
            }
            alt={title}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="font-bold text-xl mb-1 line-clamp-1 text-[#431363]">{title}</div>
          <div className="text-base text-gray-700 mb-2 line-clamp-2">{description}</div>
          <div className="text-[#431363] font-bold text-lg mb-2">₹{price}</div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/70 text-[#431363] rounded px-2 py-0.5 text-xs shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
