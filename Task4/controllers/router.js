"use strict"
const log = console.log;
const api = require("../app/api");
require("../app/helper");

module.exports = (app) => {
    app.use((request, response, next) => {
        log(request.originalUrl);
        next();
    });

    //#region postHandler

    app.post("/status", api.timeUpStatus);
    app.post("/api/events", api.eventsHandling);

    //#endregion

    //#region getHandler

    app.get("/", (request, response, next) => {
        next();
    });
    app.get("/status", api.timeUpStatus);
    app.get("/api/events", api.eventsHandling);

    //#endregion

    app.use((req, res, next) => {
        log("not found");
        res.status(404).send("<h1>Page not found</h1>");
    });
};