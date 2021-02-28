const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/user");

const router = express.Router();

// check if user already exists
const validateUniqueUsername = (req, res, next) => {
    User.countDocuments({ username: req.body.username }, (err, count) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ data: "Internal server error." });
        }

        if (count > 0) {
            return res
                .status(400)
                .json({ data: "This username already exists." });
        }

        next();
    });
};

router.post("/register", validateUniqueUsername, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = new User({ username: req.body.username, password: hash });

    user.save((err, newUser) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ data: "Internal server error." });
        }

        res.status(201).json({ data: generateNewToken(newUser.username) });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ data: "Internal server error." });
        }

        if (user) {
            const valid = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (valid) {
                return res
                    .status(200)
                    .json({ data: generateNewToken(user.username) });
            }

            return res.status(401).json({
                data:
                    "Invalid username and/or password. Check your credentials and try again."
            });
        }

        res.status(401).json({ data: "This user does not exist." });
    });
});

// TODO make longer expiration time after testing authentication
const generateNewToken = username =>
    jwt.sign({ username: username }, process.env.JWT_SIGNING_KEY, {
        expiresIn: "300s"
    });

module.exports = router;
