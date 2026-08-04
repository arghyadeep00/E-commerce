import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import addressRoutes from "./routes/address.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import cartRoute from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/home", publicRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
