import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "../components/Carousel";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/products/${id}`
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center py-10">Loading...</p>;

  const handleChat = () => {
    navigate(`/chat/${product.sellerId._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9e8ff] via-[#e6c2ee] to-[#d9bafb] pb-20">
      <div className="pt-24 px-4 sm:px-10 lg:px-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#431363] text-center mb-12">
          Product Details
        </h1>

        {/* Image Gallery */}
        <Carousel images={product.images} />

        {/* Content Box */}
        <div className="max-w-3xl mx-auto mt-8 p-8 rounded-3xl shadow-xl 
                        bg-gradient-to-tr from-white/80 via-purple-50/70 to-purple-100/70
                        backdrop-blur-md space-y-6">
          {/* Product Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#431363]">{product.title}</h2>

          {/* Description */}
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="text-3xl font-extrabold text-[#6b1fa1]">₹{product.price}</div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-purple-200 text-purple-800 px-4 py-1 rounded-full text-sm sm:text-base font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Seller Info */}
          {product.sellerId && (
            <div className="flex items-center gap-4 mt-4">
              {product.sellerId.profilePic && (
                <img
                  src={import.meta.env.VITE_SERVER_URL + "/" + product.sellerId.profilePic}
                  alt={product.sellerId.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-purple-300"
                />
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-[#431363] text-lg sm:text-xl">
                  {product.sellerId.name}
                </span>
                <button
                  onClick={handleChat}
                  className="mt-2 bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition font-medium"
                >
                  Chat with Seller
                </button>
              </div>
            </div>
          )}

          {/* Category */}
          {product.categoryId && (
            <div className="mt-6 text-sm sm:text-base text-gray-600">
              Category: <span className="font-semibold text-[#431363]">{product.categoryId.title}</span>
            </div>
          )}
        </div>

        {/* Extra bottom margin */}
        <div className="mt-12"></div>
      </div>
    </div>
  );
};

export default ProductDetails;
