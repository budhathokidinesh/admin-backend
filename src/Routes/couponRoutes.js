import express from "express";
import {
  creatCouponController,
  deleteCouponController,
  getAllCouponController,
  updateCouponController,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/createCoupon", creatCouponController);

couponRouter.get("/getAllCoupon", getAllCouponController);

couponRouter.patch("/updateCoupon/:_id", updateCouponController);

couponRouter.delete("/deleteCoupon/:_id", deleteCouponController);

export default couponRouter;
