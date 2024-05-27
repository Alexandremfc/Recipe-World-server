const express = require('express');
const router = express.Router();
const Joi = require("joi");
const { User , validate} = require("../models/User.model");


router.post('/' , async (req , res) => {
        const {error} = validate(req.body);
        if(error) return res.status(400).json(error.details[0].message);

        let user = await User.findOne({email: req.body.email});
        if(user) return res.status(400).json("user already registered..");

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();

        res.json(user);
});


module.exports = router;