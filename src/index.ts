import * as bodyParser from "body-parser";
import * as express from "express";
import session = require("express-session");
import fs = require("fs");
import helmet = require("helmet");
import https = require("https");
import morgan = require("morgan");
import container from "./config/inversify.config";
import TYPES from "./config/types";
import { RegistrableRoute } from "./Route/RegistrableRoute";
import logger from "./util/Logger";

const app: express.Application = express();

require("./config/Passport");

// Express middleware registration

// Parse JSON data
app.use(bodyParser.json());

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

// Listen on port 3000 for calls
https.createServer({
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert")
}, app)
.listen(3000, () => {
    logger.info("Grade Tracker API listening on port 3000!");
});
