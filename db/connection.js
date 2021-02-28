const mongoose = require("mongoose");

const uri =
    process.env.NODE_ENV === "production"
        ? process.env.DB_URL
        : "mongodb://localhost:27017/betterbustime";

// Understanding these new connection options
// https://arunrajeevan.medium.com/understanding-mongoose-connection-options-2b6e73d96de1
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(instance =>
        console.log(`connection SUCCESS: ${instance.connections[0].name}`)
    )
    .catch(error => console.error(`connection FAILURE: ${error}`));

module.exports = mongoose;
