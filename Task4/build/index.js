"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const body_parser_1 = __importDefault(require("body-parser"));
const port = 8000;
const router_1 = __importDefault(require("./router"));
// Add headers
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", `http://localhost:${port}`);
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(body_parser_1.default.urlencoded({
    limit: "10mb",
    parameterLimit: 100000,
    extended: false,
}), body_parser_1.default.json({
    limit: "10mb",
}));
app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Internal error");
});
router_1.default(app);
app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`server is listening on ${port}`);
});
