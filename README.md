# Better Bus Time API

This is the API servicing requests from the Better Bus Time [front end application](https://github.com/BetterBusTime/app). This backend server primarly acts as a proxy to avoid CORS errors, due to the [MTA OneBusAway API](http://bustime.mta.info/wiki/Developers/OneBusAwayRESTfulAPI) not providing an `Access-Control-Allow-Origin` header. User accounts are also supported; users can _pin_ their favorite bus routes and bus stops to see them at a glance on every page.

## Installation

Packages are managed via `npm`. Run `npm ci` to avoid generating a new `package-lock.json`.

## Technologies Used

This API is written in Express running on Node.js. Data storage is handled via MongoDB + Mongoose. Adding user authentication was a learning journey. I made use of `bcryptjs` to hash user account passwords being stored in the database, and `jsonwebtoken` to provide authentication tokens to the client.
