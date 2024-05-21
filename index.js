const express = require("express");
const Joi = require("joi");
const morgan = require("morgan");

const app = express();

// body parsing to populate req.body
app.use(express.json());

const recipes = [
  { id: 1, name: "recipe1" },
  { id: 2, name: "recipe2" },
  { id: 3, name: "recipe3" },
];

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan Enabeld..");
}

// Home page
app.get("/", (req, res) => {
  res.send("Hello , World");
});

// GET
app.get("/api/recipes", (req, res) => {
  console.log("Retrieve all recipes.");
  res.send(recipes);
});
app.get("/api/recipes/:id", (req, res) => {
  console.log("Retrieve a specific recipe.");
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (!recipe) {
    res.status(404).send("the recipe with the give id is not found..!");
    return;
  }

  res.send(recipe.name);
});

// POST
app.post("/api/recipes", (req, res) => {
  const { error, value } = validateRecipe(req.body);

  if (error) {
    res.status(400).send(error.message);
    return;
  }

  const newRecipe = {
    id: recipes.length + 1,
    name: value.name,
  };

  recipes.push(newRecipe);
  console.log("New Recipe has been added to the dataBase .");

  res.send(newRecipe);
});

// PUT
app.put("/api/recipes/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (!recipe) {
    res.status(404).send("the recipe with the provided id is not found.!");
    return;
  }

  const { error, value } = validateRecipe(req.body);

  if (error) {
    res.status(400).send(error.message);
    return;
  }

  recipe.name = req.body.name;
  console.log("a Recipe has been updated in the dataBase .");
  res.send(recipe);
});

// DELETE
app.delete("/api/recipes/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (!recipe) {
    res.status(404).send("the recipe with the provided id is not found.!");
    return;
  }

  const index = recipes.indexOf(recipe);
  recipes.splice(index, 1);

  console.log("a recipe has been deleted from the dataBase.");
  res.send(recipe);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining on port ${port}...`));

function validateRecipe(recipe) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });

  return schema.validate(recipe);
}
