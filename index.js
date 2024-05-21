const express = require("express");
const morgan = require("morgan");
const recipes = require("./routes/recipes");
const home = require("./routes/home");

const app = express();

// body parsing to populate req.body
app.use(express.json());
app.use("/api/recipes", recipes);
app.use("/", home);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan Enabeld..");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining on port ${port}...`));
