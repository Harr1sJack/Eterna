import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { uploadFile } from '../utils/firebase';

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Form states
  const [form, setForm] = useState({
    name: '', email: '', dob: '', gender: '', bio: ''
  });
  const [profilePic, setProfilePic] = useState('/profile/default.png');
  const [selectedFileBase64, setSelectedFileBase64] = useState('');
  
  // Validation states
  const [nameError, setNameError] = useState('');
  
  // UI states
  const [isEditMode, setIsEditMode] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [productsView, setProductsView] = useState('grid');
  const [productsSortBy, setProductsSortBy] = useState('newest');
  const [productsFilter, setProductsFilter] = useState('all');
  const [isStatsAnimated, setIsStatsAnimated] = useState(false);
  const [tabSwitchingLoading, setTabSwitchingLoading] = useState(false);

  // Validation regex - same as AuthForm
  const nameRegex = /^[A-Za-z\s]+$/;

  // Validation function
  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (!nameRegex.test(name.trim())) return 'Name should contain only letters and spaces';
    if (name.trim().length < 2) return 'Name should be at least 2 characters long';
    return '';
  };

  // Unified form handler
  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Real-time name validation
    if (field === 'name' && isEditMode) {
      const error = validateName(value);
      setNameError(error);
    }
  };

  const handleNameBlur = () => {
    if (isEditMode) {
      const error = validateName(form.name);
      setNameError(error);
    }
  };

  useEffect(() => {
    if (!token) return;
  
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const data = res.data;
        setForm({
          name: data.name || '',
          email: data.email || '',
          dob: data.dob ? data.dob.slice(0, 10) : '',
          gender: data.gender || '',
          bio: data.bio || ''
        });
  
        const picUrl = data.firebaseProfilePic || data.profilePic || '';
        const isAbsoluteUrl = picUrl.startsWith('http://') || picUrl.startsWith('https://');

        setProfilePic(
          picUrl
            ? (isAbsoluteUrl ? picUrl : `${import.meta.env.VITE_SERVER_URL}/${picUrl}`)
            : '/profile/default.png'
        );
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
        setProfilePic('/profile/default.png');
      }
    };
  
    fetchProfile();
  }, [token]);  

  useEffect(() => {
    if (!token) return;

    const fetchUserProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/products/myproducts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching user products', err);
        toast.error('Failed to load your products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchUserProducts();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => setIsStatsAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 2MB');
      return;
    }
  
    setSelectedFileBase64(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setProfilePic(localPreviewUrl);
  };
  
  const handleSave = async () => {
    // Validate name before submission
    const nameValidationError = validateName(form.name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      toast.error('Please enter a valid name');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('dob', form.dob);
      formData.append('gender', form.gender);
      formData.append('bio', form.bio);
  
      if (selectedFileBase64) {
        try {
          const firebaseUrl = await uploadFile(selectedFileBase64, 'profiles');
          formData.append('firebaseProfileUrl', firebaseUrl);
          formData.append('profilePic', selectedFileBase64);
        } catch (error) {
          console.error('Firebase upload error:', error);
          toast.error('Failed to upload image');
          return;
        }
      }
  
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (res.data.profilePic) {
        const isFirebaseUrl = res.data.firebaseProfilePic || res.data.profilePic.startsWith('https://');
        setProfilePic(
          isFirebaseUrl 
            ? (res.data.firebaseProfilePic || res.data.profilePic)
            : `${import.meta.env.VITE_SERVER_URL}/${res.data.profilePic}`
        );
      }
  
      toast.success('Profile updated!');
      setIsEditMode(false);
      setNameError(''); // Clear validation error on successful save
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedFileBase64('');
    setNameError(''); // Clear validation errors
    if (selectedFileBase64) {
      setProfilePic(user?.profilePic ? `${import.meta.env.VITE_SERVER_URL}/${user.profilePic}` : '/profile/default.png');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...userProducts];
    
    if (productsFilter === 'approved') {
      filtered = filtered.filter(p => p.isApproved);
    } else if (productsFilter === 'pending') {
      filtered = filtered.filter(p => !p.isApproved);
    }
    
    filtered.sort((a, b) => {
      switch (productsSortBy) {
        case 'newest':
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        case 'oldest':
          return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getFilteredProductsCount = () => {
    const filtered = getFilteredAndSortedProducts();
    return {
      total: filtered.length,
      approved: filtered.filter(p => p.isApproved).length,
      pending: filtered.filter(p => !p.isApproved).length
    };
  };

  const handleTabSwitch = (tabId) => {
    if (tabId === activeTab) return;
    
    setTabSwitchingLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setTabSwitchingLoading(false);
    }, 150);
  };

  return (
    <div className="relative min-h-screen pt-24 py-10 px-4 flex flex-col items-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/assets/loginbk1.jpg')" }}>
      
      <div className="absolute inset-0 bg-gradient-to-b from-purple-100/70 to-pink-100/70 dark:from-purple-900/80 dark:to-gray-900/80 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/80 dark:bg-[#000000] shadow-lg rounded-xl p-8 w-full max-w-4xl">
        {/* Profile header with centered avatar */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="relative group">
              <img
                src={profilePic}
                alt="Profile"
                onError={e => { e.currentTarget.src = "/profile/default.png"; }}
                className="w-32 h-32 object-cover rounded-full border-4 border-purple-200 dark:border-purple-500 shadow-lg transition-all duration-300 group-hover:shadow-xl"
              />
              
              {isEditMode && (
                <>
                  <button
                    onClick={() => document.getElementById('upload-profile').click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                  <input
                    id="upload-profile"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePicChange}
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Profile info header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {form.name || 'Your Profile'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{form.email}</p>
            
            {form.bio && !isEditMode && (
              <div className="max-w-2xl mx-auto mt-4">
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#131313] px-4 py-3 rounded-lg italic">
                  "{form.bio}"
                </p>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
            {!isEditMode ? (
              <>
                <button
                  onClick={() => navigate('/post-product')}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="relative z-10">Post New Product</span>
                </button>
                
                <button
                  onClick={() => setIsEditMode(true)}
                  className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="relative z-10">Edit Profile</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={nameError}
                  className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 ${nameError ? 'opacity-60 cursor-not-allowed transform-none' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Save Changes</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="bg-white/50 dark:bg-[#131313]/50 backdrop-blur-sm rounded-2xl mb-8 overflow-hidden border border-gray-200/30 dark:border-gray-700/30">
          <div className="flex flex-wrap border-b border-gray-200/50 dark:border-gray-700/50">
            {[
              { id: 'overview', label: 'Overview', icon: '👤' },
              { id: 'products', label: `Products (${userProducts.length})`, icon: '📦' },
              { id: 'activity', label: 'Activity', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                disabled={tabSwitchingLoading}
                className={`flex-1 min-w-0 px-4 py-4 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                } ${tabSwitchingLoading ? 'pointer-events-none' : ''}`}
              >
                {tabSwitchingLoading && activeTab !== tab.id && (
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                )}
                <span className="text-lg relative z-10">{tab.icon}</span>
                <span className="hidden sm:inline truncate relative z-10">{tab.label}</span>
                <span className="sm:hidden truncate relative z-10">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] relative">
          {tabSwitchingLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading...</span>
              </div>
            </div>
          )}
          
          <div className={`transition-all duration-300 ${tabSwitchingLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Profile Details Display (when not editing) */}
                {!isEditMode && (
                  <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-[#131313] dark:to-purple-900/10 rounded-2xl p-8 mb-8 shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        Profile Information
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#000000] px-3 py-1 rounded-full shadow-sm">
                        Last updated: Today
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { field: 'name', label: 'Full Name', value: form.name || 'Not specified', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'purple' },
                        { field: 'email', label: 'Email', value: form.email, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'blue' },
                        { field: 'dob', label: 'Date of Birth', value: form.dob || 'Not specified', icon: 'M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-4z', color: 'green' },
                        { field: 'gender', label: 'Gender', value: form.gender || 'Not specified', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'pink' }
                      ].map(({ field, label, value, icon, color }) => (
                        <div key={field} className="bg-white dark:bg-[#000000] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-900/30 rounded-full flex items-center justify-center`}>
                              <svg className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                              </svg>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</span>
                              <p className="text-gray-800 dark:text-white font-semibold">{value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {form.bio && (
                        <div className="md:col-span-2 bg-white dark:bg-[#000000] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Bio</span>
                              <p className="text-gray-800 dark:text-white font-semibold mt-1">{form.bio}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Edit Form (when editing) */}
                {isEditMode && (
                  <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-2xl p-8 mb-8 border border-purple-200/30 dark:border-purple-700/30">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      Edit Your Profile
                    </h3>
                    
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name field with validation */}
                        <div className="space-y-2">
                          <label className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3">
                            <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            onBlur={handleNameBlur}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent dark:bg-[#000000] dark:text-white dark:placeholder-gray-400 transition-all duration-300 ${
                              nameError 
                                ? 'border-red-500 shadow-red-500/30 shadow-lg' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                            placeholder="Enter your full name"
                          />
                          {nameError && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                              {nameError}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3">
                            <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-4z" />
                              </svg>
                            </div>
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={form.dob}
                            onChange={(e) => handleFormChange('dob', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent dark:bg-[#000000] dark:text-white transition-all duration-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3">
                            <div className="w-5 h-5 bg-pink-100 dark:bg-pink-900/30 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            Gender
                          </label>
                          <select
                            value={form.gender}
                            onChange={(e) => handleFormChange('gender', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent dark:bg-[#000000] dark:text-white transition-all duration-300"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3">
                          <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          Short Bio
                        </label>
                        <textarea
                          value={form.bio}
                          onChange={(e) => handleFormChange('bio', e.target.value)}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent dark:bg-[#000000] dark:text-white dark:placeholder-gray-400 transition-all duration-300 resize-none"
                          placeholder="Tell others about yourself..."
                        ></textarea>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab - Keep existing implementation */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* ... existing products tab implementation ... */}
              </div>
            )}

            {/* Activity Tab - Keep existing implementation */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* ... existing activity tab implementation ... */}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/post-product')}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-bounce group relative overflow-hidden"
          title="Post New Product"
          style={{
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <svg className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Profile;
