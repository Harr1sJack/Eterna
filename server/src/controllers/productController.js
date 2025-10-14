import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name');
    console.log(products);
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
    console.log('Creating product - Body:', req.body);
    console.log('Creating product - Files:', req.files ? req.files.length : 0);

    const { title, description, categoryId, price, firebaseUrls } = req.body;
    
    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const sellerId = req.user.id;

    // Validate required fields
    if (!title || !description || !price || !categoryId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: {
          title: !title,
          description: !description,
          price: !price,
          categoryId: !categoryId
        }
      });
    }

    // Parse Firebase URLs safely
    let parsedFirebaseUrls = [];
    if (firebaseUrls) {
      try {
        if (typeof firebaseUrls === 'string') {
          parsedFirebaseUrls = JSON.parse(firebaseUrls);
        } else if (Array.isArray(firebaseUrls)) {
          parsedFirebaseUrls = firebaseUrls;
        }
        
        // Ensure it's an array of strings
        if (!Array.isArray(parsedFirebaseUrls)) {
          parsedFirebaseUrls = [];
        }
      } catch (error) {
        console.error('Error parsing Firebase URLs:', error);
        parsedFirebaseUrls = [];
      }
    }

    // Handle multer files (optional - only if files were uploaded)
    const imagePaths = req.files && req.files.length > 0 
      ? req.files.map(file => file.path.replace(/\\/g, '/').replace(/^.*uploads\//, 'uploads/'))
      : [];

    // For Firebase-only approach, we prioritize Firebase URLs
    // But still keep multer logic for backward compatibility
    let finalImages = [];
    let finalFirebaseUrls = parsedFirebaseUrls;

    // If Firebase URLs exist, use them as primary
    if (parsedFirebaseUrls.length > 0) {
      finalImages = imagePaths; // Keep multer paths as backup
      finalFirebaseUrls = parsedFirebaseUrls;
      console.log('Using Firebase URLs as primary image source');
    } 
    // If no Firebase URLs but multer files exist, use multer
    else if (imagePaths.length > 0) {
      finalImages = imagePaths;
      finalFirebaseUrls = [];
      console.log('Using multer files as image source');
    } 
    // No images at all
    else {
      return res.status(400).json({ 
        message: 'At least one image is required',
        received: {
          firebaseUrls: parsedFirebaseUrls.length,
          uploadedFiles: imagePaths.length
        }
      });
    }

    // Validate price
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ 
        message: 'Valid price required (must be 0 or greater)',
        received: price
      });
    }

    // Create product
    const product = new Product({
      title: title.trim(),
      description: description.trim(),
      categoryId,
      price: numericPrice,
      images: finalImages,
      firebaseUrls: finalFirebaseUrls,
      sellerId,
      isApproved: false
    });

    const savedProduct = await product.save();
    
    console.log('Product created successfully:', {
      id: savedProduct._id,
      firebaseUrls: savedProduct.firebaseUrls.length,
      serverImages: savedProduct.images.length,
      primarySource: finalFirebaseUrls.length > 0 ? 'Firebase' : 'Server'
    });

    res.status(201).json({ 
      message: 'Product created, pending approval', 
      product: savedProduct 
    });

  } catch (error) {
    console.error('Error creating product:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      body: req.body,
      filesCount: req.files ? req.files.length : 0
    });

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: validationErrors 
      });
    }

    res.status(500).json({ 
      message: 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message 
      })
    });
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
