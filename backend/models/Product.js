import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    customId: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    model: { type: String },
    description: { type: String },
    thumbnail: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    currency: { type: String, default: "INR" },
    stock: { type: Number, default: 0 },
    sku: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    specifications: { type: Map, of: String },
    features: [{ type: String }],
    tags: [{ type: String }],
    variants: [
      {
        color: { type: String },
        storage: { type: String },
        ram: { type: String },
        sku: { type: String },
        stock: { type: Number, default: 0 },
        price: { type: Number },
        images: [{ type: String }],
      },
    ],
    shippingCharge: { type: Number, default: 0 },
    warranty: { type: String },
    status: {
      type: String,
      enum: ["active", "draft", "out_of_stock"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true },
);



export default mongoose.model("Product", productSchema);
