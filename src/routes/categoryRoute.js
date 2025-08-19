import express from "express";

import {
  createNewCategory,
  deleteCategory,
  getAllCategories,
  updateCategoryController,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
export const categoryRouter = express.Router();

categoryRouter.post("/addCategory", authMiddleware, createNewCategory);
categoryRouter.get("/getallCategory", authMiddleware, getAllCategories);
categoryRouter.patch(
  "/updateCategory/:id",
  authMiddleware,
  updateCategoryController
);
categoryRouter.delete("/delete/:id", authMiddleware, deleteCategory);

export default categoryRouter;
