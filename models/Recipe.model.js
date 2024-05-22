const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: String,
  ingridents: [String],
  date: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
