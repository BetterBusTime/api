const express = require("express");
const axios = require("axios");
const APIHelper = require("./helper");

const router = express.Router();

router.get("/", (req, res) => {
    getRoutes().then(data => res.json(data));
});

router.get("/:id", (req, res) => {
    // We have to encode the route IDs at the last possible step because
    // Express will strip away encoding when it receives the URL
    getRoute(encodeURIComponent(req.params.id)).then(data => res.json(data));
});

// MTA provides a different endpoint for each bus company servicing routes
// Hit both endpoints before collating the results into one collection
// TODO add error checking here to make sure we are getting good responses
const getRoutes = async () => {
    try {
        const bc = await axios.get(APIHelper.bcRoutesURL());
        const nyct = await axios.get(APIHelper.nyctRoutesURL());
        return bc.data.data.list.concat(nyct.data.data.list);
    } catch (error) {
        console.error(error);
    }
};

const getRoute = async id => {
    try {
        const route = await axios.get(APIHelper.routeURL(id));
        return route.data.data;
    } catch (error) {
        console.error(error);
    }
};

module.exports = router;
