import bodyParser = require("body-parser");
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { Application, NextFunction, Request, Response } from "express";
import * as helmet from "helmet";
import { InversifyExpressServer } from "inversify-express-utils";
import { connect } from "mongoose";
import * as morgan from "morgan";
import container from "./config/inversify.config";

import { errorMiddleware } from "./config/error.middleware";
import "./course/course.controller";
import "./grade-category/grade-category.controller";
import "./grade/grade.controller";
import "./role/role.controller";
import "./user/user.controller";

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

        // Configure environment variables
        dotenv.config();

        const server = new InversifyExpressServer(container, null, { rootPath: "/api" });

        server.setConfig((app: Application) => {
            // Parse JSON data
            app.use(bodyParser.json());

            app.use(cookieParser());

            // Enable cross site access
            app.use(cors());

            // Protect app from well known HTTP vulnerabilies
            app.use(helmet());

            // Add simple console logging with dev
            app.use(morgan("common"));
        });

        server.setErrorConfig((app: Application) => {
            app.use(errorMiddleware);
        });
        this.app = server.build();
    }

}
