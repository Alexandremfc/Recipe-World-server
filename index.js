const express = require("express");
const Joi = require("joi");

const app = express();

// body parsing to populate req.body 
app.use(express.json());

const recipes = [
  { id: 1, name: "recipe1" },
  { id: 2, name: "recipe2" },
  { id: 3, name: "recipe3" },
];

app.get("/", (req, res) => {
  res.send("Hello , World");
});

app.get("/api/recipes", (req, res) => {
  console.log("Retrieve all recipes.");
  res.send(recipes);
});
app.get("/api/recipes/:id", (req, res) => {
  console.log("Retrieve a specific recipe.");
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (!recipe)
    return res.status(404).send("the recipe with the give id is not found..!");

  res.send(recipe.name);
});

app.post("/api/recipes", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });

  const {error , value} = schema.validate(req.body);
  
  if (error) res.status(400).send(error.message);

  const newRecipe = {
    id: recipes.length + 1,
    name: value.name,
  };

  recipes.push(newRecipe);
  console.log("New Recipe has been added to the dataBase .");

  res.send(newRecipe);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining on port ${port}...`));
