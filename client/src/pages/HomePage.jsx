/* src/pages/HomePage.jsx */
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const categories = [
  {
    title: 'Limited Edition Cars',
    description: 'High-end vehicles rarely seen on roads.',
    image: '/assets/car.jpg',
  },
  {
    title: 'Luxury Watches',
    description: 'Rare, vintage, and exclusive timepieces.',
    image: '/assets/watch.jpg',
  },
  {
    title: 'Art & Paintings',
    description: 'Exclusive and collectible artwork.',
    image: '/assets/art.avif',
  },
  {
    title: 'Antiques & Artifacts',
    description: 'Timeless treasures with historical value.',
    image: '/assets/antique.jpg',
  },
  {
    title: 'Rare Collectibles',
    description: 'Figurines, toys, and memorabilia hard to find.',
    image: '/assets/collectibles.jpg',
  },
  {
    title: 'Designer Fashion',
    description: 'Luxury clothes and accessories.',
    image: '/assets/fashion.avif',
  },
];

const HomePage = () => (
  <div className="bg-base-100">
    <Hero />

    <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mt-10 mb-8 sm:mb-10 text-center">
      Explore&nbsp;By&nbsp;Category
    </h2>

    {/* Grid ⇒ 1 col on phones → 2 on small tablets → 3 on desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-10 lg:px-28 pb-12">
      {categories.map((c, i) => (
        <Link
          key={i}
          to="#"
          aria-label={`Browse ${c.title}`}
          className="
            card bg-base-200
            w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto
            shadow-md transition duration-300 ease-out
            hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.04]
            focus:outline-none focus:ring focus:ring-primary
          "
        >
          {/* 4:3 box keeps images consistent across breakpoints */}
          <figure className="aspect-[4/3]">
            <img
              src={c.image}
              alt={c.title}
              className="w-full h-full object-cover rounded-t-xl"
            />
          </figure>

          <div className="card-body items-center text-center px-4 pb-6">
            <h2 className="card-title text-lg sm:text-xl lg:text-2xl font-sans">
              {c.title}
            </h2>
            <p className="text-sm sm:text-base font-sans">{c.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default HomePage;
