const express = require("express");
const axios = require("axios");
const APIHelper = require("./apihelper");

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const data = await getStop(req.params.id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

const getStop = async id => {
    const response = await axios.get(APIHelper.stopURL(id));
    return response.data.Siri.ServiceDelivery;
};

module.exports = router;
