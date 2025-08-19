import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
    reviewTitle: { type: String, required: true },
    productFitting: { type: String, required: true },
    productComforatability: { type: String, required: true },
  },

  { timestamps: true }
);

const reviewCollection = mongoose.model("Review", reviewSchema);
export default reviewCollection;
