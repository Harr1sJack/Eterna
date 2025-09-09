import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "../components/Carousel";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  //===added by shaun===============
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageMode, setImageMode] = useState('contain');
  //===added by shaun===============

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
    console.log(product)
    navigate(`/chat/${product.sellerId._id}`);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50 relative overflow-hidden dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800">
    {/* Enhanced floating background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-float-delay"></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-300/8 to-pink-300/8 rounded-full blur-2xl animate-pulse"></div>
    </div>

    {/* Animated grid background */}
    <div className="absolute inset-0 opacity-[0.02]">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 z' fill='none' stroke='%23431363' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)'/%3e%3c/svg%3e")`,
      }}></div>
    </div>

    <div className="relative z-10 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Image Section with Better Borders */}
        <div className="mb-16">
          <div className="relative mx-auto max-w-3xl">
            <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-gradient-to-br from-white to-slate-100 relative dark:border-gray-700 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800">
              
              {/* Enhanced Dynamic Carousel */}
              <div className="relative w-full h-full">
                {/* Main Image Display */}
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl overflow-hidden group dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800">
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
                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                          {currentImageIndex + 1} / {product.images.length}
                        </div>
                      )}

                      {/* Improved View Mode Button - Icon Only */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageMode(
                            imageMode === 'contain' ? 'zoom' : 
                            imageMode === 'zoom' ? 'cover' : 'contain'
                          );
                        }}
                        className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 group/btn"
                        title={
                          imageMode === 'contain' ? 'Zoom In' : 
                          imageMode === 'zoom' ? 'Fill Screen' : 'Fit Screen'
                        }
                      >
                        {imageMode === 'contain' ? (
                          <svg className="w-5 h-5 text-slate-700 group-hover/btn:text-[#3D165F] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                            <path fillRule="evenodd" d="M7 9a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"/>
                            <path fillRule="evenodd" d="M8 7a1 1 0 011 1v1a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd"/>
                          </svg>
                        ) : imageMode === 'zoom' ? (
                          <svg className="w-5 h-5 text-slate-700 group-hover/btn:text-[#3D165F] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 000 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm9 1a1 1 0 010 2h1.586l-2.293 2.293a1 1 0 001.414 1.414L15 8.414V10a1 1 0 102 0V6a1 1 0 00-1-1h-4z" clipRule="evenodd"/>
                            <path fillRule="evenodd" d="M5 12a1 1 0 011 1v1.586l2.293-2.293a1 1 0 011.414 1.414L7.414 16H9a1 1 0 110 2H5a1 1 0 01-1-1v-4a1 1 0 011-1zm10 0a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L13.586 15V13a1 1 0 011-1z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-700 group-hover/btn:text-[#3D165F] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                            <path fillRule="evenodd" d="M8 6a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </button>

                      {/* Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group/nav"
                          >
                            <svg className="w-5 h-5 text-slate-700 group-hover/nav:text-[#3D165F] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => setCurrentImageIndex(currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group/nav"
                          >
                            <svg className="w-5 h-5 text-slate-700 group-hover/nav:text-[#3D165F] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Zoom Instruction */}
                      {imageMode === 'zoom' && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full font-medium animate-pulse">
                          Click image to exit zoom
                        </div>
                      )}
                      
                    </>
                  )}
                </div>

                {/* Enhanced Decorative Elements with More Presence */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-[#3D165F]/30 to-indigo-500/30 rounded-3xl rotate-12 opacity-70 animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-indigo-500/25 to-purple-500/25 rounded-full -rotate-12 opacity-60 animate-float shadow-xl"></div>
                
                {/* Enhanced floating particles */}
                <div className="absolute top-12 right-12 w-3 h-3 bg-[#3D165F]/40 rounded-full animate-ping shadow-md"></div>
                <div className="absolute bottom-24 left-10 w-2 h-2 bg-indigo-400/50 rounded-full animate-pulse delay-700 shadow-sm"></div>
              </div>

            </div>
          </div>
        </div>

        {/* Main Content Layout - Now More Visible */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Product Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Product Title & Price Hero Section */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/80 via-white/70 to-purple-50/50 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-700 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800 dark:border-gray-700">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3D165F]/5 to-indigo-500/5"></div>
              
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white leading-tight mb-3">
                      {product.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-slate-600 dark:text-gray-300 font-medium text-sm">(4.8) • 127 reviews</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D165F] to-indigo-600 mb-2">
                      ₹{product.price}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      In Stock
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl p-5 border border-slate-200/50 mb-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#3D165F] to-indigo-500 rounded-full"></div>
                    Description
                  </h3>
                  <p className="text-slate-700 dark:text-gray-300 text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Enhanced Tags Section */}
                {product.tags?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#3D165F] to-indigo-500 rounded-full"></div>
                      Features & Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="group relative px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-[#3D165F] hover:to-indigo-500 text-slate-800 hover:text-white rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border border-slate-300/50 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                        >
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3D165F]/0 to-indigo-400/0 group-hover:from-[#3D165F]/20 group-hover:to-indigo-400/20 transition-all duration-300"></div>
                          <span className="relative z-10 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></div>
                            {tag}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Specifications */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-xl border border-white/60 shadow-lg dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-[#3D165F] to-indigo-500 rounded-full"></div>
                Product Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.categoryId && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/30 dark:bg-gray-800 dark:border-gray-700">
                    <span className="font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-[#3D165F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-4l-3 3-3-3H5a2 2 0 01-2-2V5z" clipRule="evenodd"/>
                      </svg>
                      Category
                    </span>
                    <span className="font-semibold text-[#3D165F] bg-purple-100 px-2 py-1 rounded-full text-xs">
                      {product.categoryId.title}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-slate-50 to-purple-50 border border-slate-200/30 dark:bg-gray-800 dark:border-gray-700">
                  <span className="font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    Listed
                  </span>
                  <span className="font-semibold text-indigo-700 dark:text-gray-300 text-xs">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/30 dark:bg-gray-800 dark:border-gray-700">
                  <span className="font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    Views
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-gray-300 text-xs">2,847</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/30 dark:bg-gray-800 dark:border-gray-700">
                  <span className="font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    Rating
                  </span>
                  <span className="font-semibold text-amber-700 dark:text-gray-300 text-xs">4.8/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Seller & Actions */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            {/* Seller Profile Card */}
            {product.sellerId && (
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-white/90 to-purple-50/70 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-500 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800 dark:border-gray-700">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#3D165F]/10 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <div className="relative text-center">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-[#3D165F]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    Trusted Seller
                  </h3>
                  
                  <div className="space-y-4">
                    {product.sellerId.profilePic && (
                      <div className="relative mx-auto w-16 h-16">
                        <img
                          src={import.meta.env.VITE_SERVER_URL + "/" + product.sellerId.profilePic}
                          alt={product.sellerId.name}
                          className="w-full h-full rounded-full object-cover border-3 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                        {product.sellerId.name}
                      </h4>
                      <div className="flex items-center justify-center gap-1 text-amber-400 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                        <span className="text-slate-600 dark:text-gray-300 font-medium ml-1 text-sm">4.9</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="text-center p-2 bg-purple-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-semibold text-[#3D165F] dark:text-white">156</div>
                          <div className="text-slate-600 dark:text-gray-400 text-xs">Sales</div>
                        </div>
                        <div className="text-center p-2 bg-indigo-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-semibold text-indigo-700 dark:text-white">98%</div>
                          <div className="text-slate-600 dark:text-gray-400 text-xs">Rating</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleChat}
                        className="w-full bg-gradient-to-r from-[#3D165F] to-indigo-600 hover:from-[#4a1d75] hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                        </svg>
                        Message Seller
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
                Add to Wishlist
              </button>
              
              <button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                </svg>
                Share Product
              </button>
              
              <button className="w-full border-2 border-red-200 dark:border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/>
                </svg>
                Report Item
              </button>
            </div>

            {/* Trust & Security */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 dark:bg-gray-800 dark:border-green-600">
              <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Buyer Protection
              </h4>
              <div className="space-y-1 text-xs text-green-700 dark:text-green-400">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Secure payment processing
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  7-day return policy
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Verified seller guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
      }
      @keyframes float-delay {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(-3deg); }
      }
      @keyframes gradient-x {
        0%, 100% {
          background-size: 200% 200%;
          background-position: left center;
        }
        50% {
          background-size: 200% 200%;
          background-position: right center;
        }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-float-delay { animation: float-delay 8s ease-in-out infinite; }
      .animate-gradient-x { animation: gradient-x 3s ease infinite; }
      
      .portrait-image {
        max-width: 75% !important;
      }
    `}</style>
  </div>
);




};

export default ProductDetails;
