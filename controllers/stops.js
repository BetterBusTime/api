const express = require("express");
const axios = require("axios");
const APIHelper = require("./apihelper");

const router = express.Router();

router.get("/:id", (req, res) => {
    getStop(req.params.id).then(data => res.json(data));
});

const getStop = async id => {
    try {
        const response = await axios.get(APIHelper.stopURL(id));
        return response.data.Siri.ServiceDelivery;
    } catch (error) {
        console.error(error);
    }
};

module.exports = router;
