"use strict"
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const log = console.log;
const port = 8000;
const router = require("./controllers/router");

//Add headers
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", `http://localhost:${port}`);
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    response.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(
    bodyParser.urlencoded({
        limit: "10mb",
        parameterLimit: 100000,
        extended: false
    }),
    bodyParser.json({
        limit: "10mb"
    })
);

app.use((err, request, response, next) => {
    log(err);
    response.status(500).send("Internal error");
});

router(app);

app.listen(port, (err) => {
    if (err) {
        return log(err);
    }
    log(`server is listening on ${port}`);
});