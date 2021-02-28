const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/user");

const router = express.Router();

// check if user already exists
const validateUniqueUsername = (req, res, next) => {
    User.countDocuments({ username: req.body.username }, (error, count) => {
        if (error) res.status(500).json({ data: "Internal server error." });
        else if (count > 0) {
            res.status(400).json({ data: "This username already exists." });
        } else next();
    });
};

router.post("/register", validateUniqueUsername, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = new User({ username: req.body.username, password: hash });

    user.save((error, newUser) => {
        if (error) {
            res.status(500).json({ data: "Internal server error." });
        } else {
            res.status(201).json({ data: generateNewToken(newUser.username) });
        }
    });
});

router.post("/login", (req, res) => {
    // login route
});

// TODO make longer expiration time after testing authentication
const generateNewToken = username =>
    jwt.sign({ username: username }, process.env.JWT_SIGNING_KEY, {
        expiresIn: "300s"
    });

module.exports = router;
