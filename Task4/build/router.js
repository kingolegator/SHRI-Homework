"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./api"));
exports.default = (app) => {
    app.use((request, response, next) => {
        console.log(request.originalUrl);
        next();
    });
    //#region postHandler
    app.post("/status", api_1.default.timeUpStatus);
    app.post("/api/events", api_1.default.eventsHandling);
    //#endregion
    //#region getHandler
    app.get("/", (request, response, next) => {
        next();
    });
    app.get("/status", api_1.default.timeUpStatus);
    app.get("/api/events", api_1.default.eventsHandling);
    //#endregion
    app.use((request, response, next) => {
        console.log("not found");
        response.status(404).send("<h1>Page not found</h1>");
    });
};
