import {
  createNewCoupon,
  findAllCoupons,
  removeCoupon,
  updateCoupon,
} from "../models/Coupon/couponModel.js";
import responseClient from "../utility//responseClient.js";

//create a new coupon
export const creatCouponController = async (req, res, next) => {
  try {
    const coupon = await createNewCoupon(req.body);

    coupon?._id
      ? responseClient({
          req,
          res,
          message: "Coupon created successfully",
          payload: coupon,
        })
      : responseClient({
          req,
          res,
          message:
            "Could not create the coupon. Something went wrong, please try again later",
          statusCode: 500,
        });
  } catch (error) {
    next(error);
    console.error("Error while creating coupon:", error);
  }
};

//get all the coupen
export const getAllCouponController = async (req, res) => {
  try {
    const coupons = await findAllCoupons();
    responseClient({
      res,
      payload: coupons,
      message: "Coupon fetched successfully",
    });
  } catch (error) {
    responseClient({
      res,
      message: "Error while fetching coupons",
      statusCode: 500,
    });
    next(error);
  }
};

//update a coupon
export const updateCouponController = async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedCoupon = req.body;
    const updatedCouponData = await updateCoupon({ _id }, updatedCoupon);

    updatedCouponData?._id
      ? responseClient({
          res,
          payload: updatedCouponData,
          message: "Coupon updated successfully",
        })
      : responseClient({
          res,
          message: "Error while updating coupon",
          statusCode: 500,
        });
  } catch (error) {
    next(error);
  }
};

//delete coupon
export const deleteCouponController = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedCoupon = await removeCoupon({ _id });

    deletedCoupon?._id
      ? responseClient({
          res,
          payload: deletedCoupon,
          message: "Coupon deleted successfully",
        })
      : responseClient({
          res,
          message: "Error while deleting coupon",
          statusCode: 500,
        });
  } catch (error) {
    next(error);
  }
};
