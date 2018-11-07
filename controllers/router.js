"use strict";
const pug = require("pug");

module.exports = (app) => {

    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/monitoring", (req, res) => {
        res.render("monitoring");
    });
    
    app.get("/getMainPage", (req, res) => {
        res.send(pug.renderFile("./views/events.pug"));
    });

    app.get("/getMonitoringPage", (req, res) => {
        res.send(pug.renderFile("./views/monitoring.pug"));
    });

    app.use((req, res) => {
        res.status(404).send("<h1>Page not found</h1>");
    });

}