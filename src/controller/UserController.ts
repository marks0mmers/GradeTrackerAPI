import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import TYPES from "../config/types";
import { userHasRole } from "../middleware/RoleMiddleware";
import { User } from "../model/User";
import { UserService } from "../service/UserService";
import { auth } from "../util/Auth";
import { UserRequest } from "../util/Request";

@controller("/users")
export class UserController {

    @inject(TYPES.UserService)
    private userService: UserService;

    @httpPost("/", auth.optional)
    public async newUser(req: Request, res: Response, next: NextFunction) {
        try {
            const createdUser = await this.userService.newUser(req.body);
            res.json(createdUser.toAuthJSON());
        } catch (err) {
            next(err);
        }
    }

    @httpPost("/login", auth.optional)
    public async login(req: Request, res: Response, next: NextFunction) {
        this.userService.login(req, res, next);
    }

    @httpGet("/current", auth.required)
    public async current(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { payload: { id } } = req;
            const user = await this.userService.getUser(id);
            res.json(user.toAuthJSON());
        } catch (err) {
            next(err);
        }
    }

    @httpGet("/:userId", auth.required, userHasRole("admin"))
    public async getUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const retUser = await this.userService.getUser(req.params.userId);
            res.json(retUser.toJSON());
        } catch (err) {
            next(err);
        }
    }

    @httpGet("/", auth.required, userHasRole("admin"))
    public async getUsers(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getUsers();
            res.json(users.map((user) => user.toJSON()));
        } catch (err) {
            next(err);
        }
    }

    @httpPut("/current", auth.required)
    public async editCurrentUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const currentUser = await this.userService.getUser(req.payload.id);
            const userEdits = new User(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                currentUser.salt,
                currentUser.hash,
                currentUser.roles,
                currentUser.id
            );
            const editedUser = await this.userService.editUser(userEdits);
            res.json(editedUser);
        } catch (err) {
            next(err);
        }
    }

    @httpPut("/:userId", auth.required, userHasRole("admin"))
    public async editUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const currentUser = await this.userService.getUser(req.params.userId);
            const userEdits = new User(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                currentUser.salt,
                currentUser.hash,
                currentUser.roles,
                currentUser.id
            );
            const editedUser = await this.userService.editUser(userEdits);
            res.json(editedUser);
        } catch (err) {
            next(err);
        }
    }

}
