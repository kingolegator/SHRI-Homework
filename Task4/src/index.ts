"use strict";

import express from "express";
const app = express();
import bodyParser from "body-parser";
const port = 8000;
import router from "./router";

// Add headers
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", `http://localhost:${port}`);
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(
    bodyParser.urlencoded({
        limit: "10mb",
        parameterLimit: 100000,
        extended: false,
    }),
    bodyParser.json({
        limit: "10mb",
    }),
);

app.use((err: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(err);
    response.status(500).send("Internal error");
});

router(app);

app.listen(port, (err: Error) => {
    if (err) {
        return console.log(err);
    }
    console.log(`server is listening on ${port}`);
});
