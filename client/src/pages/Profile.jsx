import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [profilePic, setProfilePic] = useState('/profile/default.png');
  const [selectedFileBase64, setSelectedFileBase64] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');

  // New state to hold user's posted products
  const [userProducts, setUserProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // State to control edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for tabbed content
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for products showcase enhancements
  const [productsView, setProductsView] = useState('grid'); // 'grid' or 'list'
  const [productsSortBy, setProductsSortBy] = useState('newest'); // 'newest', 'oldest', 'price-low', 'price-high', 'title'
  const [productsFilter, setProductsFilter] = useState('all'); // 'all', 'approved', 'pending'
  
  // State for interactive elements
  const [isStatsAnimated, setIsStatsAnimated] = useState(false);
  const [tabSwitchingLoading, setTabSwitchingLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
  
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = res.data;
        setName(data.name || '');
        setEmail(data.email || '');
        setDob(data.dob ? data.dob.slice(0, 10) : '');
        setGender(data.gender || '');
        setBio(data.bio || '');
  
        // Improved image URL detection logic
        let picUrl = (data.profilePic || '').trim();
        const isAbsoluteUrl = /^https?:\/\//i.test(picUrl);
  
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

  // Fetch user's posted products
  useEffect(() => {
    if (!token) return;

    const fetchUserProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/products/myproducts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // API returns { products: [...] }
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

  // Animation effect for stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStatsAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setSelectedFileBase64(file); // store the actual File object
    setProfilePic(URL.createObjectURL(file)); // preview immediately
  };  

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('bio', bio);

    if (selectedFileBase64) {
      formData.append('profilePic', selectedFileBase64);
    }

    try {
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

      // backend returns relative URL
      if (res.data.profilePic) {
        setProfilePic(`${import.meta.env.VITE_SERVER_URL}/${res.data.profilePic}`);
      }

      toast.success('Profile updated!');
      setIsEditMode(false); // Close edit mode after saving
      setSelectedFileBase64(''); // Clear selected file
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedFileBase64('');
    // Reset profile pic if there was a temporary change
    if (selectedFileBase64) {
      setProfilePic(user?.profilePic ? `${import.meta.env.VITE_SERVER_URL}/${user.profilePic}` : '/profile/default.png');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Enhanced products showcase functions
  const getFilteredAndSortedProducts = () => {
    let filtered = [...userProducts];
    
    // Apply filter
    if (productsFilter === 'approved') {
      filtered = filtered.filter(p => p.isApproved);
    } else if (productsFilter === 'pending') {
      filtered = filtered.filter(p => !p.isApproved);
    }
    
    // Apply sorting
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

  // Enhanced tab switching with loading state
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
              
              {/* Single edit button - only shows when in edit mode */}
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
              {name || 'Your Profile'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{email}</p>
            
            {bio && !isEditMode && (
              <div className="max-w-2xl mx-auto mt-4">
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#131313] px-4 py-3 rounded-lg italic">
                  "{bio}"
                </p>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
            {!isEditMode ? (
              <>
                {/* Primary Action - Post Product */}
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
                
                {/* Secondary Action - Edit Profile */}
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
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
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
              { id: 'activity', label: 'Activity', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
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
                    <div className="bg-white dark:bg-[#000000] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Full Name</span>
                          <p className="text-gray-800 dark:text-white font-semibold">{name || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#000000] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Email</span>
                          <p className="text-gray-800 dark:text-white font-semibold">{email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#000000] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-4z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Date of Birth</span>
                          <p className="text-gray-800 dark:text-white font-semibold">{dob || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#000000] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Gender</span>
                          <p className="text-gray-800 dark:text-white font-semibold">{gender || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {bio && (
                      <div className="md:col-span-2 bg-white dark:bg-[#000000] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Bio</span>
                            <p className="text-gray-800 dark:text-white font-semibold mt-1">{bio}</p>
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent dark:bg-[#000000] dark:text-white dark:placeholder-gray-400 transition-all duration-300"
                          placeholder="Enter your full name"
                        />
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
                          value={email}
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
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
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
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
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
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
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

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  Your Products
                </h3>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#000000] px-3 py-1 rounded-full shadow-sm">
                    {getFilteredProductsCount().total} of {userProducts.length} products
                  </div>
                </div>
              </div>

              {/* Products Controls */}
              {userProducts.length > 0 && (
                <div className="bg-white/50 dark:bg-[#000000]/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Filter and Sort Controls */}
                    <div className="flex flex-wrap gap-3">
                      {/* Filter Dropdown */}
                      <div className="relative">
                        <select
                          value={productsFilter}
                          onChange={(e) => setProductsFilter(e.target.value)}
                          className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        >
                          <option value="all">All Products</option>
                          <option value="approved">Approved Only</option>
                          <option value="pending">Pending Only</option>
                        </select>
                      </div>

                      {/* Sort Dropdown */}
                      <div className="relative">
                        <select
                          value={productsSortBy}
                          onChange={(e) => setProductsSortBy(e.target.value)}
                          className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="title">Title A-Z</option>
                        </select>
                      </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#131313] rounded-lg p-1">
                      <button
                        onClick={() => setProductsView('grid')}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          productsView === 'grid'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                        }`}
                        title="Grid View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setProductsView('list')}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          productsView === 'list'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                        }`}
                        title="List View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loadingProducts ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="text-gray-600 dark:text-gray-400 ml-3">Loading your products...</p>
                </div>
              ) : userProducts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#131313] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Products Yet</h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">You haven't posted any products yet. Start selling by creating your first product listing!</p>
                  <button
                    onClick={() => navigate('/post-product')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="font-medium">Post Your First Product</span>
                  </button>
                </div>
              ) : getFilteredAndSortedProducts().length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#131313] rounded-2xl border border-gray-300 dark:border-gray-600">
                  <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Products Match Filter</h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filter or sort options to see more products.</p>
                  <button
                    onClick={() => {setProductsFilter('all'); setProductsSortBy('newest');}}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={
                  productsView === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {getFilteredAndSortedProducts().map((product) => (
                    productsView === 'grid' ? (
                      <div
                        key={product._id}
                        className="bg-white dark:bg-[#000000] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="relative">
                          <img
                            src={`${import.meta.env.VITE_SERVER_URL}/${product.images[0]}` || '/assets/default-product.jpg'}
                            alt={product.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            product.isApproved 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              product.isApproved ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            {product.isApproved ? 'Approved' : 'Pending'}
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <h4 className="font-bold text-lg text-[#431363] dark:text-purple-300 mb-2 line-clamp-1">
                            {product.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              ${product.price}
                            </p>
                            <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors">
                              View Details
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={product._id}
                        className="bg-white dark:bg-[#000000] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-48 sm:flex-shrink-0">
                            <img
                              src={`${import.meta.env.VITE_SERVER_URL}/${product.images[0]}` || '/assets/default-product.jpg'}
                              alt={product.title}
                              className="w-full h-48 sm:h-full object-cover"
                            />
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              product.isApproved 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                product.isApproved ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></div>
                              {product.isApproved ? 'Approved' : 'Pending'}
                            </div>
                          </div>
                          
                          <div className="flex-1 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                              <h4 className="font-bold text-xl text-[#431363] dark:text-purple-300 mb-2 sm:mb-0">
                                {product.title}
                              </h4>
                              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                ${product.price}
                              </p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Created: {new Date(product.createdAt || Date.now()).toLocaleDateString()}
                              </div>
                              <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2 transition-colors">
                                View Details
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Activity Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Products Stats */}
                <div className="bg-white dark:bg-[#000000] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold text-purple-600 dark:text-purple-400 transition-all duration-1000 transform ${
                        isStatsAnimated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}>
                        <span className="inline-block animate-pulse">
                          {userProducts.length}
                        </span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Total Products</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#000000] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-1000 transform delay-200 ${
                        isStatsAnimated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}>
                        <span className="inline-block animate-pulse">
                          {userProducts.filter(p => p.isApproved).length}
                        </span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Active Products</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#000000] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold text-yellow-600 dark:text-yellow-400 transition-all duration-1000 transform delay-500 ${
                        isStatsAnimated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}>
                        <span className="inline-block animate-pulse">
                          {userProducts.filter(p => !p.isApproved).length}
                        </span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Account Settings
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#000000] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Profile Management</h4>
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit Profile Information</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/post-product')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Post New Product</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#000000] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Account Actions</h4>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
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