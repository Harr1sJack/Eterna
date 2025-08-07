import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const categories = [
  {
    id: 'antiques',
    icon: '🔮',
    title: 'Antiques & Collectibles',
    products: [
      {
        id: 'p1',
        title: 'Victorian Chair',
        description: 'Hand-carved, 19th century, mahogany.',
        image: '/assets/antique.jpg',
        price: 1200,
        tags: ['Vintage Furniture'],
      },
      {
        id: 'p2',
        title: 'Rare Stamp Set',
        description: 'Complete set from 1920s.',
        image: '/assets/antique.jpg',
        price: 350,
        tags: ['Rare Stamps'],
      },
      {
        id: 'p3',
        title: 'Old Map',
        description: '18th century world map.',
        image: '/assets/antique.jpg',
        price: 900,
        tags: ['Old Maps & Manuscripts'],
      },
    ],
  },
  {
    id: 'art',
    icon: '🖼️',
    title: 'Art & Decor',
    products: [
      {
        id: 'p4',
        title: 'Abstract Canvas',
        description: 'Original painting, signed by artist.',
        image: '/assets/art.avif',
        price: 800,
        tags: ['Original Paintings'],
      },
      {
        id: 'p5',
        title: 'Handmade Sculpture',
        description: 'Bronze, limited edition.',
        image: '/assets/art.avif',
        price: 1500,
        tags: ['Sculptures'],
      },
      {
        id: 'p6',
        title: 'Wall Tapestry',
        description: 'Handwoven, unique design.',
        image: '/assets/art.avif',
        price: 400,
        tags: ['Wall Art & Tapestries'],
      },
    ],
  },
  {
    id: 'watches',
    icon: '⌚',
    title: 'Watches & Jewelry',
    products: [
      {
        id: 'p7',
        title: 'Rolex Submariner',
        description: 'Luxury watch, stainless steel.',
        image: '/assets/watch.jpg',
        price: 9500,
        tags: ['Luxury Watches'],
      },
      {
        id: 'p8',
        title: 'Diamond Necklace',
        description: 'Designer jewelry, 18k gold.',
        image: '/assets/watch.jpg',
        price: 4200,
        tags: ['Designer Jewelry'],
      },
      {
        id: 'p9',
        title: 'Vintage Ring',
        description: 'Handcrafted, 1920s.',
        image: '/assets/watch.jpg',
        price: 1800,
        tags: ['Vintage Rings & Necklaces'],
      },
    ],
  },
  {
    id: 'vehicles',
    icon: '🚗',
    title: 'Limited Edition Vehicles',
    products: [
      {
        id: 'p10',
        title: 'Ferrari LaFerrari',
        description: 'Rare supercar, limited edition.',
        image: '/assets/car.jpg',
        price: 1500000,
        tags: ['Rare Supercars'],
      },
      {
        id: 'p11',
        title: 'Vintage Harley',
        description: 'Classic motorcycle, restored.',
        image: '/assets/car.jpg',
        price: 35000,
        tags: ['Vintage Motorcycles'],
      },
      {
        id: 'p12',
        title: 'Classic Mustang',
        description: '1967 Ford Mustang, mint condition.',
        image: '/assets/car.jpg',
        price: 70000,
        tags: ['Classic Cars'],
      },
    ],
  },
  {
    id: 'books',
    icon: '📚',
    title: 'Rare Books & Manuscripts',
    products: [
      {
        id: 'p13',
        title: 'First Edition Gatsby',
        description: 'Signed by author.',
        image: '/assets/books.jpg',
        price: 12000,
        tags: ['First Editions'],
      },
      {
        id: 'p14',
        title: 'Ancient Text',
        description: 'Handwritten, 15th century.',
        image: '/assets/books.jpg',
        price: 8000,
        tags: ['Ancient Texts'],
      },
      {
        id: 'p15',
        title: 'Collector Magazine',
        description: 'Rare issue, 1960s.',
        image: '/assets/books.jpg',
        price: 500,
        tags: ['Collector Magazines'],
      },
    ],
  },
  {
    id: 'electronics',
    icon: '💻',
    title: 'Vintage Electronics & Tech',
    products: [
      {
        id: 'p16',
        title: 'NES Console',
        description: 'Retro gaming, original box.',
        image: '/assets/Electronics.jpg',
        price: 350,
        tags: ['Retro Gaming Consoles'],
      },
      {
        id: 'p17',
        title: 'Polaroid Camera',
        description: 'Film camera, 1970s.',
        image: '/assets/Electronics.jpg',
        price: 120,
        tags: ['Film Cameras'],
      },
      {
        id: 'p18',
        title: 'Classic Radio',
        description: 'Vintage, fully functional.',
        image: '/assets/Electronics.jpg',
        price: 200,
        tags: ['Classic Radios / TVs'],
      },
    ],
  },
  {
    id: 'fashion',
    icon: '👟',
    title: 'Limited Edition Fashion & Accessories',
    products: [
      {
        id: 'p19',
        title: 'Yeezy Boost 350',
        description: 'Exclusive sneaker drop.',
        image: '/assets/fashion.jpg',
        price: 600,
        tags: ['Exclusive Sneaker Drops'],
      },
      {
        id: 'p20',
        title: 'Hermès Birkin',
        description: 'Luxury handbag, limited edition.',
        image: '/assets/fashion.jpg',
        price: 18000,
        tags: ['Luxury Handbags'],
      },
      {
        id: 'p21',
        title: 'Custom Hoodie',
        description: 'Streetwear collab piece.',
        image: '/assets/fashion.jpg',
        price: 150,
        tags: ['Custom Streetwear'],
      },
    ],
  },
  {
    id: 'toys',
    icon: '🧸',
    title: 'Toys & Games',
    products: [
      {
        id: 'p22',
        title: 'LEGO Millennium Falcon',
        description: 'Collector set, 7541 pieces.',
        image: '/assets/toys.jpg',
        price: 800,
        tags: ['LEGO Collector Sets'],
      },
      {
        id: 'p23',
        title: 'Charizard Card',
        description: 'Pokémon TCG, rare holographic.',
        image: '/assets/toys.jpg',
        price: 1200,
        tags: ['Trading Card Games'],
      },
      {
        id: 'p24',
        title: 'Retro Monopoly',
        description: 'Board game, 1978 edition.',
        image: '/assets/toys.jpg',
        price: 90,
        tags: ['Retro Board Games'],
      },
    ],
  },
  {
    id: 'music',
    icon: '🎵',
    title: 'Music & Instruments',
    products: [
      {
        id: 'p25',
        title: 'Vintage Fender Guitar',
        description: '1965, sunburst finish.',
        image: '/assets/music.jpg',
        price: 3500,
        tags: ['Vintage Guitars / Instruments'],
      },
      {
        id: 'p26',
        title: 'Signed Beatles Vinyl',
        description: 'Original pressing, signed.',
        image: '/assets/music.jpg',
        price: 5000,
        tags: ['Signed Vinyls / Records'],
      },
      {
        id: 'p27',
        title: 'Custom Tube Amp',
        description: 'Handmade audio equipment.',
        image: '/assets/music.jpg',
        price: 1200,
        tags: ['Custom Audio Equipment'],
      },
    ],
  },
  {
    id: 'film',
    icon: '🎬',
    title: 'Film & Pop Culture Memorabilia',
    products: [
      {
        id: 'p28',
        title: 'Star Wars Prop',
        description: 'Screen-used lightsaber.',
        image: '/assets/film.jpg',
        price: 25000,
        tags: ['Movie Props'],
      },
      {
        id: 'p29',
        title: 'Marvel Poster',
        description: 'Limited edition, signed.',
        image: '/assets/film.jpg',
        price: 600,
        tags: ['Limited Posters'],
      },
      {
        id: 'p30',
        title: 'Comic Book',
        description: 'Rare, first appearance.',
        image: '/assets/film.jpg',
        price: 2000,
        tags: ['Comic Books & Pop Figures'],
      },
    ],
  },
  {
    id: 'tech',
    icon: '🖥️',
    title: 'Tech & Innovations (New Exclusives)',
    products: [
      {
        id: 'p31',
        title: 'Indie Smartwatch',
        description: 'Kickstarter gadget, early access.',
        image: '/assets/tech.jpg',
        price: 250,
        tags: ['Kickstarter or Indie Gadgets'],
      },
      {
        id: 'p32',
        title: 'AI Home Assistant',
        description: 'Latest IoT demo device.',
        image: '/assets/tech.jpg',
        price: 400,
        tags: ['AI & IoT Demos'],
      },
      {
        id: 'p33',
        title: 'NFT Art Frame',
        description: 'Digital art display, NFT enabled.',
        image: '/assets/tech.jpg',
        price: 1200,
        tags: ['NFTs'],
      },
    ],
  },
  {
    id: 'interior',
    icon: '🛋️',
    title: 'Designer Furniture & Interior',
    products: [
      {
        id: 'p34',
        title: 'Limited Edition Sofa',
        description: 'Handmade, Italian leather.',
        image: '/assets/interior.jpg',
        price: 7000,
        tags: ['Limited Edition Furniture'],
      },
      {
        id: 'p35',
        title: 'Artistic Lamp',
        description: 'Modern sculpture lighting.',
        image: '/assets/interior.jpg',
        price: 1200,
        tags: ['Artistic Lighting'],
      },
      {
        id: 'p36',
        title: 'Handmade Table',
        description: 'Custom carpentry, oak wood.',
        image: '/assets/interior.jpg',
        price: 2500,
        tags: ['Handmade Carpentry Items'],
      },
    ],
  },
  {
    id: 'culture',
    icon: '🏺',
    title: 'Historical & Cultural Artifacts',
    products: [
      {
        id: 'p37',
        title: 'Ancient Pottery',
        description: 'Greek, 5th century BC.',
        image: '/assets/culture.jpg',
        price: 4000,
        tags: ['Ancient Pottery & Relics'],
      },
      {
        id: 'p38',
        title: 'Tribal Mask',
        description: 'African, hand-carved.',
        image: '/assets/culture.jpg',
        price: 1200,
        tags: ['Tribal & Ethnic Artifacts'],
      },
      {
        id: 'p39',
        title: 'Religious Idol',
        description: 'Bronze, 18th century.',
        image: '/assets/culture.jpg',
        price: 2200,
        tags: ['Religious Sculptures & Idols'],
      },
    ],
  },
  {
    id: 'science',
    icon: '🔬',
    title: 'Scientific & Industrial Rarities',
    products: [
      {
        id: 'p40',
        title: 'Vintage Microscope',
        description: 'Brass, 1920s.',
        image: '/assets/science.jpg',
        price: 900,
        tags: ['Early Scientific Instruments'],
      },
      {
        id: 'p41',
        title: 'Lab Equipment Set',
        description: 'Glassware, 1950s.',
        image: '/assets/science.jpg',
        price: 400,
        tags: ['Vintage Lab Equipment'],
      },
      {
        id: 'p42',
        title: 'Blueprints Collection',
        description: 'Engineering, rare prototypes.',
        image: '/assets/science.jpg',
        price: 1500,
        tags: ['Engineering Blueprints & Machines'],
      },
    ],
  },
  {
    id: 'other',
    icon: '🧾',
    title: 'Other / Miscellaneous',
    products: [
      {
        id: 'p43',
        title: 'Personal Letter',
        description: 'Handwritten, 1940s.',
        image: '/assets/other.jpg',
        price: 100,
        tags: ['Rare Personal Memorabilia'],
      },
      {
        id: 'p44',
        title: 'Unique Sculpture',
        description: 'One-of-a-kind, artist signed.',
        image: '/assets/other.jpg',
        price: 3000,
        tags: ['Unclassifiable One-of-a-kind Pieces'],
      },
      {
        id: 'p45',
        title: 'Collector Submission',
        description: 'Submitted by user, rare find.',
        image: '/assets/other.jpg',
        price: 500,
        tags: ['Unique Collector Submissions'],
      },
    ],
  },
];

const Explore = () => {
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState({});
  const location = useLocation();
  // Get category from query params
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get('category');
  // Find category id by title
  const categoryIdFromTitle = initialCategory
    ? categories.find(cat => cat.title === initialCategory)?.id || 'all'
    : 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryIdFromTitle);

  const handleToggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen relative">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/assets/loginbk2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
          opacity: 0.7,
        }}
        aria-hidden="true"
      ></div>
      <div className="relative mt-0 pt-24 sm:pt-28 px-4 sm:px-10 lg:px-28 text-[#431363] z-10">
        {/* Centered Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center w-full mb-2" style={{background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)', borderRadius: '1rem', display: 'inline-block', padding: '0.5rem 2rem'}}>Explore Products</h1>
        {/* Search/sort row, right-aligned */}
        <div className="flex justify-end w-full mb-8 sm:mb-10">
          <div className="flex gap-4 items-center w-full sm:w-auto max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-[#f8f6ff] border border-[#e2e4ed] rounded px-4 py-2 text-[#431363] w-full max-w-xs focus:outline-none focus:border-[#431363] shadow-sm text-sm"
              value={filters.global || ''}
              onChange={e => setFilters(f => ({ ...f, global: e.target.value }))}
            />
            <select
              className="bg-[#f8f6ff] border border-[#e2e4ed] rounded px-4 py-2 text-[#431363] w-full max-w-xs focus:outline-none focus:border-[#431363] shadow-sm text-sm appearance-none"
              value={sorts.global || ''}
              onChange={e => setSorts(s => ({ ...s, global: e.target.value }))}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        {/* Category Tabs Row */}
        {/* Category Filter Bar (buttons) restored */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2 items-center justify-center">
          <button
            className={`px-4 py-1 rounded-full font-semibold border border-[#e2e4ed] bg-white text-[#431363] hover:bg-[#ece7fa] transition ${selectedCategory === 'all' ? 'bg-[#ece7fa]' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`px-4 py-1 rounded-full font-semibold border border-[#e2e4ed] bg-white text-[#431363] hover:bg-[#ece7fa] transition ${selectedCategory === cat.id ? 'bg-[#ece7fa]' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="mr-1">{cat.icon}</span>{cat.title}
            </button>
          ))}
        </div>
        <div className="max-w-7xl mx-auto">
          {/* Flatten all products for display */}
          {(() => {
            let allProducts = categories.flatMap(cat => (cat.products || []).map(p => ({ ...p, category: cat.title, icon: cat.icon })));
            // Filter by selected category
            if (selectedCategory !== 'all') {
              allProducts = allProducts.filter(p => p.category === categories.find(cat => cat.id === selectedCategory)?.title);
            }
            const search = (filters.global || '').toLowerCase();
            if (search) {
              allProducts = allProducts.filter(p =>
                p.title.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search) ||
                p.tags.some(tag => tag.toLowerCase().includes(search))
              );
            }
            if (sorts.global === 'price-asc') {
              allProducts = [...allProducts].sort((a, b) => a.price - b.price);
            } else if (sorts.global === 'price-desc') {
              allProducts = [...allProducts].sort((a, b) => b.price - a.price);
            }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.length === 0 ? (
                  <div className="text-gray-400 italic">No products found.</div>
                ) : (
                  allProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg py-2 px-3 flex gap-2 items-center border border-[#e2e4ed] min-w-[180px] w-full">
                      <img src={product.image} alt={product.title} className="w-32 h-24 object-cover rounded-lg border" loading="lazy" />
                      <div className="flex-1">
                        <div className="font-bold text-base mb-1">{product.title}</div>
                        <div className="text-xs text-gray-500 mb-2">{product.description}</div>
                        <div className="text-[#431363] font-bold text-sm mb-1">${product.price}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.map(tag => (
                            <span key={tag} className="bg-[#ece7fa] text-[#431363] rounded px-2 py-0.5 text-xs">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Explore;
