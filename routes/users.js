const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const { User, validate } = require("../models/User.model");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json("user already registered..");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  await user.save();

  res.json(_.pick(user, ["name", "email", "_id"]));
});

module.exports = router;
