import bodyParser = require("body-parser");
import * as cors from "cors";
import * as dotenv from "dotenv";
import { Application, NextFunction, Request, Response } from "express";
import * as session from "express-session";
import * as helmet from "helmet";
import { InversifyExpressServer } from "inversify-express-utils";
import { connect } from "mongoose";
import * as morgan from "morgan";
import container from "./config/inversify.config";

import "./controller/CourseController";
import "./controller/GradeCategoryController";
import "./controller/GradeController";
import "./controller/RoleController";
import "./controller/UserController";

export class App {

    private app: Application;

    constructor() {
        this.config();
    }

    public listen() {
        // Listen on port 8000 for calls
        this.app.listen(process.env.PORT || 8000, () => {
            // tslint:disable-next-line:no-console
            console.log("Grade Tracker API listening on port 8000!");
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

        const server = new InversifyExpressServer(container, null, { rootPath: "/api" });
        server.setConfig((app: Application) => {
            // Parse JSON data
            app.use(bodyParser.json());

            // Enable cross site access
            app.use(cors());

            // Protect app from well known HTTP vulnerabilies
            app.use(helmet());

            // Add simple console logging with dev
            app.use(morgan("common"));

            // Log all errors to the .logs and to the console
            app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
                next(err);
            });

            // Report all errors as 500s and send the error message
            app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
        });
        this.app = server.build();
    }

}
