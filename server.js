import express from "express";
import connection from "./src/config/dbConfig.js";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import "dotenv/config";

import errorMiddleware from "./src/middlewares/errorMiddleware.js";
import { authRouter } from "./src/routes/authRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import categoryRouter from "./src/routes/categoryRoute.js";
// import cloudnaryConfig from "./src/config/cloudnaryConfig.js/index.js";
import orderRouter from "./src/routes/orderRoutes.js";
import imageRouter from "./src/routes/imageRoute.js";
// import orderRouter from "./src/routes/orderRoutes.js";
import reviewRouter from "./src/routes/reviewRoutes.js";
import couponRouter from "./src/routes/couponRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// cloudnary cinfiguration
// cloudnaryConfig();

// get the current directory name
const __dirname = path.resolve();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.send("<h2>Api is up</h2>"));

//Routers
app.use("/api/v1/image", imageRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/coupon", couponRouter);

// connect MongoDB
connection()
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to mongoose
    instance. */
    app.listen(PORT, (error) => {
      return !error
        ? console.log(`server is running at http://localhost:${PORT}`)
        : console.log(error);
    });
  })
  .catch((error) => console.log(error));

// page not found error
app.use((req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
// global error hadler middleware
app.use(errorMiddleware);
