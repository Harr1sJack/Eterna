import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";
import Switch from "../components/Switch.jsx"; 
import Loader from "../components/Loader.jsx"; 

const Admin = () => {
  const [pending, setPending] = useState([]);
  const [existing, setExisting] = useState([]);
  const [selected, setSelected] = useState("New Requests");
  const [showExisting, setShowExisting] = useState(false); 
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!showExisting) {
        await fetchPending();
      } else {
        await fetchExisting();
      }
      setLoading(false);
    };
    fetchData();
  }, [showExisting]);

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/pending`);
      setPending(res.data);
    } catch (error) {
      console.error("Error fetching pending products", error);
    }
  };

  const fetchExisting = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/approved`);
      setExisting(res.data);
    } catch (error) {
      console.error("Error fetching existing products", error);
    }
  };

  const approveProduct = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/products/approve/${id}`);
      fetchPending();
    } catch (error) {
      console.error("Error approving product", error);
    }
  };

  const rejectProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/reject/${id}`);
      // refresh both depending on current view
      if (!showExisting) {
        fetchPending();
      } else {
        fetchExisting();
      }
    } catch (error) {
      console.error("Error rejecting product", error);
    }
  };

  // ✅ Conditional rendering using if/else
  let content;
  if (!showExisting) {
    content = (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Product Approvals</h2>
          {pending.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200">
              {pending.length} pending
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All caught up!</h3>
            <p className="text-gray-600 dark:text-gray-400">No pending products require approval at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pending.map((p) => (
              <ProductCard 
                key={p._id} 
                product={p} 
                hideLikeButton={true}
                actionButtons={
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        approveProduct(p._id);
                      }}
                      className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 dark:from-emerald-600 dark:to-green-700 dark:hover:from-emerald-500 dark:hover:to-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 border border-emerald-400/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="relative z-10">Approve</span>
                      <div className="absolute inset-0 border border-emerald-300/50 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        rejectProduct(p._id);
                      }}
                      className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 dark:from-red-600 dark:to-rose-700 dark:hover:from-red-500 dark:hover:to-rose-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-105 border border-red-400/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="relative z-10">Reject</span>
                      <div className="absolute inset-0 border border-red-300/50 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </>
    );
  } else {
    content = (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Existing Products</h2>
          {existing.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              {existing.length} products
            </span>
          )}
        </div>
        {existing.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products available</h3>
            <p className="text-gray-600 dark:text-gray-400">There are no approved products in the marketplace yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {existing.map((p) => (
              <ProductCard 
                key={p._id} 
                product={p} 
                hideLikeButton={true}
                actionButtons={
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      rejectProduct(p._id);
                    }}
                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 dark:from-red-600 dark:to-rose-700 dark:hover:from-red-500 dark:hover:to-rose-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-105 border border-red-400/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                    <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="relative z-10">Delete Product</span>
                    <div className="absolute inset-0 border border-red-300/50 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                }
              />
            ))}
          </div>
        )}
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="text-gray-900 dark:text-white text-xl mt-4 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Admin Dashboard Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Manage product approvals and oversee marketplace content
            </p>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pending.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Products</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{existing.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Section for Main Functionality */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h3>
            <Switch 
              checked={showExisting}
              onChange={(checked) => setShowExisting(checked)}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 dark:from-purple-900/10 dark:via-transparent dark:to-blue-900/10 rounded-3xl"></div>
          
          <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/50 p-8">
            {content}
          </div>
          
          {/* Floating decoration elements */}
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
