const express = require("express");
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
