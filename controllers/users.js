const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/user");

const router = express.Router();

router.post("/register", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = new User({ username: req.body.username, password: hash });

    user.save((error, newUser) => {
        if (error) {
            res.status(400).json({
                data: "Bad request. Check your credentials and try again."
            });
        } else {
            const token = generateNewToken(newUser.username);
            res.status(201).json({ data: token });
        }
    });
});

router.post("/login", (req, res) => {
    // login route
});

const generateNewToken = username =>
    jwt.sign({ username: username }, process.env.JWT_SIGNING_KEY, {
        expiresIn: "14d"
    });

module.exports = router;
