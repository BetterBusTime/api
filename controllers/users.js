const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/user");

const router = express.Router();

// Sign with Mongo's _id param to use for lookups later with decoded tokens
const generateNewToken = id => {
    return jwt.sign({ _id: id }, process.env.JWT_SIGNING_KEY, {
        expiresIn: "14d"
    });
};

// check if this username already exists
const validateUniqueUsername = async (req, res, next) => {
    const count = await User.countDocuments({ username: req.body.username });

    if (count === 0) return next();

    if (count > 0) {
        return res
            .status(400)
            .json({ message: "This username already exists." });
    }

    return res.status(500).json({ message: "Internal server error." });
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

// Verify authentication. If there is a failure, we return a response.
// Otherwise, since we are looking up a user, return that instead,
// and the calling function will handle sending the response.
const verifyToken = async (req, res) => {
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

                return user;
            }

            return res.status(401).json({ message: "Invalid user." });
        }

        return res.status(401).json({ message: "Invalid token." });
    }

    return res.status(401).json({ message: "Invalid authorization." });
};

router.get("/", async (req, res) => {
    const user = await verifyToken(req, res);

    if (user) {
        return res
            .status(200)
            .json({ routes: user.pinned_routes, stops: user.pinned_stops });
    }

    return res.status(401).json({ message: "Invalid authorization." });
});

router.post("/routes", async (req, res) => {
    const user = await verifyToken(req, res);

    if (user) {
        user.pinned_routes.push(req.body);
        const updated = await user.save();
        return res.status(201).json({ routes: updated.pinned_routes });
    }

    return res.status(401).json({ message: "Invalid authorization." });
});

router.delete("/routes/:id", async (req, res) => {
    const user = await verifyToken(req, res);

    if (user) {
        user.pinned_routes = user.pinned_routes.filter(
            route => route.id !== req.params.id
        );
        const updated = await user.save();
        return res.status(200).json({ routes: updated.pinned_routes });
    }

    return res.status(401).json({ message: "Invalid authorization." });
});

router.post("/stops", async (req, res) => {
    const user = await verifyToken(req, res);

    if (user) {
        user.pinned_stops.push(req.body);
        const updated = await user.save();
        return res.status(201).json({ stops: updated.pinned_stops });
    }

    return res.status(401).json({ message: "Invalid authorization." });
});

router.delete("/stops/:id", async (req, res) => {
    const user = await verifyToken(req, res);

    if (user) {
        user.pinned_stops = user.pinned_stops.filter(
            stop => stop.id !== req.params.id
        );
        const updated = await user.save();
        return res.status(200).json({ stops: updated.pinned_stops });
    }

    return res.status(401).json({ message: "Invalid authorization." });
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

router.post("/register", validateUniqueUsername, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = new User({ username: req.body.username, password: hash });

    const saved = await user.save();

    if (saved) {
        return res
            .status(201)
            .set({ "X-Access-Token": generateNewToken(saved._id) })
            .json({ message: `${saved.username} registration successful.` });
    }

    return res.status(500).json({ message: "Internal server error." });
});

module.exports = router;
