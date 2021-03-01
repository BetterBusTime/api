const express = require("express");
const axios = require("axios");
const APIHelper = require("./apihelper");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const data = await getRoutes();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/:id", async (req, res) => {
    // We have to encode the route IDs at the last possible step because
    // Express will strip away encoding when it receives the URL
    try {
        const data = await getRoute(encodeURIComponent(req.params.id));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// MTA provides a different endpoint for each bus company servicing routes
// Hit both endpoints before collating the results into one collection
const getRoutes = async () => {
    const bc = await axios.get(APIHelper.bcRoutesURL());
    const nyct = await axios.get(APIHelper.nyctRoutesURL());
    return bc.data.data.list.concat(nyct.data.data.list);
};

const getRoute = async id => {
    const route = await axios.get(APIHelper.routeURL(id));
    return route.data.data;
};

module.exports = router;
