import React from 'react';

const Card = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#000000]">
      <div className="card w-96 shadow-xl rounded-xl overflow-hidden relative bg-base-100">
        <div className="relative">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="w-full h-56 object-cover"
          />
          {/* Smooth gradient overlay from image to content */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-base-100 via-base-100/90 to-transparent"></div>
        </div>

        <div className="card-body">
          <h2 className="card-title text-[#431363]">Card Title</h2>
          <p className="text-gray-600">This card uses a soft gradient between the image and text to give a smooth, elegant transition effect.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
