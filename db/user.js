const mongoose = require("./connection");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    pinned_routes: [String],
    pinned_stops: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
