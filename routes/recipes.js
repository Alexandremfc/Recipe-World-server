const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Recipe = require("../models/Recipe.model");

const recipe = new Recipe({
  name: "chicken parmesan",
  ingridents: ["2 oz chicken", "100g parmesan"],
});

// GET
router.get("/", async (req, res) => {
  try {
    console.log("Retrieve all recipes.");
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (e) {
    res.status(500).json({
      message: "Error while Retreiving the recipes from the server..",
      error: e.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  console.log("Retrieve a specific recipe.");
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404).send("the recipe with the give id is not found..!");
    return;
  }

  res.json(recipe);
});

// POST
router.post("/", async (req, res) => {
  const { error, value } = validateRecipe(req.body);

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  const result = await Recipe.create(value);
  console.log("New Recipe has been added to the dataBase .");

  res.json(result);
});

// PUT
router.put("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res
      .status(404)
      .json({ message: "the recipe with the provided id is not found.!" });
    return;
  }

  const { error, value } = validateRecipe(req.body);

  if (error) {
    res.status(400).send(error.message);
    return;
  }

  recipe.name = req.body.name;
  recipe.ingridents = req.body.ingridents;

  console.log("a Recipe has been updated in the dataBase .");
  res.json(recipe);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    res.status(404).send("the recipe with the provided id is not found.!");
    return;
  }

  const deletedRecipe = await Recipe.deleteOne({ _id: id });

  console.log("a recipe has been deleted from the dataBase.");
  res.json({
    message: "you have sucsessfully removed a recipe from the database.",
  });
});

function validateRecipe(recipe) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    ingridents: Joi.array().items(Joi.string()),
  });

  return schema.validate(recipe);
}

module.exports = router;
