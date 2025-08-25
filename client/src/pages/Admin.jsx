import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";
import Toggle from "../components/Toggle.jsx"; // ✅ Import the dynamic toggle

const Admin = () => {
  const [pending, setPending] = useState([]);
  const [existing, setExisting] = useState([]);
  const [selected, setSelected] = useState("New Requests");

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (selected === "New Requests") {
      fetchPending();
    } else {
      fetchExisting();
    }
  }, [selected]);

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/pending`);
      setPending(res.data);
    } catch (error) {
      console.error("Error fetching pending products", error);
    }
  };

  const fetchExisting = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/approved`);
      setExisting(res.data);
    } catch (error) {
      console.error("Error fetching existing products", error);
    }
  };

  const approveProduct = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/products/approve/${id}`);
      fetchPending();
    } catch (error) {
      console.error("Error approving product", error);
    }
  };

  const rejectProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/reject/${id}`);
      // refresh both depending on current view
      if (selected === "New Requests") {
        fetchPending();
      } else {
        fetchExisting();
      }
    } catch (error) {
      console.error("Error rejecting product", error);
    }
  };

  // ✅ Conditional rendering using if/else
  let content;
  if (selected === "New Requests") {
    content = (
      <>
        <h2 className="text-xl font-bold mb-4">Pending Product Approvals</h2>
        {pending.length === 0 ? (
          <p>No pending products 🎉</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((p) => (
              <div key={p._id} className="border rounded-lg p-3 shadow-sm">
                <ProductCard product={p} />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => approveProduct(p._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => rejectProduct(p._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  } else {
    content = (
      <>
        <h2 className="text-xl font-bold mb-4">Existing Products</h2>
        {existing.length === 0 ? (
          <p>No products available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existing.map((p) => (
              <div key={p._id} className="border rounded-lg p-3 shadow-sm">
                <ProductCard product={p} />
                {/* ✅ Delete button for existing products */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => rejectProduct(p._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="p-4">
      {/* ✅ Toggle at top center */}
      <div className="flex justify-center mb-6">
        <Toggle
          options={["New Requests", "Existing Products"]}
          onChange={(val) => setSelected(val)}
        />
      </div>

      {/* ✅ Render the conditional block */}
      {content}
    </div>
  );
};

export default Admin;
