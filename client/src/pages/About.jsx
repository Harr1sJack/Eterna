import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-gradient-to-br from-purple-50 via-white to-purple-100 text-[#431363]">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl shadow-xl rounded-3xl px-8 py-12 space-y-16">

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center font-sans">About Eterna</h1>
        <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Eterna is your trusted marketplace for exclusive, rare, and one-of-a-kind items.
          Whether it's antiques, limited-edition fashion, vintage tech, or collectibles—Eterna
          helps buyers and sellers connect with confidence.
        </p>

        {/* Sections */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-purple-300">Our Vision</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            To build a unique community-driven platform where rare meets real. We want to empower everyday users
            to showcase and discover valuable treasures without complex middlemen or commissions.
          </p>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-purple-300">Why Choose Eterna?</h2>
          <ul className="list-disc text-left text-gray-700 space-y-2 max-w-xl mx-auto pl-6">
            <li>🛡️ Secure & verified profiles</li>
            <li>💬 Direct chat with interested buyers</li>
            <li>🚫 No hidden fees or commissions</li>
            <li>🌎 Reach a niche collector community</li>
            <li>📸 Easy upload and showcase of items</li>
          </ul>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-purple-300">Categories We Cover</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            From vintage electronics and retro fashion to historical relics and modern collectibles, 
            Eterna includes over 15 diverse and curated categories. If it’s rare, it belongs here.
          </p>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-purple-300">Meet the Creator</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Hi, I’m Shaun Rodrigues, the creator of Eterna. My goal was to develop a platform that celebrates 
            uniqueness and connects passionate buyers with one-of-a-kind products. Whether you're here to 
            explore or sell, I'm excited to have you on board.
          </p>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-purple-300">How It Works</h2>
          <ol className="list-decimal text-left text-gray-700 space-y-2 max-w-xl mx-auto pl-6">
            <li>Create your profile and set up your interests</li>
            <li>Explore categories or use the smart search bar</li>
            <li>Upload your rare finds with images and descriptions</li>
            <li>Connect directly with potential buyers through secure chat</li>
            <li>Negotiate, meet, and exchange—on your terms</li>
          </ol>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-purple-300">What’s Coming Next</h2>
          <ul className="list-disc text-left text-gray-700 space-y-2 max-w-xl mx-auto pl-6">
            <li>🌙 Dark mode toggle for better experience</li>
            <li>📍 Location-based discovery (optional)</li>
            <li>🔐 Enhanced admin review & fraud detection</li>
            <li>📊 Analytics for serious sellers</li>
            <li>🌐 Multi-language support</li>
          </ul>
        </section>

        <section className="text-center space-y-4 border-t border-purple-200 pt-10">
          <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-purple-300">Get in Touch</h2>
          <p className="text-gray-700 max-w-xl mx-auto">
            Have a suggestion, collaboration idea, or just want to say hi?
          </p>
          <Link
            to="/contact"
            className="text-white bg-[#431363] hover:bg-[#5b1b8d] px-6 py-2 rounded shadow-md transition font-medium inline-block"
          >
            Contact Us
          </Link>
        </section>

      </div>
    </div>
  );
};

export default About;
