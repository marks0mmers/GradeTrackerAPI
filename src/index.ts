import * as bodyParser from "body-parser";
import cors = require("cors");
import * as express from "express";
import session = require("express-session");
import fs = require("fs");
import helmet = require("helmet");
import https = require("https");
import { connect } from "mongoose";
import morgan = require("morgan");
import path = require("path");
import container from "./config/inversify.config";
import TYPES from "./config/types";
import { RegistrableRoute } from "./route/RegistrableRoute";
import logger from "./util/Logger";

const app: express.Application = express();

export const connection = connect(process.env.MONGODB_URI || "mongodb://localhost:27017/grade-tracker", { useNewUrlParser: true });

require("./config/Passport");

require("dotenv").config();

// Express middleware registration

// Parse JSON data
app.use(bodyParser.json());

app.use(cors());

// Register all routes
const Routes: RegistrableRoute[] = container.getAll<RegistrableRoute>(TYPES.Route);
Routes.forEach((Route) => Route.register(app));

// Decorate logging from winston
app.use(morgan("combined", { stream: logger.stream }));

// Protect app from well known HTTP vulnerabilies
app.use(helmet());

// Log all errors to the .logs and to the console
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    next(err);
});

// Report all errors as 500s and send the error message
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).send({message: err.message});
});

// Use a session to store all cookies for auth
app.use(
    session({
        secret: "passport-tutorial",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

// app.use(express.static(path.join(__dirname, "client", "build")));
// // Right before your app.listen(), add this:
// app.get("/*", (req: express.Request, res: express.Response) => {
//     // tslint:disable-next-line:no-console
//     console.log(req);
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// Listen on port 8000 for calls
app.listen(process.env.PORT || 8000, () => {
    logger.info("Grade Tracker API listening on port 8000!");
});
