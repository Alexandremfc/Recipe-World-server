const express = require("express");
const morgan = require("morgan");
const recipeRouter = require("./routes/recipes");
const home = require("./routes/home");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const error = require("./middleware/error");

const app = express();

mongoose
  .connect("mongodb://localhost/Recipe-Book")
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.error("Could not connect tp MongoDB", err));

// body parsing to populate req.body
app.use(express.json());
// app.use(express.static('public'));

// Routes:
app.use("/api/recipes", recipeRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/", home);
app.use(error);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan Enabeld..");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining on port ${port}...`));
