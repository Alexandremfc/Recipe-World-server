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
    res.status(500).send("something failed.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("Retrieve a specific recipe.");
    const recipe = await Recipe.findById(req.params.id);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("something failed.");
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
    res.status(500).send("something failed.");
  }
});

// PUT
router.put("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("something failed.");
  }

  if (!recipe) return res.status(404).send("the recipe is not found.!");

  const { error } = validateRecipe(req.body);

  if (error) return res.status(400).send(error.message);

  recipe.name = req.body.name;
  recipe.ingridents = req.body.ingridents;

  console.log("a Recipe has been updated in the dataBase .");
  res.json(recipe);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("something failed.");
  }

  if (!recipe) return res.status(404).send("the recipe with is not found.!");

  try {
    const deletedRecipe = await Recipe.deleteOne({ _id: id });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("something failed.");
  }

  console.log("a recipe has been deleted from the dataBase.");
  res.send("you have sucsessfully removed a recipe from the database.");
});

function validateRecipe(recipe) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    ingridents: Joi.array().items(Joi.string()),
  });

  return schema.validate(recipe);
}

module.exports = router;
