const express = require("express");
const axios = require("axios");
const { bcRoutesURL, nyctRoutesURL } = require("./helper");

const router = express.Router();

router.get("/", (req, res) => {
    getRoutes().then(data => {
        res.json(data);
    });
});

// MTA provides a different endpoint for each bus company servicing routes
// Hit both endpoints before collating the results into one collection
// TODO add error checking here to make sure we are getting good responses
const getRoutes = async () => {
    try {
        const bc = await axios.get(bcRoutesURL());
        const nyct = await axios.get(nyctRoutesURL());
        return bc.data.data.list.concat(nyct.data.data.list);
    } catch (error) {
        console.error(error);
    }
};

module.exports = router;
