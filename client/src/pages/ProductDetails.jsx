import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);

  //===added by shaun===============
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageMode, setImageMode] = useState('contain');
  //===added by shaun===============

  // Simple reusable components
  const StarRating = ({ rating = 5 }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );

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

  // Updated handleChat function for product-based chat
  const handleChat = () => {
    // Check if user is authenticated
    if (!user || !token) {
      toast.error("Please log in to start a chat", {
        icon: '🔒',
        duration: 3000,
      });
      navigate('/login');
      return;
    }

    // Check if user is trying to chat with themselves
    if (user.id === product.sellerId._id) {
      toast.error("You cannot chat with yourself!", {
        icon: '😅',
        duration: 3000,
      });
      return;
    }

    // Navigate to chat with product owner info
    navigate("/chat", { 
      state: { 
        ownerId: product.sellerId._id,
        productId: product._id 
      } 
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column - Your Image Section (PRESERVED EXACTLY) */}
          <div className="space-y-8">
            <div className="relative mx-auto">
              <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 dark:border-gray-600/50 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 relative dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800">
                
                {/* Enhanced Dynamic Carousel */}
                <div className="relative w-full h-full">
                  {/* Main Image Display */}
                  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50/80 to-purple-50/30 rounded-2xl overflow-hidden group dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800">
                    {product.images && product.images.length > 0 && (
                      <>
                        {/* Current Image with Better Fitting */}
                        <div className="relative w-full h-full flex items-center justify-center p-6">
                          <img
                            src={`${import.meta.env.VITE_SERVER_URL}/${product.images[currentImageIndex]}`}
                            alt={`Product ${currentImageIndex + 1}`}
                            className={`transition-all duration-700 cursor-zoom-in rounded-2xl shadow-lg ${
                              imageMode === 'zoom' 
                                ? 'scale-150 cursor-zoom-out' 
                                : imageMode === 'cover' 
                                  ? 'w-full h-full object-cover' 
                                  : 'max-w-full max-h-full object-contain'
                            }`}
                            onClick={() => setImageMode(
                              imageMode === 'contain' ? 'zoom' : 
                              imageMode === 'zoom' ? 'cover' : 'contain'
                            )}
                            onLoad={(e) => {
                              const img = e.target;
                              const ratio = img.naturalWidth / img.naturalHeight;
                              if (ratio < 1 && imageMode === 'contain') {
                                img.style.maxWidth = '85%';
                                img.style.maxHeight = '90%';
                              }
                            }}
                          />
                        </div>

                        {/* Image Grid Overlay with Click Handlers */}
                        {product.images.length > 1 && (
                          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-black/80 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-2 p-4 max-w-sm">
                              {product.images.slice(0, 6).map((image, index) => (
                                <div 
                                  key={index} 
                                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer group/thumb ${
                                    index === currentImageIndex 
                                      ? 'border-yellow-400 ring-2 ring-yellow-400' 
                                      : 'border-white/50 hover:border-white'
                                  }`}
                                  onClick={() => setCurrentImageIndex(index)}
                                >
                                  <img
                                    src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                              {product.images.length > 6 && (
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-white/50 bg-white/20 flex items-center justify-center">
                                  <span className="text-white font-semibold">+{product.images.length - 6}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Smart Image Count Badge */}
                        {product.images.length > 1 && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full font-medium">
                            {currentImageIndex + 1} / {product.images.length}
                          </div>
                        )}

                        {/* Improved View Mode Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageMode(
                              imageMode === 'contain' ? 'zoom' : 
                              imageMode === 'zoom' ? 'cover' : 'contain'
                            );
                          }}
                          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 group/btn"
                          title={
                            imageMode === 'contain' ? 'Zoom In' : 
                            imageMode === 'zoom' ? 'Fill Screen' : 'Fit Screen'
                          }
                        >
                          {imageMode === 'contain' ? (
                            <svg className="w-5 h-5 text-slate-700 group-hover/btn:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M7 9a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M8 7a1 1 0 011 1v1a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd"/>
                            </svg>
                          ) : imageMode === 'zoom' ? (
                            <svg className="w-5 h-5 text-slate-700 group-hover/btn:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 000 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm9 1a1 1 0 010 2h1.586l-2.293 2.293a1 1 0 001.414 1.414L15 8.414V10a1 1 0 102 0V6a1 1 0 00-1-1h-4z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M5 12a1 1 0 011 1v1.586l2.293-2.293a1 1 0 011.414 1.414L7.414 16H9a1 1 0 110 2H5a1 1 0 01-1-1v-4a1 1 0 011-1zm10 0a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L13.586 15V13a1 1 0 011-1z" clipRule="evenodd"/>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-slate-700 group-hover/btn:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M8 6a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </button>

                        {/* Enhanced Navigation Arrows */}
                        {product.images.length > 1 && (
                          <>
                            <button
                              onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1)}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group/nav hover:scale-110"
                            >
                              <svg className="w-6 h-6 text-slate-700 group-hover/nav:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                            </button>
                            
                            <button
                              onClick={() => setCurrentImageIndex(currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group/nav hover:scale-110"
                            >
                              <svg className="w-6 h-6 text-slate-700 group-hover/nav:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Zoom Instruction */}
                        {imageMode === 'zoom' && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-sm text-white text-sm rounded-full font-medium animate-pulse">
                            Click image to exit zoom
                          </div>
                        )}
                        
                      </>
                    )}
                  </div>

                  {/* Enhanced Decorative Elements */}
                  <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl rotate-12 opacity-70 animate-pulse shadow-lg"></div>
                  <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-full -rotate-12 opacity-60 shadow-xl animate-pulse delay-1000"></div>
                  
                  {/* Enhanced floating particles */}
                  <div className="absolute top-12 right-12 w-3 h-3 bg-blue-500/40 rounded-full animate-ping shadow-md"></div>
                  <div className="absolute bottom-24 left-10 w-2 h-2 bg-indigo-400/50 rounded-full animate-pulse delay-700 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Marketplace Focus Design */}
          <div className="space-y-6">
            
            {/* Simple Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">Available</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <StarRating rating={5} />
              <span className="text-gray-600 dark:text-gray-400">4.8 (1,247 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ₹{product.price?.toLocaleString()}
              </span>
              <span className="text-lg text-gray-500">
                (Negotiable)
              </span>
            </div>

            {/* Marketplace Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Marketplace Deal</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Chat with the seller to negotiate price, ask questions, and arrange purchase details directly.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Actions - Chat & Wishlist Focus */}
            <div className="space-y-3 pt-4">
              {/* Primary Action - Chat with Seller */}
              <button 
                onClick={handleChat}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
                Chat with Seller
              </button>
              
              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  Add to Wishlist
                </button>
                <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.tags?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Details</h3>
              <div className="space-y-3">
                {product.categoryId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="text-gray-900 dark:text-white font-medium">{product.categoryId.title}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Listed</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(product.createdAt || Date.now()).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Info - Enhanced for marketplace */}
            {product.sellerId && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  {product.sellerId.profilePic && (
                    <div className="relative">
                      <img
                        src={import.meta.env.VITE_SERVER_URL + "/" + product.sellerId.profilePic}
                        alt={product.sellerId.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {product.sellerId.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <StarRating rating={5} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Verified seller</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  💬 Start a conversation to discuss price, condition, pickup/delivery options, and payment methods.
                </div>

                <button
                  onClick={handleChat}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                  Start Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
