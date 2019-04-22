import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { UserService } from "../service/UserService";
import { UserRequest } from "../util/Request";

export interface UserController {
    newUser(req: Request, res: Response, next: NextFunction): void;
    login(req: Request, res: Response, next: NextFunction): void;
    current(req: Request, res: Response, next: NextFunction): void;
    getUser(req: Request, res: Response, next: NextFunction): void;
    getUsers(req: Request, res: Response, next: NextFunction): void;
}

@injectable()
export class UserControllerImpl implements UserController {

    private userService: UserService;

    constructor(@inject(TYPES.UserService) userService: UserService) {
        this.userService = userService;
        this.newUser = this.newUser.bind(this);
        this.login = this.login.bind(this);
        this.current = this.current.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    public async newUser(req: Request, res: Response, next: NextFunction) {
        try {
            const createdUser = await this.userService.newUser(req.body);
            res.json(createdUser.toAuthJSON());
        } catch (err) {
            next(err);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        this.userService.login(req, res, next);
    }

    public async current(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { payload: { id } } = req;
            const user = await this.userService.getUser(id);
            res.json(user.toAuthJSON());
        } catch (err) {
            next(err);
        }
    }

    public async getUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const retUser = await this.userService.getUser(req.params.userId);
            res.json(retUser.toJSON());
        } catch (err) {
            next(err);
        }
    }

    public async getUsers(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getUsers();
            res.json(users.map((user) => user.toJSON()));
        } catch (err) {
            next(err);
        }
    }

}
