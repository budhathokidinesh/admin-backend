import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    slug: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    images: [String],
    thumbnail: String,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productPath: { type: String, required: true, index: true },
    mainCategory: { type: String, required: true, index: true },
    stock: Number,
    sizes: [String],
    colors: [String],
    brand: String,
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock"],
      default: "active",
    },
    tags: [String],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    videoUrl: { type: String },
  },
  { timestamps: true }
);

const productCollection = mongoose.model("Product", productSchema);
export default productCollection;
// 
