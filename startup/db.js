const mongoose = require("mongoose");

const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/Recipe-Book";

module.exports = function () {
  mongoose
    .connect(MONGODB_URL)
    .then(() => console.log("Connected to MongoDB.."))
    .catch((err) => console.error("Could not connect tp MongoDB", err));
};
