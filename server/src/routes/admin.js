import express from "express";
import {
  getPendingProducts,
  approveProduct,
  rejectProduct,
  approveAllProducts,
  rejectAllProducts,
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Get all pending products
router.get("/pending", getPendingProducts);

// ✅ Approve single
router.patch("/approve/:id", approveProduct);

// ✅ Reject single
router.delete("/reject/:id", rejectProduct);

// ✅ Bulk Approve
router.patch("/approve-all", approveAllProducts);

// ✅ Bulk Reject
router.delete("/reject-all", rejectAllProducts);

export default router;
