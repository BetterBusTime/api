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
            return res.status(500).json({ message: "Internal server error." });
        }

        if (count > 0) {
            return res
                .status(400)
                .json({ message: "This username already exists." });
        }

        return next();
    });
};

const decodeToken = token => {
    try {
        const verified = jwt.verify(token, process.env.JWT_SIGNING_KEY);
        return { ...verified, expired: false };
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            // If the token is expired, we have to decode it without verifying
            const expired = jwt.decode(token);
            return expired ? { ...expired, expired: true } : false;
        }

        return false;
    }
};

const verifyToken = async (req, res, next) => {
    // We send a Bearer token in the Authorization header
    // Authorization: Bearer <token>
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];

    if (token) {
        const decoded = decodeToken(token);

        if (decoded) {
            const user = await User.findById(decoded._id).exec();

            if (user) {
                if (decoded.expired) {
                    // If the token has expired, we'll generate a new one
                    // And send it along with the normal response
                    // For a seamless user experience
                    res.set({ "X-Access-Token": generateNewToken(user._id) });
                }

                return next();
            }

            return res.status(500).json({ message: "Internal server error." });
        }

        return res.status(400).json({ message: "Invalid token." });
    }

    return res.status(400).json({ message: "Invalid authorization." });
};

router.get("/", verifyToken, (req, res) => {
    return res.status(200).json({ message: "GET /users" });
});

router.post("/register", validateUniqueUsername, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = new User({ username: req.body.username, password: hash });

    user.save((err, newUser) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error." });
        }

        return res
            .status(201)
            .set({ "X-Access-Token": generateNewToken(newUser._id) })
            .json({ message: `${newUser.username} registration successful.` });
    });
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username }).exec();

    if (user) {
        const valid = await bcrypt.compare(req.body.password, user.password);

        if (valid) {
            return res
                .status(200)
                .set({ "X-Access-Token": generateNewToken(user._id) })
                .json({ message: `${user.username} login successful.` });
        }

        return res.status(401).json({
            message:
                "Invalid username and/or password. Check your credentials and try again."
        });
    }

    return res.status(401).json({ message: "This user does not exist." });
});

const generateNewToken = id => {
    return jwt.sign({ _id: id }, process.env.JWT_SIGNING_KEY, {
        expiresIn: "14d"
    });
};

module.exports = router;
