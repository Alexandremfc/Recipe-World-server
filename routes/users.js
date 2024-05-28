const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User.model");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json("user already registered..");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = jwt.sign({ _id: user._id }, "jwtPrivateKey");

  res.set("x-auth-token", token);
  res.json(_.pick(user, ["name", "email", "_id"]));
});

module.exports = router;
