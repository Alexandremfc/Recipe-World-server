const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
require('./startup/routes')(app);

mongoose
  .connect("mongodb://localhost/Recipe-Book")
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.error("Could not connect tp MongoDB", err));



if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan Enabeld..");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining on port ${port}...`));
