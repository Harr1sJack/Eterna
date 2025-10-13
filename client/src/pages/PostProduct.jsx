import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { useTheme } from '../context/ThemeContext';
import { uploadMultipleFiles } from '../utils/firebase';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? 
      <div className="p-6 bg-red-100 dark:bg-gray-900 text-red-700 dark:text-red-400 rounded max-w-xl mx-auto mt-8 text-center">
        Something went wrong. Please try again later.
      </div> : this.props.children;
  }
}

const getCroppedImg = (imageSrc, crop) => new Promise(async (resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    canvas.toBlob(blob => blob ? resolve(Object.assign(blob, {name: 'cropped.jpeg'})) : reject(new Error('Canvas empty')), 'image/jpeg');
  };
  img.onerror = reject;
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = imageSrc;
});

const PostProduct = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '', price: '' });
  const [titleError, setTitleError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropIndex, setCropIndex] = useState(0);
  const [orientation, setOrientation] = useState('landscape');
  const [stackHovered, setStackHovered] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const filesToCropRef = useRef([]);

  const validateTitle = (title) => {
    if (!title?.trim()) return 'Title required';
    const t = title.trim();
    if (t.length < 3) return 'Min 3 characters';
    if (t.length > 50) return 'Max 50 characters';
    const letters = (t.match(/[a-zA-Z]/g) || []).length;
    const numbers = (t.match(/[0-9]/g) || []).length;
    const specials = (t.match(/[^a-zA-Z0-9\s]/g) || []).length;
    if (!letters) return 'Must contain letters';
    if (!letters && (numbers || specials)) return 'Cannot be only numbers/symbols';
    if (numbers > 2) return 'Max 2 numbers';
    if (specials > 2) return 'Max 2 special chars';
    if (!/^[a-zA-Z0-9\s\-_.,'!&()]+$/.test(t)) return 'Invalid characters';
    return '';
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'title') setTitleError(validateTitle(value));
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) return toast.error('Max 6 images');
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024 || (toast.error(`${file.name} too large`), false));
    if (!validFiles.length) return;
    filesToCropRef.current = validFiles;
    setCropIndex(0);
    setCropSrc(URL.createObjectURL(validFiles[0]));
    setCropModalOpen(true);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels), []);

  const handleCropComplete = async () => {
    try {
      const blob = await getCroppedImg(cropSrc, croppedAreaPixels);
      const file = new File([blob], filesToCropRef.current[cropIndex].name, { type: 'image/jpeg' });
      setImages(prev => [...prev, file]);
      const next = cropIndex + 1;
      if (next < filesToCropRef.current.length) {
        URL.revokeObjectURL(cropSrc);
        setCropSrc(URL.createObjectURL(filesToCropRef.current[next]));
        setCropIndex(next);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      } else {
        setCropModalOpen(false);
        URL.revokeObjectURL(cropSrc);
        filesToCropRef.current = [];
      }
    } catch { toast.error('Crop failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Login required');
    const titleErr = validateTitle(form.title);
    if (titleErr) return setTitleError(titleErr), toast.error('Fix title');
    if (!form.description || !form.categoryId || !form.price) return toast.error('Fill all fields');
    if (!images.length) return toast.error('Add at least one image');

    setUploading(true);
    try {
      const firebaseUrls = await uploadMultipleFiles(images, 'products');
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('price', parseFloat(form.price));
      formData.append('firebaseUrls', JSON.stringify(firebaseUrls));
      images.forEach(file => formData.append('productImage', file));

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/products`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Product posted successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post product');
    } finally {
      setUploading(false);
    }
  };

  const aspectRatio = orientation === 'landscape' ? 4/3 : 3/4;

  return (
    <ErrorBoundary>
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-80 items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131313] rounded-lg p-4 max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4 text-purple-800 dark:text-purple-300">Crop Image ({orientation})</h2>
            <div className="mb-4">
              <label className="mr-4 font-medium text-gray-700 dark:text-gray-300">Orientation:</label>
              <select value={orientation} onChange={(e) => setOrientation(e.target.value)} 
                className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
            <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-600 rounded">
              <Cropper image={cropSrc} crop={crop} zoom={zoom} aspect={aspectRatio}
                onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button className="btn btn-ghost text-black dark:text-white" 
                onClick={() => { setCropModalOpen(false); filesToCropRef.current = []; setCropSrc(null); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCropComplete}>Crop & Continue</button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/assets/loginbk1.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100/70 to-pink-100/70 dark:from-purple-900/80 dark:to-gray-900/80 backdrop-blur-sm"></div>
        
        <div className="relative bg-white/80 dark:bg-[#000000] shadow-2xl rounded-2xl max-w-2xl w-full p-8 border border-purple-200 dark:border-purple-600 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-6 text-center">Post a Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Product Name *</label>
              <input type="text" value={form.title} onChange={(e) => handleFormChange('title', e.target.value)}
                onBlur={() => setTitleError(validateTitle(form.title))} maxLength={50} disabled={uploading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:text-white dark:placeholder-gray-400 ${
                  titleError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Enter product name" />
              {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Description *</label>
              <textarea rows="4" value={form.description} onChange={(e) => handleFormChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:text-white dark:placeholder-gray-400"
                placeholder="Enter product description" disabled={uploading} required />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Category *</label>
              <select value={form.categoryId} onChange={(e) => handleFormChange('categoryId', e.target.value)} disabled={uploading} required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:text-white">
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Price (₹) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => handleFormChange('price', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-[#000000] dark:text-white dark:placeholder-gray-400"
                placeholder="Enter price" disabled={uploading} required />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload Images *</label>
              <div className="relative flex w-full h-[140px] items-center justify-center"
                onMouseEnter={() => setStackHovered(true)} onMouseLeave={() => setStackHovered(false)}>
                {!images.length && (
                  <label htmlFor="file-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer border-2 border-dashed border-purple-400 dark:border-purple-500 rounded-lg text-purple-600 dark:text-purple-400 text-lg font-semibold">
                    + Upload Images
                  </label>
                )}
                {images.slice(0, 6).map((file, index) => {
                  const center = (images.length - 1) / 2;
                  const x = stackHovered ? (index - center) * 100 : (index - center) * 32;
                  return (
                    <div key={index} className="absolute" style={{
                      width: '120px', height: '120px', left: '50%', top: '50%',
                      transform: `translate(-50%, -50%) translateX(${x}px)`,
                      zIndex: images.length - index,
                      transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)'
                    }}>
                      <img src={URL.createObjectURL(file)} alt={`img-${index}`}
                        className="w-full h-full object-contain rounded-xl shadow-lg border-2 border-white" />
                      <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                        disabled={uploading}>×</button>
                    </div>
                  );
                })}
                <input id="file-upload" type="file" accept="image/*" multiple disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange} required={!images.length} />
              </div>
            </div>

            <button type="submit" disabled={uploading || titleError}
              className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition-all ${
                uploading || titleError ? 'bg-gray-400 cursor-not-allowed' : 
                'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transform hover:scale-[1.02]'}`}>
              {uploading ? 'Posting...' : 'Post Product'}
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PostProduct;
