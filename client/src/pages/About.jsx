import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-400/5 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* 🔥 FIXED: Grid background using CSS gradients instead of SVG */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div 
          className="absolute inset-0 bg-gray-400 dark:bg-gray-600"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About Eterna
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Connecting collectors, enthusiasts, and sellers in a marketplace built for unique discoveries.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-gray-50 dark:bg-[#131313] rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
                To create a trusted platform where rare, unique, and valuable items find their perfect match.
                We believe in direct connections, fair transactions, and celebrating the stories behind every item.
              </p>
            </div>
          </section>

          {/* What We Do */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              What We Do
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#131313] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Discover Unique Items
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Browse through carefully curated collections of antiques, collectibles, vintage items, and rare finds from trusted sellers.
                </p>
              </div>

              <div className="bg-white dark:bg-[#131313] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Direct Communication
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect directly with sellers through our secure messaging system. Negotiate, ask questions, and build trust.
                </p>
              </div>

              <div className="bg-white dark:bg-[#131313] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Secure Transactions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All transactions are protected with our verification system and secure payment processing for peace of mind.
                </p>
              </div>

              <div className="bg-white dark:bg-[#131313] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Easy Selling
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  List your items with high-quality photos, detailed descriptions, and reach interested buyers instantly.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Our Story
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Eterna was born from a simple observation: the world is full of unique, valuable items that deserve to find their perfect home.
                  Traditional marketplaces often prioritize mass-produced goods, leaving collectors and enthusiasts with limited options.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  We created Eterna to change that. Our platform focuses exclusively on rare, unique, and collectible items,
                  providing a space where passionate buyers and sellers can connect directly, without unnecessary fees or middlemen.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Every item on Eterna has a story. We're here to help tell those stories and connect them with people who will appreciate them.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Meet the Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#131313] rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/Shaun.jpg"
                    alt="Shaun Rodrigues"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl" style={{display: 'none'}}>
                    SR
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Shaun Rodrigues
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Founder & Developer
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Passionate about creating platforms that bring people together through their shared interests in unique items.
                </p>
              </div>

              <div className="bg-white dark:bg-[#131313] rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <img
                    src="/profile/default.png"
                    alt="Harris Jack"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl rounded-full" style={{display: 'none'}}>
                    HJ
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Harris Jack
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Founder & Developer
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dedicated to building innovative solutions and creating seamless user experiences for our community.
                </p>
              </div>

              <div className="bg-white dark:bg-[#131313] rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <img
                    src="/profile/default.png"
                    alt="Rabin"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl rounded-full" style={{display: 'none'}}>
                    R
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Rabin
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Founder & Developer
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Focused on developing robust backend systems and ensuring platform reliability for all users.
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Our Values
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Trust</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Building confidence through transparency</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Passion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Celebrating what makes items special</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connecting like-minded enthusiasts</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Finding better ways to connect</p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center">
            <div className="bg-gray-900 dark:bg-[#131313] rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join our community of collectors and sellers. Whether you're looking for your next treasure or ready to share yours with the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/explore"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Start Exploring
                </Link>
                <Link
                  to="/contact"
                  className="border border-gray-600 text-white hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Bottom spacing for floating dock */}
      <div className="h-24"></div>
    </div>
  );
};

export default About;
