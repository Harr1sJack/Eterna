import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostProduct = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  // For image stack hover effect
  const [stackHovered, setStackHovered] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load categories');
      });
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    files.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`Image ${file.name} exceeds 5MB size limit.`);
        return;
      }
      setImages((prev) => [...prev, file]);
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      toast.error('You must be logged in to post products');
      return;
    }
    if (!title || !description || !categoryId || !price) {
      toast.error('Please fill all required fields');
      return;
    }
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
  
    setUploading(true);
    try {
      // Use FormData to send files
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId);
      formData.append('price', parseFloat(price));
  
      images.forEach((file) => {
        formData.append('productImage', file); // must match your backend multer field name
      });
  
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      toast.success('Product posted successfully!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to post product');
    } finally {
      setUploading(false);
    }
  };  

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/assets/loginbk1.jpg')",
      }}
    >
      {/* Overlay Gradient Blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-100/70 to-pink-100/70 backdrop-blur-sm"></div>

      {/* Form Container */}
  <div className="relative bg-white/80 shadow-2xl rounded-2xl max-w-2xl w-full p-8 border border-purple-200 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Post a Product ✨
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter product description"
              required
            ></textarea>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium">Price (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter price"
              required
            />
          </div>

          {/* Creative Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
            <div className="flex items-center justify-center">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-[140px] h-[140px] cursor-pointer border-2 border-dashed border-purple-400 rounded-lg transition"
              >
                <div
                  className="relative flex group w-[140px] h-[140px] items-center justify-center"
                  onMouseEnter={() => setStackHovered(true)}
                  onMouseLeave={() => setStackHovered(false)}
                  style={{ minWidth: '140px', minHeight: '140px' }}
                >
                  {images.length === 0 && (
                    <span className="absolute inset-0 flex items-center justify-center text-purple-600 text-lg font-semibold pointer-events-none select-none">+ Upload</span>
                  )}
                  {images.slice(0, 6).map((file, index) => {
                    const previewURL = URL.createObjectURL(file);
                    const spread = 100;
                    const overlap = 32;
                    const center = (images.length - 1) / 2;
                    const x = stackHovered ? (index - center) * spread : (index - center) * overlap;
                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          width: '120px',
                          height: '120px',
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) translateX(${x}px)`,
                          zIndex: images.length - index,
                          transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                        }}
                      >
                        <img
                          src={previewURL}
                          alt={`img-${index}`}
                          className="w-full h-full object-contain rounded-xl shadow-lg border-2 border-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-700"
                          title="Remove image"
                          style={{padding: 0, lineHeight: 1}}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      if (images.length + files.length > 6) {
                        toast.error('You can upload up to 6 images only.');
                        return;
                      }
                      handleImageChange(e);
                    }}
                    multiple
                    required={images.length === 0}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-[1.02] font-semibold"
            disabled={uploading}
          >
            {uploading ? 'Posting...' : 'Post Product 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;