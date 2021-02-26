class APIHelper {
    static AND = "&";
    static JSON = ".json?";
    static BASE = "http://bustime.mta.info/api/where";

    static ROUTES = "/routes-for-agency/";
    static MTABC = "MTABC" + this.JSON;
    static MTANYCT = "MTA%20NYCT" + this.JSON;

    static STOPS = "/stops-for-route/";

    static KEY = `key=${process.env.MTA_API_KEY}`;
    static PL = "includePolylines=false";
    static VER = "version=2";

    static routesURL = agency =>
        this.BASE + this.ROUTES + agency + this.KEY + this.AND + this.VER;
    static bcRoutesURL = () => this.routesURL(this.MTABC);
    static nyctRoutesURL = () => this.routesURL(this.MTANYCT);

    static routeURL = route =>
        this.BASE +
        this.STOPS +
        route +
        this.JSON +
        this.KEY +
        this.AND +
        this.PL +
        this.AND +
        this.VER;
}

module.exports = APIHelper;
