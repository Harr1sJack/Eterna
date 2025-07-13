import React, { useState } from 'react';

const Profile = () => {
  const [profilePic, setProfilePic] = useState('/assets/default-avatar.png'); // Default picture
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div
  className="min-h-screen bg-cover bg-center py-10 px-4 flex justify-center"
  style={{ backgroundImage: "url('/assets/loginbk1.jpg')" }}
     >
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
              placeholder="you@example.com"
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

          <div>
            <label className="block text-gray-700">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Select Vehicle</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Auto">Auto</option>
              <option value="None">None</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-[#431363] text-white px-6 py-2 rounded-md hover:bg-[#5e1d91] transition"
            >
              Save Changes
            </button>
            <button
              type="button"
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
