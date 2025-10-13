import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import axios from 'axios';

const Explore = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get category from URL parameters
  const selectedCategoryId = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${import.meta.env.VITE_SERVER_URL}/api/products/approved`;
        
        // If category is selected, fetch products by category
        if (selectedCategoryId) {
          url = `${import.meta.env.VITE_SERVER_URL}/api/products/category/${selectedCategoryId}`;
        }
        
        const res = await axios.get(url);

        const structuredProducts = res.data.map(p => ({
          id: p._id,
          title: p.title,
          description: p.description,
          price: p.price,
          stock: p.stock,
          condition: p.condition,
          // Use firebaseUrls instead of images
          firebaseUrls: Array.isArray(p.firebaseUrls) ? p.firebaseUrls : 
                       Array.isArray(p.images) ? p.images : [], // fallback to images if firebaseUrls not available
          seller: {
            id: p.sellerId?._id || null,
            name: p.sellerId?.name || "Unknown Seller",
          },
          categoryId: p.categoryId,
          isApproved: p.isApproved,
          createdAt: p.createdAt, // Add createdAt for sorting
        }));

        setProducts(structuredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  const handleCategoryChange = (categoryId) => {
    if (categoryId === '') {
      // Show all products
      setSearchParams({});
    } else {
      // Filter by category
      setSearchParams({ category: categoryId });
    }
  };

  const getCurrentCategoryName = () => {
    if (!selectedCategoryId) return 'All Products';
    const category = categories.find(cat => cat._id === selectedCategoryId);
    return category ? category.title : 'All Products';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="text-[#431363] dark:text-purple-300 text-xl mt-4 font-medium">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

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

      <div className="relative mt-0 pt-24 sm:pt-28 px-4 sm:px-10 lg:px-28 text-[#431363] dark:text-white z-10">
        {/* Header section with current category */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-800 via-purple-600 to-slate-800 dark:from-gray-300 dark:via-purple-400 dark:to-gray-300 bg-clip-text text-transparent">
              {getCurrentCategoryName()}
            </span>
          </h1>
          {selectedCategoryId && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Showing {products.length} approved products in this category
            </p>
          )}
        </div>

        {/* Search / Sort / Category Filter */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full mb-8 sm:mb-10">
          
          {/* Category Filter Dropdown */}
          <div className="w-full lg:w-auto">
            <select
              className="bg-[#f8f6ff] dark:bg-black border border-[#e2e4ed] dark:border-gray-600 rounded px-4 py-2 text-[#431363] dark:text-white w-full lg:w-64 focus:outline-none focus:border-[#431363] dark:focus:border-white shadow-sm text-sm appearance-none"
              value={selectedCategoryId || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search and Sort */}
          <div className="flex gap-4 items-center w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-[#f8f6ff] dark:bg-black border border-[#e2e4ed] dark:border-gray-600 rounded px-4 py-2 text-[#431363] dark:text-white w-full lg:w-64 focus:outline-none focus:border-[#431363] dark:focus:border-white shadow-sm text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={filters.global || ""}
              onChange={e => setFilters(f => ({ ...f, global: e.target.value }))}
            />
            <select
              className="bg-[#f8f6ff] dark:bg-black border border-[#e2e4ed] dark:border-gray-600 rounded px-4 py-2 text-[#431363] dark:text-white w-full lg:w-48 focus:outline-none focus:border-[#431363] dark:focus:border-white shadow-sm text-sm appearance-none"
              value={sorts.global || ""}
              onChange={e => setSorts(s => ({ ...s, global: e.target.value }))}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Clear Filter Button */}
        {selectedCategoryId && (
          <div className="mb-6 text-center">
            <button
              onClick={() => handleCategoryChange('')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto">
          {(() => {
            let filteredProducts = [...products];

            // Search
            const search = (filters.global || "").toLowerCase();
            if (search) {
              filteredProducts = filteredProducts.filter(
                p =>
                  p.title.toLowerCase().includes(search) ||
                  p.description.toLowerCase().includes(search)
              );
            }

            // Sort
            if (sorts.global === "price-asc") {
              filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sorts.global === "price-desc") {
              filteredProducts.sort((a, b) => b.price - a.price);
            } else if (sorts.global === "newest") {
              filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sorts.global === "oldest") {
              filteredProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            } else if (sorts.global === "title") {
              filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <div className="text-gray-500 dark:text-gray-400 text-lg">
                      {selectedCategoryId 
                        ? `No products found in ${getCurrentCategoryName()}`
                        : 'No products found'
                      }
                    </div>
                    {search && (
                      <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        Try a different search term or clear your filters
                      </div>
                    )}
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            );
          })()}
        </div>
      </div>
      <div className="mt-12"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Explore;
