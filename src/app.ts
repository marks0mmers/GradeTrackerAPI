import bodyParser = require("body-parser");
import * as cors from "cors";
import * as dotenv from "dotenv";
import { Application, NextFunction, Request, Response } from "express";
import * as express from "express";
import * as session from "express-session";
import * as helmet from "helmet";
import { connect } from "mongoose";
import * as morgan from "morgan";
import container from "./config/inversify.config";
import TYPES from "./config/types";
import { RegistrableRoute } from "./route/RegistrableRoute";
import logger from "./util/Logger";

export class App {

    private app: Application;

    constructor() {
        this.app = express();
        this.config();
    }

    public listen() {
        // Listen on port 8000 for calls
        this.app.listen(process.env.PORT || 8000, () => {
            logger.info("Grade Tracker API listening on port 8000!");
        });
    }

    private config() {
        // Connect to mongoose database
        // tslint:disable-next-line:max-line-length
        connect(process.env.MONGODB_URI || "mongodb://heroku_k1lm0tlz:vmn8kc43irbuvvckg2jtnk0vm2@ds131905.mlab.com:31905/heroku_k1lm0tlz", { useNewUrlParser: true });

        // Configure passport strategy
        require("./config/Passport");

        // Configure environment variables
        dotenv.config();

        // Parse JSON data
        this.app.use(bodyParser.json());

        // Enable cross site access
        this.app.use(cors());

        // Register all routes
        const routes: RegistrableRoute[] = container.getAll<RegistrableRoute>(TYPES.Route);
        routes.forEach((route: RegistrableRoute) => route.register(this.app));

        // Decorate logging from winston
        this.app.use(morgan("combined", { stream: logger.stream }));

        // Protect app from well known HTTP vulnerabilies
        this.app.use(helmet());

        // Log all errors to the .logs and to the console
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            logger.error(err.stack);
            next(err);
        });

        // Report all errors as 500s and send the error message
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(500).send({message: err.message});
        });

        // Use a session to store all cookies for auth
        this.app.use(
            session({
                secret: "passport-tutorial",
                cookie: { maxAge: 60000 },
                resave: false,
                saveUninitialized: false
            })
        );
    }

}
