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

export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false })
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
    const { title, description, categoryId, price, firebaseUrls } = req.body;
    const sellerId = req.user.id;

    if (!title || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Handle both Firebase URLs and server uploads
    const imagePaths = req.files?.map(file =>
      file.path.replace(/\\/g, '/').replace(/^.*uploads\//, 'uploads/')
    ) || [];

    const product = new Product({
      title,
      description,
      categoryId,
      price,
      images: imagePaths, // Server paths
      firebaseUrls: JSON.parse(firebaseUrls || '[]'), // Firebase URLs
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
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const products = await Product.find({ 
      categoryId: categoryId,
      isApproved: true 
    })
      .populate('sellerId', 'name profilePic')
      .populate('categoryId', 'title')
      .sort({ createdAt: -1 })
      .exec();

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
