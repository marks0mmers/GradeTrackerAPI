import { Application } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { UserController } from "../controller/UserController";
import { auth } from "../util/Auth";
import { RegistrableRoute } from "./RegistrableRoute";

@injectable()
export class UserRoute implements RegistrableRoute {

    private userController: UserController;

    constructor(@inject(TYPES.UserController) userController: UserController) {
        this.userController = userController;
    }

    public register(app: Application): void {
        app.route("/api/users")
        .get(auth.required, this.userController.getUsers)
        .post(auth.optional, this.userController.newUser);

        app.route("/api/users/login")
        .post(auth.optional, this.userController.login);

        app.route("/api/users/current")
        .get(auth.required, this.userController.current);

        app.route("/api/users/:userId")
        .get(auth.required, this.userController.getUser);
    }
}
