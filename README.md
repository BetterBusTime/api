# Better Bus Time API

This is the API servicing requests from the Better Bus Time [front end application](https://github.com/BetterBusTime/app). Currently this backend server acts as a proxy to avoid CORS errors, due to the [MTA OneBusAway API](http://bustime.mta.info/wiki/Developers/OneBusAwayRESTfulAPI) not providing an `Access-Control-Allow-Origin` header. The future goal is to support user accounts so users can pin their favorite routes and stops. More information is available at the repo for the front end app (linked above).

## Installation

Packages are managed via `npm`. Run `npm ci` to avoid generating a new `package-lock.json`.

## Technologies Used

This API is written in Express running on Node.js. Data storage (when we get there) will be handled via MongoDB + Mongoose.
