import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/categories`);
        const updatedCategories = (res.data || []).map(cat => ({
          ...cat,
          imageUrl: `${import.meta.env.VITE_SERVER_URL}/${cat.image}`
        }));
        setCategories(updatedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const isMatch = (title, description, keywords = []) =>
    searchTerm.length > 0 &&
    (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#431363] text-3xl">
        Loading categories...
        <br />
        <span className="loading loading-spinner text-error loading-xl w-12 h-12"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-[#431363] overflow-hidden">
      {/* Full-page blurred background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/loginbk1.jpg"
          alt="Home background"
          className="w-full h-full object-cover object-center blur-lg brightness-100 opacity-80"
        />
      </div>

      {/* Hero with its own background */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <img
            src="/assets/hero-bg.jpg"   // 👉 put your hero-specific background here
            alt="Hero background"
            className="w-full h-full object-cover object-center opacity-90"
          />
        </div>
        <Hero />
      </div>

      {/* Categories section */}
      <div className="px-4 sm:px-10 lg:px-28 mt-10">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center w-full mb-2"
          style={{
            color: '#431363',
            letterSpacing: '0.02em',
            fontWeight: 700,
            textShadow: '0 1px 8px #ece7fa',
          }}
        >
          Explore&nbsp;By&nbsp;Category
        </h2>

        {/* Search bar */}
        <div className="flex justify-end w-full mb-8 sm:mb-10">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Type anything you’re looking for..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-[#e2e4ed] rounded-full border border-gray-300
                         focus:outline-none focus:border-gray-500 shadow-sm focus:shadow-md
                         transition-all duration-300 ease-in-out text-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-10 lg:px-28 pb-12">
        {(() => {
          const visibleCategories = searchTerm.trim().length > 0
            ? categories.filter(c => isMatch(c.title, c.description, c.keywords || []))
            : categories;
          if (visibleCategories.length === 0) {
            return (
              <div className="col-span-3 lg:col-span-5 flex flex-col items-center justify-center py-12">
                <img
                  src="/assets/NotFound.jpg"
                  alt="No match found"
                  className="w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 object-contain mb-4 opacity-80 drop-shadow-lg transition-all duration-300"
                />
              </div>
            );
          }
          return visibleCategories.map((c, i) => (
            <CategoryCard
              key={c._id || i}
              category={c}
              matched={isMatch(c.title, c.description, c.keywords || [])}
              shouldScroll={false}
            />
          ));
        })()}
      </div>
      <div className="mt-12"></div>
    </div>
  );
};

export default HomePage;
