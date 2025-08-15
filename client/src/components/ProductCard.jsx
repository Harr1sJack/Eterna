import React from 'react';

const ProductCard = ({ product }) => {
  const { title, description, price, images = [], tags = [] } = product;

  return (
    <div className="bg-white rounded-xl shadow-lg py-2 px-3 flex gap-2 items-center border border-[#e2e4ed] min-w-[180px] w-full">
      <img
        src={images.length > 0 ? images[0] : "/placeholder.png"}
        alt={title}
        className="w-32 h-24 object-cover rounded-lg border"
        loading="lazy"
      />
      <div className="flex-1">
        <div className="font-bold text-base mb-1">{title}</div>
        <div className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</div>
        <div className="text-[#431363] font-bold text-sm mb-1">₹{price}</div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag, i) => (
              <span key={i} className="bg-[#ece7fa] text-[#431363] rounded px-2 py-0.5 text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
