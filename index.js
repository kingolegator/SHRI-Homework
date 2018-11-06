"use strict";

const port = 3000;
const express = require("express");
const router = require("./controllers/router");
const app = express();

app.use("/public", express.static(__dirname + "/public"));

app.set("views", "./views");
app.set("view engine", "pug");

router(app);

app.listen(port, () => {
    console.log(`app listen on ${port} port`);
});