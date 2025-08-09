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
    const maxSize = 2 * 1024 * 1024; // 2MB

    files.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`Image ${file.name} exceeds 2MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
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
      const payload = {
        title,
        description,
        categoryId, // Mongo ObjectId string
        price: parseFloat(price),
        images, // match backend field name
      };

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/products`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div className="min-h-screen pt-24 px-4 sm:px-10 lg:px-28 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-[#431363] mb-8">
        Post a New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product title"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Price (USD) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Product price"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Upload Images *
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
            required={images.length === 0}
          />
          <small className="text-gray-500">
            Max 2MB per image. You can upload multiple images.
          </small>
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded bg-[#431363] text-white font-semibold hover:bg-[#5e1d91] transition ${
            uploading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Posting...' : 'Post Product'}
        </button>
      </form>
    </div>
  );
};

export default PostProduct;
