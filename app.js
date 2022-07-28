const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
//Utils
const { AppError } = require("./utils/AppError");

//Controllers
const { globalErrorHandler } = require("./controllers/Error.controller");

//Routes
const { userRouter } = require("./routes/user.routes");
const { cartRouter } = require("./routes/cart.routes");
const { productsRouter } = require("./routes/products.routes");
const { viewsRouter } = require("./routes/views.routes");
//Middlewares

//Init App
const app = express();
app.use(express.json());

//Set template engine
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

// Limit the number of requests that can be accepted to our server
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, // 1 hr
  message: "Number of requests have been exceeded",
});

app.use(limiter);

// Add security headers
app.use(helmet());

// Compress responses
app.use(compression());

// Log incoming requests
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else app.use(morgan("combined"));

//Define Endpoints
app.use("/", viewsRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});
app.use(globalErrorHandler);

module.exports = { app };
