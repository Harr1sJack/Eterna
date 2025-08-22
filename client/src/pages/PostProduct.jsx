import { useState } from "react";

export default function PostProduct() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
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
      <div className="relative bg-white/80 shadow-2xl rounded-2xl max-w-lg w-full p-8 border border-purple-200 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Post a Product ✨
        </h1>

        <form className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter product description"
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium">Price (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter price"
            />
          </div>

          {/* Creative Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
            <div className="flex items-center justify-center">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-40 h-40 rounded-full cursor-pointer border-2 border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 transition"
              >
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-purple-600 text-sm">+ Upload</span>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-[1.02] font-semibold"
          >
            Post Product 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
