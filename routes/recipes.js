const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
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
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Error while Retreiving the recipes from the server..",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("Retrieve a specific recipe.");
    const recipe = await Recipe.findById(req.params.id);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Invalid id.." });
  }

  if (!recipe) return res.status(404).send("the recipe is not found..!");

  res.json(recipe);
});

// POST
router.post("/", auth, async (req, res) => {
  const { error } = validateRecipe(req.body);

  if (error) return res.status(400).json({ message: error.message });

  try {
    const result = await Recipe.create(
      _.pick(req.body, ["name", "ingridents"])
    );
    console.log("New Recipe has been added to the dataBase .");
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error , while creating a new recipe.." });
  }
});

// PUT
router.put("/:id", auth, async (req, res) => {
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
router.delete("/:id", auth, async (req, res) => {
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
