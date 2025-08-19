import express from "express";
import {
  getAllReviewsController,
  updateReviewStatusController,
} from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const reviewRouter = express.Router();

reviewRouter.get("/all", authMiddleware, getAllReviewsController);
reviewRouter.patch(
  "/update-status/:reviewId",
  authMiddleware,
  updateReviewStatusController
);

export default reviewRouter;
