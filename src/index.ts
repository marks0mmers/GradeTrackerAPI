import * as bodyParser from "body-parser";
import * as express from "express";
import session = require("express-session");
import morgan = require("morgan");
import container from "./config/inversify.config";
import TYPES from "./config/types";
import { RegistrableRoute } from "./Route/RegistrableRoute";
import logger from "./util/Logger";

const app: express.Application = express();

require("./config/Passport");

// Express middleware registration

app.use(bodyParser.json());

const Routes: RegistrableRoute[] = container.getAll<RegistrableRoute>(TYPES.Route);
Routes.forEach((Route) => Route.register(app));

app.use(morgan("combined", { stream: logger.stream }));

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    next(err);
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).send({message: err.message});
});

app.use(
    session({
        secret: "passport-tutorial",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

app.listen(3000, () => {
    logger.info("Grade Tracker API listening on port 3000!");
});
