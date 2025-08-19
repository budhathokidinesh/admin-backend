import express from "express";
import {
  addOrUpdateOrderNote,
  orderStatusController,
  sendOrderNoteEmail,
  getDashboardData,
  getTopProducts,
} from "../controllers/orderController.js";
import { fetchAllOrdersAdmin } from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
//this is for creating the order

// router.patch("/status/:id", orderStatusController);
// router.get("/history", fetchAllOrdersAdmin);
router.patch("/orders/:orderId/note", addOrUpdateOrderNote);
router.post("/orders/:orderId/send-note-email", sendOrderNoteEmail);

router.patch("/status/:id", authMiddleware, orderStatusController);
router.get("/history", authMiddleware, fetchAllOrdersAdmin);
router.get("/dashboard", authMiddleware, getDashboardData);
router.get("/top-products", authMiddleware, getTopProducts);

export default router;
