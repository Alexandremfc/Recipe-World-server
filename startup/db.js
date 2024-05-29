const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/Recipe-Book")
    .then(() => console.log("Connected to MongoDB.."))
    .catch((err) => console.error("Could not connect tp MongoDB", err));
};
