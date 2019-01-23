import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { UserService } from "../service/UserService";
import { UserRequest } from "../util/Request";

export interface UserController {
    newUser(req: Request, res: Response, next: NextFunction): void;
    login(req: Request, res: Response, next: NextFunction): void;
    current(req: Request, res: Response, next: NextFunction): void;
}

@injectable()
export class UserControllerImpl implements UserController {

    private userService: UserService;

    constructor(@inject(TYPES.UserService) userService: UserService) {
        this.userService = userService;
        this.newUser = this.newUser.bind(this);
        this.login = this.login.bind(this);
        this.current = this.current.bind(this);
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
            const user = await this.userService.currentUser(id);
            res.json(user.toAuthJSON());
        } catch (err) {
            next(err);
        }
    }

}
