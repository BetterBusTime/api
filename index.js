require("dotenv").config();

const express = require("express");
const users = require("./controllers/users");
const routes = require("./controllers/routes");
const stops = require("./controllers/stops");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        process.env.NODE_ENV === "production"
            ? "https://betterbustime.herokuapp.com"
            : "http://localhost:3000"
    );
    next();
});

app.use("/users", users);
app.use("/routes", routes);
app.use("/stops", stops);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on ${port}`));
