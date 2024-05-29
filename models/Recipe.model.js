const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingridients: [String],
  Instructions: [String],
  Image: { 
    type: String,
    required: true ,
  },
  Category:  {
    type: String,
    enum : ['Breakfast','Lunch', 'Dinner', 'Snack'],
    required: true
  }, 
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;

// required
// minlength 
// maxlength
