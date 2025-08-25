import Product from "../models/Product.js";

/**
 * Get all unapproved products
 */
export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false })
      .populate("categoryId", "title icon")
      .populate("sellerId", "name email");
    res.json(products);
  } catch (error) {
    console.error("Error fetching pending products:", error);
    res.status(500).json({ error: "Failed to fetch pending products" });
  }
};

/**
 * Approve a single product
 */
export const approveProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error approving product:", error);
    res.status(500).json({ error: "Failed to approve product" });
  }
};

/**
 * Reject (delete) a single product
 */
export const rejectProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product rejected and removed" });
  } catch (error) {
    console.error("Error rejecting product:", error);
    res.status(500).json({ error: "Failed to reject product" });
  }
};

/**
 * Bulk Approve All pending products
 */
export const approveAllProducts = async (req, res) => {
  try {
    const result = await Product.updateMany(
      { isApproved: false },
      { $set: { isApproved: true } }
    );
    res.json({ message: "All products approved", result });
  } catch (error) {
    console.error("Error bulk approving products:", error);
    res.status(500).json({ error: "Failed to approve all products" });
  }
};

/**
 * Bulk Reject All pending products
 */
export const rejectAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({ isApproved: false });
    res.json({ message: "All pending products rejected", result });
  } catch (error) {
    console.error("Error bulk rejecting products:", error);
    res.status(500).json({ error: "Failed to reject all products" });
  }
};
