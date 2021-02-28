const express = require("express");
const User = require("../db/user");

const router = express.Router();

router.post("/register", (req, res) => {
    // register route
});

router.post("/login", (req, res) => {
    // login route
});

module.exports = router;
