import Product from '../models/Product.js';  

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;

    const filter = { isApproved: true };

    if (category && category !== 'all') {
      filter.categoryId = category; // fixed to match your schema
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('sellerId', 'name profilePic')
      .exec();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: Number(page),
      pageSize: Number(limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id; 

    const products = await Product.find({ sellerId })
      .sort({ createdAt: -1 })
      .populate('categoryId', 'name')
      .exec();

    res.json({ products });
  } catch (error) {
    console.error('Error fetching my products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { title, description, categoryId, price, images } = req.body;
    const sellerId = req.user.id;

    if (!title || !description || !price || !sellerId || !categoryId || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const isValidBase64 = (str) => /^data:image\/[a-zA-Z]+;base64,/.test(str);
    if (!images.every(isValidBase64)) {
      return res.status(400).json({ message: 'One or more images are not valid Base64 strings' });
    }

    const product = new Product({
      title,
      description,
      categoryId,
      price,
      images, 
      sellerId,
      isApproved: false,
    });

    await product.save();

    res.status(201).json({ message: 'Product created, pending approval', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};