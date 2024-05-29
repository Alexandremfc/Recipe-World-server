const express = require("express");
const userRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const error = require("../middleware/error");
const recipeRouter = require("../routes/recipes");
const home = require("../routes/home");


module.exports = function (app) {
  app.use(express.json());
  app.use("/api/recipes", recipeRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/", home);
  app.use(error);
};
