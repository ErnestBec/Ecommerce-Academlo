const express = require("express");

//Init Router
const viewsRouter = express.Router();

//Define Endpoints
viewsRouter.get("/");

module.exports = { viewsRouter };
