const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User.model");

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find();
  res.json(users);
});
router.put("/:userId", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(id, req.body , { new: true});
  res.json(updatedUser);
});
router.delete("/:userId", [auth, admin], async (req, res) => {
  const { id } = req.params;

  const users = await User.findByIdAndDelete(id);
  res.json(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json("user already registered..");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res.set("x-auth-token", token);
  res.json(_.pick(user, ["name", "email", "_id"]));
});

module.exports = router;
