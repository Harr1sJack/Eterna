/* src/pages/HomePage.jsx */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';

const categories = [
  {
    title: 'Antiques & Collectibles',
    description: 'Old furniture, coins, stamps, and memorabilia.',
    image: '/assets/antique.jpg',
    keywords: [
      'furniture', 'vintage', 'antique', 'memorabilia', 'old coins', 'rare stamps', 'old books',
      'collectibles', 'postcards', 'ceramics', 'figurines', 'retro decor', 'old maps', 'vintage signs',
      'military medals', 'historical objects', 'antique clocks', 'old photographs', 'vintage glassware',
      'collectible toys', 'heritage', 'rustic', 'classic pieces', 'curios', 'rare items'
    ]
  },
  {
    title: 'Art & Decor',
    description: 'Original paintings, sculptures, and wall art.',
    image: '/assets/art.avif',
    keywords: [
      'paintings', 'sculptures', 'canvas', 'drawings', 'wall art', 'modern art', 'fine art', 'sketches',
      'home decor', 'framed art', 'gallery pieces', 'handmade', 'minimalist decor', 'abstract', 'portraits',
      'mural', 'watercolor', 'artwork', 'interior pieces', 'decorative items', 'art exhibition', 'home vibe'
    ]
  },
  {
    title: 'Watches & Jewelry',
    description: 'Luxury watches, vintage rings, and designer pieces.',
    image: '/assets/watch.jpg',
    keywords: [
      'watches', 'rings', 'bracelets', 'vintage jewelry', 'gold', 'silver', 'diamond', 'luxury watches',
      'earrings', 'designer sets', 'necklaces', 'jewelry box', 'timeless', 'chronograph', "men's watches",
      "women's jewelry", 'pendant', 'brooch', 'timepiece', 'jewelry design', 'heritage jewelry', 'rare gems'
    ]
  },
  {
    title: 'Limited Edition Vehicles',
    description: 'Rare cars, classics, and concept models.',
    image: '/assets/car.jpg',
    keywords: [
      'limited edition cars', 'rare vehicles', 'sports car', 'classic car', 'vintage bike', 'concept vehicle',
      'luxury SUV', 'supercar', 'custom cars', 'restored jeep', 'motorcycle', 'collector car', 'hot rod',
      'performance cars', 'race cars', 'rare scooters', 'retro cars', '4x4', 'heritage bikes', 'showroom exclusives'
    ]
  },
  {
    title: 'Rare Books & Manuscripts',
    description: 'First editions, signed books, and ancient texts.',
    image: '/assets/books.JPG',
    keywords: [
      'rare books', 'signed books', 'manuscripts', 'first edition', 'literature', 'ancient texts',
      'collector books', 'handwritten notes', 'scrolls', 'old dictionaries', 'archives', 'poetry books',
      'limited prints', 'classic novels', 'library collections', 'bibliophile', 'paperbacks', 'historic documents'
    ]
  },
  {
    title: 'Vintage Electronics & Tech',
    description: 'Retro gadgets, film cameras, and consoles.',
    image: '/assets/Electronics.jpg',
    keywords: [
      'retro tech', 'vintage electronics', 'film camera', 'cassette', 'walkman', 'typewriter', 'game console',
      'floppy disk', 'CRT', 'joystick', 'handheld games', 'vintage TV', 'old radios', 'reel player',
      'record player', 'retro gadgets', 'classic phones', '8-bit console', 'tech memorabilia'
    ]
  },
  {
    title: 'Limited Edition Fashion & Accessories',
    description: 'Sneakers, designer bags, and exclusive clothing.',
    image: '/assets/fashion.jpg',
    keywords: [
      'fashion', 'sneakers', 'kurta', 'bags', 'designer bags', 'accessories', 'caps', 'watches', 'jewelry',
      'shoes', 'streetwear', 'exclusive clothing', 'luxury fashion', 'scarves', 'jackets', 'coats', 'heels',
      'menswear', 'womenswear', 'handbags', 'hoodies', 'rare outfits', 'limited series fashion'
    ]
  },
  {
    title: 'Toys & Games',
    description: 'Collector toys, trading cards, and LEGO sets.',
    image: '/assets/toys.JPG',
    keywords: [
      'toys', 'action figures', 'lego', 'trading cards', 'board games', 'puzzles', 'collector toys', 'vintage toys',
      'toy cars', 'playsets', 'classic toys', 'game figurines', 'dolls', 'limited edition toys', 'miniatures',
      'model kits', 'plushies', 'arcade games', 'pop culture toys'
    ]
  },
  {
    title: 'Music & Instruments',
    description: 'Guitars, signed vinyls, and music gear.',
    image: '/assets/music.JPG',
    keywords: [
      'guitars', 'vinyls', 'signed albums', 'music gear', 'instruments', 'keyboards', 'amplifiers', 'drums',
      'microphones', 'rare music', 'music memorabilia', 'vintage instruments', 'record players', 'speakers',
      'mixers', 'DJ gear', 'signed music', 'classic albums', 'collectible music'
    ]
  },
  {
    title: 'Film & Pop Culture Memorabilia',
    description: 'Props, posters, autographs, and comics.',
    image: '/assets/film.jpg',
    keywords: [
      'movie props', 'autographs', 'film posters', 'comics', 'pop culture', 'signed scripts', 'costumes',
      'figurines', 'celebrity memorabilia', 'fan collectibles', 'limited movie editions', 'franchise items',
      'superhero', 'film relics', 'TV show merchandise', 'action comics', 'movie collectibles'
    ]
  },
  {
    title: 'Tech & Innovations (New Exclusives)',
    description: 'AI gadgets, early tech, and new inventions.',
    image: '/assets/tech.jpg',
    keywords: [
      'AI gadgets', 'robotics', 'early tech', 'startups', 'exclusive tech', 'prototypes', 'innovation',
      'wearables', 'IoT devices', 'smart gear', 'concept tech', 'experimental', 'new launch', 'modern tech',
      'tech showcase', 'future gadgets'
    ]
  },
  {
    title: 'Designer Furniture & Interior',
    description: 'Modern furniture, lights, and carpentry art.',
    image: '/assets/interior.jpg',
    keywords: [
      'furniture', 'interior design', 'sofa', 'table', 'chairs', 'designer lights', 'shelves', 'woodwork',
      'interior pieces', 'carpentry', 'decor items', 'handcrafted', 'modern home', 'interior styling',
      'custom furniture', 'functional art', 'home design', 'modular furniture'
    ]
  },
  {
    title: 'Historical & Cultural Artifacts',
    description: 'Tribal art, idols, relics, and textiles.',
    image: '/assets/culture.JPG',
    keywords: [
      'tribal art', 'cultural artifacts', 'ancient idols', 'heritage relics', 'traditional clothing',
      'textiles', 'ethnic crafts', 'ritual objects', 'historic decor', 'tribal sculptures', 'folklore items',
      'regional antiques', 'museum pieces', 'cultural heritage', 'ancient culture'
    ]
  },
  {
    title: 'Scientific & Industrial Rarities',
    description: 'Lab gear, prototypes, and machines.',
    image: '/assets/science.jpg',
    keywords: [
      'scientific equipment', 'lab tools', 'industrial machines', 'rare gadgets', 'scientific instruments',
      'microscope', 'telescope', 'engineering prototypes', 'mechanical models', 'machinery', 'research tools',
      'vintage science', 'calibration instruments', 'gears', 'invention relics'
    ]
  },
  {
    title: 'Other / Miscellaneous',
    description: 'Unique and uncategorized collector items.',
    image: '/assets/other.jpg',
    keywords: [
      'miscellaneous', 'unique items', 'weird collectibles', 'unusual', 'rare finds', 'surprise items',
      'mixed category', 'oddities', 'uncategorized', 'special editions', 'unknown relics'
    ]
  },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const isMatch = (title, description, keywords = []) =>
    searchTerm.length > 0 &&
    (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    );



  return (
    <div className="bg-[#f5f5f7] text-[#431363]">
      <Hero />

      {/* Centered Title */}
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
        {/* Search bar row, right-aligned */}
        <div className="flex justify-end w-full mb-8 sm:mb-10">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Type anything you’re looking for..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-12 pr-4 py-2 bg-[#e2e4ed]
                rounded-full border border-gray-300
                focus:outline-none focus:border-gray-500
                shadow-sm focus:shadow-md
                transition-all duration-300 ease-in-out
                bg-base-100 text-sm
              "
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

     {/* Category Grid */}
<div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-10 lg:px-28 pb-12">
  {categories.map((c, i) => {
    const matched = isMatch(c.title, c.description, c.keywords);

    const ref =
  matched &&
  i === categories.findIndex(cat => searchTerm.length > 0 && isMatch(cat.title, cat.description))
    ? (el) => {
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200); // Delay for smoother scroll after render
        }
      }
    : null;


    return (
      <Link
        key={i}
        to={`/explore?category=${encodeURIComponent(c.title)}`}
        aria-label={`Browse ${c.title}`}
        ref={ref}
        className={`
          card bg-[#ffffff]
          w-full max-w-xs sm:max-w-sm lg:max-w-none mx-auto
          shadow-md transition duration-300 ease-out
          hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.04]
          focus:outline-none focus:ring focus:ring-primary
          ${matched ? 'ring-2 ring-green-500 scale-[1.02] border border-green-400' : ''}
        `}
      >
        <div className="relative">
          <figure className="aspect-[4/3] relative overflow-hidden">
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              className="w-full h-full object-cover rounded-t-[0.75rem] rounded-b-none"
            />
            {/* Gradient overlay with both stops as #fdfcff, transparent to opaque for perfect blend */}
            <div
              className="absolute left-0 bottom-0 w-full h-5 sm:h-9 lg:h-9 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(253,251,255,0) 0%, #fdfbff 100%)',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
          </figure>
          {/* Overlap card body with negative margin to blend with gradient */}
          <div className="card-body items-center text-center px-4 pb-0.5 -mt-8 sm:-mt-10 lg:-mt-12 relative z-10">
            <h2 className="card-title text-sm sm:text-base lg:text-lg font-sans leading-tight">
              {c.title}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-gray-500">{c.description}</p>
          </div>
        </div>
      </Link>
    );
  })}
</div>

    </div>
  );
};

export default HomePage;
