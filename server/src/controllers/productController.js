import Product from '../models/Product.js';  

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name');
    console.log(products)
    res.status(201).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('sellerId', 'name profilePic')
      .populate('categoryId', 'title');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true })
      .populate('sellerId', 'name profilePic')
      .populate('categoryId', 'title')
      .sort({ createdAt: -1 })
      .exec();

    res.json(products);
  } catch (error) {
    console.error('Error fetching approved products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;

    const filter = { isApproved: true };

    if (category && category !== 'all') {
      filter.categoryId = category;
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
    const { title, description, categoryId, price } = req.body;
    const sellerId = req.user.id;

    if (!title || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // multer puts uploaded files in req.files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one product image is required' });
    }

    // Store relative paths so they can be accessed via /uploads/product/...
    const imagePaths = req.files.map(file =>
      file.path.replace(/\\/g, '/').replace(/^.*uploads\//, 'uploads/')
    );

    const product = new Product({
      title,
      description,
      categoryId,
      price,
      images: imagePaths,
      sellerId,
      isApproved: false
    });

    await product.save();

    res.status(201).json({ message: 'Product created, pending approval', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};