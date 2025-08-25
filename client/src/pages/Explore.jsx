import React, {useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Explore = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/approved`);

        const structuredProducts = res.data.map(p => ({
          id: p._id,
          title: p.title,
          description: p.description,
          price: p.price,
          stock: p.stock,
          condition: p.condition,
          images: Array.isArray(p.images) ? p.images : [],
          seller: {
            id: p.sellerId?._id || null,
            name: p.sellerId?.name || "Unknown Seller",
          },
          categoryId: p.categoryId,
          isApproved: p.isApproved,
        }));

        setProducts(structuredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/assets/loginbk2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px)",
          opacity: 0.7,
        }}
        aria-hidden="true"
      ></div>

      <div className="relative mt-0 pt-24 sm:pt-28 px-4 sm:px-10 lg:px-28 text-[#431363] z-10">
        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-center w-full mb-6 text-[#431363] drop-shadow-md"
        >
          Explore Products
        </h1>


        {/* Search / Sort */}
        <div className="flex justify-end w-full mb-8 sm:mb-10">
          <div className="flex gap-4 items-center w-full sm:w-auto max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-[#f8f6ff] border border-[#e2e4ed] rounded px-4 py-2 text-[#431363] w-full max-w-xs focus:outline-none focus:border-[#431363] shadow-sm text-sm"
              value={filters.global || ""}
              onChange={e => setFilters(f => ({ ...f, global: e.target.value }))}
            />
            <select
              className="bg-[#f8f6ff] border border-[#e2e4ed] rounded px-4 py-2 text-[#431363] w-full max-w-xs focus:outline-none focus:border-[#431363] shadow-sm text-sm appearance-none"
              value={sorts.global || ""}
              onChange={e => setSorts(s => ({ ...s, global: e.target.value }))}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

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
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.length === 0 ? (
                  <div className="text-gray-00 italic">No products found.</div>
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
    </div>
  );
};

export default Explore;