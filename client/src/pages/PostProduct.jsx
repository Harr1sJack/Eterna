import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { useTheme } from '../context/ThemeContext';


/** Error Boundary Component **/
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
      <div className="p-6 bg-red-100 dark:bg-gray-900 dark:bg-opacity-90 text-red-700 dark:text-red-400 rounded max-w-xl mx-auto mt-8 text-center border dark:border-gray-700">
          Something went wrong. Please try again later.
      </div>
      );
    }
    return this.props.children;
  }
}

/** Utility to get cropped image blob **/
const getCroppedImg = (imageSrc, crop) =>
  new Promise(async (resolve, reject) => {
    const createImage = (url) =>
      new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = (e) => rej(e);
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = url;
      });

    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped.jpeg';
        resolve(blob);
      }, 'image/jpeg');
    } catch (e) {
      reject(e);
    }
  });

/** PostProduct Component **/
const PostProduct = () => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Form state
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);

  // Image states
  const [images, setImages] = useState([]);

  // Cropping modal states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropIndex, setCropIndex] = useState(0);
  const [orientation, setOrientation] = useState('landscape');
  const [stackHovered, setStackHovered] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Hold the files to crop
  const filesToCropRef = useRef([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // When images selected, start cropping first image
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 6) {
      toast.error('You can upload up to 6 images only.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`Image ${file.name} exceeds 5MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    filesToCropRef.current = validFiles;
    setCropIndex(0);
    setCropSrc(URL.createObjectURL(validFiles[0]));
    setCropModalOpen(true);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // After crop, save cropped image and move to next file or finish
  const handleCropComplete = async () => {
    try {
      const croppedBlob = await getCroppedImg(cropSrc, croppedAreaPixels);
      const croppedFile = new File(
        [croppedBlob],
        filesToCropRef.current[cropIndex].name,
        { type: 'image/jpeg' }
      );

      setImages((prev) => [...prev, croppedFile]);

      const nextCropIndex = cropIndex + 1;

      if (nextCropIndex < filesToCropRef.current.length) {
        URL.revokeObjectURL(cropSrc);
        const nextSrc = URL.createObjectURL(filesToCropRef.current[nextCropIndex]);
        setCropSrc(nextSrc);
        setCropIndex(nextCropIndex);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      } else {
        setCropModalOpen(false);
        URL.revokeObjectURL(cropSrc);
        filesToCropRef.current = [];
      }
    } catch {
      toast.error('Crop failed. Please try again.');
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission with cropped images
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
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId);
      formData.append('price', parseFloat(price));

      images.forEach((file) => {
        formData.append('productImage', file);
      });

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product posted successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post product');
    } finally {
      setUploading(false);
    }
  };

  const aspectRatio = orientation === 'landscape' ? 4 / 3 : 3 / 4;

  return (
  <ErrorBoundary>
    <>
      {/* Crop Modal */}
      {cropModalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-80 items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white dark:bg-[#131313] rounded-lg p-4 max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4 text-purple-800 dark:text-purple-300">
              Crop Image ({orientation})
            </h2>

            <div className="mb-4">
              <label className="mr-4 font-medium text-gray-700 dark:text-gray-300">Choose Orientation:</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>

            <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-600 rounded">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="btn btn-ghost text-black dark:text-white"
                onClick={() => {
                  setCropModalOpen(false);
                  filesToCropRef.current = [];
                  setCropSrc(null);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCropComplete}>
                Crop & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main upload form */}
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/assets/loginbk1.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100/70 to-pink-100/70 dark:from-purple-900/80 dark:to-gray-900/80 backdrop-blur-sm"></div>

        <div className="relative bg-white/80 dark:bg-[#000000] shadow-2xl rounded-2xl max-w-2xl w-full p-8 border border-purple-200 dark:border-purple-600 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-6 text-center">Post a Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium">Product Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium">Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter product description"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:border-gray-600 dark:text-white"
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
              <label className="block text-gray-700 dark:text-gray-300 font-medium">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter price"
                required
              />
            </div>

            {/* Image Upload with Hover Spread */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload Image</label>
              <div
                className="relative flex w-[600px] h-[140px] items-center justify-center"
                style={{ minWidth: '140px', minHeight: '140px' }}
                onMouseEnter={() => setStackHovered(true)}
                onMouseLeave={() => setStackHovered(false)}
              >
                {images.length === 0 && (
                  <label
                    htmlFor="file-upload"
                    className="absolute inset-0 flex items-center justify-center cursor-pointer border-2 border-dashed border-purple-400 dark:border-purple-500 rounded-lg transition text-purple-600 dark:text-purple-400 text-lg font-semibold"
                  >
                    + Upload
                  </label>
                )}

                {images.slice(0, 6).map((file, index) => {
                  const center = (images.length - 1) / 2;
                  const spread = 100;
                  const overlap = 32;
                  const x = stackHovered ? (index - center) * spread : (index - center) * overlap;
                  const previewURL = URL.createObjectURL(file);

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
                        style={{ padding: 0, lineHeight: 1 }}
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  multiple
                  required={images.length === 0}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transition transform hover:scale-[1.02] font-semibold"
              disabled={uploading}
            >
              {uploading ? 'Posting...' : 'Post Product '}
            </button>
          </form>
        </div>
      </div>
    </>
  </ErrorBoundary>
);

};

export default PostProduct;
