class APIHelper {
    /* COMMON */
    static AND = "&";
    static JSON = ".json?";

    static KEY = `key=${process.env.MTA_API_KEY}`;
    static VER = "version=2";
    /* END */

    /* MTA OneBusAway API (OBA)
    // https://bustime.mta.info/wiki/Developers/OneBusAwayRESTfulAPI
    */
    static OBA = "https://bustime.mta.info/api/where";

    static ROUTES = "/routes-for-agency/";
    static MTABC = "MTABC" + this.JSON;
    static MTANYCT = "MTA%20NYCT" + this.JSON;

    static STOPS = "/stops-for-route/";
    static PL = "includePolylines=false";
    /* END */

    /* MTA Service Interface for Realtime Information API (SIRI)
    // https://bustime.mta.info/wiki/Developers/SIRIIntro
    */
    static SIRI = "https://bustime.mta.info/api/siri/stop-monitoring.json?";

    static OREF = "OperatorRef=MTA";
    static MREF = "MonitoringRef=";
    static DETAIL = "StopMonitoringDetailLevel=minimum";
    /* END */

    static routesURL = agency =>
        this.OBA + this.ROUTES + agency + this.KEY + this.AND + this.VER;
    static bcRoutesURL = () => this.routesURL(this.MTABC);
    static nyctRoutesURL = () => this.routesURL(this.MTANYCT);

    static routeURL = route =>
        this.OBA +
        this.STOPS +
        route +
        this.JSON +
        this.KEY +
        this.AND +
        this.PL +
        this.AND +
        this.VER;

    static stopURL = stop =>
        this.SIRI +
        this.KEY +
        this.AND +
        this.OREF +
        this.AND +
        this.MREF +
        stop +
        this.AND +
        this.DETAIL +
        this.AND +
        this.VER;
}

module.exports = APIHelper;
