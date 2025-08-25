import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const Admin = () => {
  const [pending, setPending] = useState([]);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/pending`);
      setPending(res.data);
    } catch (error) {
      console.error("Error fetching pending products", error);
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
      fetchPending();
    } catch (error) {
      console.error("Error rejecting product", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Product Approvals</h2>
      {pending.length === 0 ? (
        <p>No pending products 🎉</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pending.map((p) => (
            <div key={p._id} className="border rounded-lg p-3 shadow-sm">
              {/* ✅ Reuse ProductCard */}
              <ProductCard product={p} />

              {/* Approve / Reject buttons */}
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
    </div>
  );
};

export default Admin;
