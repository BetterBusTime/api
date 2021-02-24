require("dotenv").config();

const express = require("express");
const routes = require("./controllers/routes");

const app = express();

// TODO only allow the BBT front end
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use("/routes", routes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on ${port}`));
