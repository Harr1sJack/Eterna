import React from "react";

const Carousel = ({ images = [] }) => {
  if (!images.length) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="carousel w-full bg-transparent">
        {images.map((img, idx) => (
          <div
            key={idx}
            id={`slide${idx}`}
            className="carousel-item relative w-full bg-transparent"
          >
            <img
              src={import.meta.env.VITE_SERVER_URL + "/" + img}
              alt={`product-${idx}`}
              className="w-full object-contain max-h-[500px] bg-transparent"
            />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a
                href={`#slide${(idx - 1 + images.length) % images.length}`}
                className="btn btn-circle opacity-80"
              >
                ❮
              </a>
              <a
                href={`#slide${(idx + 1) % images.length}`}
                className="btn btn-circle opacity-80"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
