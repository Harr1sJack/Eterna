// seedCategories.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Category from './models/Category.js';

dotenv.config();

function imageToBase64(relativePath) {
  const imagePath = path.join(process.cwd(), relativePath);
  const image = fs.readFileSync(imagePath);
  return `data:image/${path.extname(imagePath).slice(1)};base64,${image.toString('base64')}`;
}

const categories = [
    {
      title: 'Antiques & Collectibles',
      description: 'Old furniture, coins, stamps, and memorabilia.',
      image: imageToBase64('/assets/antique.jpg'),
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
      image: imageToBase64('/assets/art.avif'),
      keywords: [
        'paintings', 'sculptures', 'canvas', 'drawings', 'wall art', 'modern art', 'fine art', 'sketches',
        'home decor', 'framed art', 'gallery pieces', 'handmade', 'minimalist decor', 'abstract', 'portraits',
        'mural', 'watercolor', 'artwork', 'interior pieces', 'decorative items', 'art exhibition', 'home vibe'
      ]
    },
    {
      title: 'Watches & Jewelry',
      description: 'Luxury watches, vintage rings, and designer pieces.',
      image: imageToBase64('/assets/watch.jpg'),
      keywords: [
        'watches', 'rings', 'bracelets', 'vintage jewelry', 'gold', 'silver', 'diamond', 'luxury watches',
        'earrings', 'designer sets', 'necklaces', 'jewelry box', 'timeless', 'chronograph', "men's watches",
        "women's jewelry", 'pendant', 'brooch', 'timepiece', 'jewelry design', 'heritage jewelry', 'rare gems'
      ]
    },
    {
      title: 'Limited Edition Vehicles',
      description: 'Rare cars, classics, and concept models.',
      image: imageToBase64('/assets/car.jpg'),
      keywords: [
        'limited edition cars', 'rare vehicles', 'sports car', 'classic car', 'vintage bike', 'concept vehicle',
        'luxury SUV', 'supercar', 'custom cars', 'restored jeep', 'motorcycle', 'collector car', 'hot rod',
        'performance cars', 'race cars', 'rare scooters', 'retro cars', '4x4', 'heritage bikes', 'showroom exclusives'
      ]
    },
    {
      title: 'Rare Books & Manuscripts',
      description: 'First editions, signed books, and ancient texts.',
      image: imageToBase64('/assets/books.jpg'),
      keywords: [
        'rare books', 'signed books', 'manuscripts', 'first edition', 'literature', 'ancient texts',
        'collector books', 'handwritten notes', 'scrolls', 'old dictionaries', 'archives', 'poetry books',
        'limited prints', 'classic novels', 'library collections', 'bibliophile', 'paperbacks', 'historic documents'
      ]
    },
    {
      title: 'Vintage Electronics & Tech',
      description: 'Retro gadgets, film cameras, and consoles.',
      image: imageToBase64('/assets/Electronics.jpg'),
      keywords: [
        'retro tech', 'vintage electronics', 'film camera', 'cassette', 'walkman', 'typewriter', 'game console',
        'floppy disk', 'CRT', 'joystick', 'handheld games', 'vintage TV', 'old radios', 'reel player',
        'record player', 'retro gadgets', 'classic phones', '8-bit console', 'tech memorabilia'
      ]
    },
    {
      title: 'Limited Edition Fashion & Accessories',
      description: 'Sneakers, designer bags, and exclusive clothing.',
      image: imageToBase64('/assets/fashion.jpg'),
      keywords: [
        'fashion', 'sneakers', 'kurta', 'bags', 'designer bags', 'accessories', 'caps', 'watches', 'jewelry',
        'shoes', 'streetwear', 'exclusive clothing', 'luxury fashion', 'scarves', 'jackets', 'coats', 'heels',
        'menswear', 'womenswear', 'handbags', 'hoodies', 'rare outfits', 'limited series fashion'
      ]
    },
    {
      title: 'Toys & Games',
      description: 'Collector toys, trading cards, and LEGO sets.',
      image: imageToBase64('/assets/toys.jpg'),
      keywords: [
        'toys', 'action figures', 'lego', 'trading cards', 'board games', 'puzzles', 'collector toys', 'vintage toys',
        'toy cars', 'playsets', 'classic toys', 'game figurines', 'dolls', 'limited edition toys', 'miniatures',
        'model kits', 'plushies', 'arcade games', 'pop culture toys'
      ]
    },
    {
      title: 'Music & Instruments',
      description: 'Guitars, signed vinyls, and music gear.',
      image: imageToBase64('/assets/music.jpg'),
      keywords: [
        'guitars', 'vinyls', 'signed albums', 'music gear', 'instruments', 'keyboards', 'amplifiers', 'drums',
        'microphones', 'rare music', 'music memorabilia', 'vintage instruments', 'record players', 'speakers',
        'mixers', 'DJ gear', 'signed music', 'classic albums', 'collectible music'
      ]
    },
    {
      title: 'Film & Pop Culture Memorabilia',
      description: 'Props, posters, autographs, and comics.',
      image: imageToBase64('/assets/film.jpg'),
      keywords: [
        'movie props', 'autographs', 'film posters', 'comics', 'pop culture', 'signed scripts', 'costumes',
        'figurines', 'celebrity memorabilia', 'fan collectibles', 'limited movie editions', 'franchise items',
        'superhero', 'film relics', 'TV show merchandise', 'action comics', 'movie collectibles'
      ]
    },
    {
      title: 'Tech & Innovations (New Exclusives)',
      description: 'AI gadgets, early tech, and new inventions.',
      image: imageToBase64('/assets/tech.jpg'),
      keywords: [
        'AI gadgets', 'robotics', 'early tech', 'startups', 'exclusive tech', 'prototypes', 'innovation',
        'wearables', 'IoT devices', 'smart gear', 'concept tech', 'experimental', 'new launch', 'modern tech',
        'tech showcase', 'future gadgets'
      ]
    },
    {
      title: 'Designer Furniture & Interior',
      description: 'Modern furniture, lights, and carpentry art.',
      image: imageToBase64('/assets/interior.jpg'),
      keywords: [
        'furniture', 'interior design', 'sofa', 'table', 'chairs', 'designer lights', 'shelves', 'woodwork',
        'interior pieces', 'carpentry', 'decor items', 'handcrafted', 'modern home', 'interior styling',
        'custom furniture', 'functional art', 'home design', 'modular furniture'
      ]
    },
    {
      title: 'Historical & Cultural Artifacts',
      description: 'Tribal art, idols, relics, and textiles.',
      image: imageToBase64('/assets/culture.jpg'),
      keywords: [
        'tribal art', 'cultural artifacts', 'ancient idols', 'heritage relics', 'traditional clothing',
        'textiles', 'ethnic crafts', 'ritual objects', 'historic decor', 'tribal sculptures', 'folklore items',
        'regional antiques', 'museum pieces', 'cultural heritage', 'ancient culture'
      ]
    },
    {
      title: 'Scientific & Industrial Rarities',
      description: 'Lab gear, prototypes, and machines.',
      image: imageToBase64('/assets/science.jpg'),
      keywords: [
        'scientific equipment', 'lab tools', 'industrial machines', 'rare gadgets', 'scientific instruments',
        'microscope', 'telescope', 'engineering prototypes', 'mechanical models', 'machinery', 'research tools',
        'vintage science', 'calibration instruments', 'gears', 'invention relics'
      ]
    },
    {
      title: 'Other / Miscellaneous',
      description: 'Unique and uncategorized collector items.',
      image: imageToBase64('/assets/other.jpg'),
      keywords: [
        'miscellaneous', 'unique items', 'weird collectibles', 'unusual', 'rare finds', 'surprise items',
        'mixed category', 'oddities', 'uncategorized', 'special editions', 'unknown relics'
      ]
    },
  ];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Category.deleteMany({});
    console.log("Old categories removed");

    await Category.insertMany(categories);
    console.log("Categories inserted successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
