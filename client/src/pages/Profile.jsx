import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

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
        setProfilePic(
          data.profilePic
            ? `${import.meta.env.VITE_SERVER_URL}/${data.profilePic}`
            : '/profile/default.png'
        );
      
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
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
      formData.append('profilePic', selectedFileBase64); // File object
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

    // backend returns relative URL
    if (res.data.profilePic) {
      setProfilePic(`${import.meta.env.VITE_SERVER_URL}/${res.data.profilePic}`);
    }

    toast.success('Profile updated!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen pt-24 py-10 px-4 flex flex-col items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md z-0"
        style={{ backgroundImage: "url('/assets/loginbk1.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/5 z-0"></div>

      <div className="relative z-10 bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
        {/* Profile header and form */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full border-4 border-purple-200"
            />
            <label
              htmlFor="upload-profile"
              className="absolute bottom-0 right-0 bg-purple-600 text-white px-2 py-1 text-xs rounded-full cursor-pointer hover:bg-purple-700"
            >
              Edit
            </label>
            <input
              id="upload-profile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePicChange}
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#431363]">Your Profile</h2>
            <p className="text-gray-500">Edit your details below</p>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
              placeholder="Tell others about yourself..."
            ></textarea>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#431363] text-white px-6 py-2 rounded-md hover:bg-[#5e1d91] transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </form>
        
        <hr className="my-10 border-t-2 border-purple-300" />

        {/* User's posted products */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-[#431363] mb-4">Your Posted Products</h3>

          {loadingProducts ? (
            <p>Loading your products...</p>
          ) : userProducts.length === 0 ? (
            <p className="text-gray-500 italic">You have not posted any products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md border border-[#e2e4ed] p-4 flex gap-4"
                >
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/${product.images[0]}` || '/assets/default-product.jpg'}
                    alt={product.title}
                    className="w-24 h-20 object-cover rounded"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-[#431363]">{product.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                      <p className="mt-1 text-[#431363] font-semibold">${product.price}</p>
                    </div>
                    <p className="text-xs mt-2 text-gray-500">
                      Status:{' '}
                      <span className={product.isApproved ? 'text-green-600' : 'text-yellow-600'}>
                        {product.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Product button */}
        <div className="mt-10">
          <button
            onClick={() => navigate('/post-product')}
            className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
          >
            Post Product
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
