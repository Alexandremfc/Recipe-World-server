const jwt =  require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const { User } = require("../models/User.model");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("invalid email or password..");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json("invalid email or password..");

  const token = jwt.sign({_id: user._id} , 'jwtPrivateKey');

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(),
  });

  return schema.validate(req);
}

module.exports = router;
