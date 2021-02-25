const BASE = "http://bustime.mta.info/api/where";

const ROUTES = "/routes-for-agency";
const MTABC = "/MTABC.json?";
const MTANYCT = "/MTA%20NYCT.json?";

const STOPS = "/stops-for-route";

const KEY = `key=${process.env.MTA_API_KEY}`;
const PL = "includePolylines=false";
const VER = "version=2";

const AND = "&";

const routesURL = agency => BASE + ROUTES + agency + KEY + AND + VER;
const bcRoutesURL = () => routesURL(MTABC);
const nyctRoutesURL = () => routesURL(MTANYCT);

module.exports = {
    bcRoutesURL,
    nyctRoutesURL
};
