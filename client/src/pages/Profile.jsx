import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState('/profile/default.png');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  // Fetch user details on mount
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
        // Set defaults
        setName(data.name || '');
        setEmail(data.email || '');
        setDob(data.dob ? data.dob.slice(0, 10) : '');
        setGender(data.gender || '');
        setBio(data.bio || '');
        setVehicleType(data.vehicleType || '');
        setProfilePic(data.profilePic || '/profile/default.png');

      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { name, dob, gender, bio, vehicleType, profilePic };

      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen pt-24 py-10 px-4 flex justify-center overflow-hidden">

      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md z-0"
        style={{ backgroundImage: "url('/assets/loginbk1.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/5 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
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
      </div>
    </div>
  );
};

export default Profile;
