const mongoose = require("./connection");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    pinned_routes: [],
    pinned_stops: []
});

const User = mongoose.model("User", userSchema);

module.exports = User;
