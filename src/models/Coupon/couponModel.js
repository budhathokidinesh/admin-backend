import CouponCollection from "./couponSchema.js";

//create a coupon
export const createNewCoupon = async (obj) => {
  const coupon = await CouponCollection(obj).save();
  return coupon;
};

//get all the coupons
export const findAllCoupons = async () => {
  const coupons = await CouponCollection.find();
  return coupons;
};

//update a coupon
export const updateCoupon = async (filter, updatedCoupon) => {
  const coupon = await CouponCollection.findOneAndUpdate(
    filter,
    updatedCoupon,
    {
      new: true,
    }
  );
  return coupon;
};

//remove coupon
export const removeCoupon = async (filter) => {
  const coupon = await CouponCollection.findOneAndDelete(filter);
  return coupon;
};
