"use strict";

import api from "./api";
import express from "express";

export default (app: express.Application) => {
    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.log(request.originalUrl);
        next();
    });

    //#region postHandler

    app.post("/status", api.timeUpStatus);
    app.post("/api/events", api.eventsHandling);

    //#endregion

    //#region getHandler

    app.get("/", (request: express.Request, response: express.Response, next: express.NextFunction) => {
        next();
    });
    app.get("/status", api.timeUpStatus);
    app.get("/api/events", api.eventsHandling);

    //#endregion

    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.log("not found");
        response.status(404).send("<h1>Page not found</h1>");
    });
};
