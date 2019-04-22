import { NextFunction } from "connect";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { authenticate } from "passport";
import TYPES from "../config/types";
import { Role, toRole, toRoleDTO } from "../model/Role";
import { User } from "../model/User";
import { UserRepository } from "../repository/UserRepository";
import { RoleDTO } from "../schema/RoleSchema";
import { LoginDTO, NewUserDTO, UserDatabaseDTO, UserDTO } from "../schema/UserSchema";
import { RoleService } from "./RoleService";

export interface UserService {
    newUser(user: NewUserDTO): Promise<User>;
    login(req: Request, res: Response, next: NextFunction): any;
    getUsers(): Promise<User[]>;
    getUser(id: string): Promise<User>;
}

@injectable()
export class UserServiceImpl implements UserService {

    @inject(TYPES.UserRepository)
    private userRepository: UserRepository;

    @inject(TYPES.RoleService)
    private roleService: RoleService;

    public async newUser(user: NewUserDTO): Promise<User> {
        const createdUser = new User(user.firstName, user.lastName, user.email, "", "");
        createdUser.setPassword(user.password);
        const newUser = await this.userRepository.newUser(this.toUserDto(createdUser)).then((u: UserDatabaseDTO) => {
            return this.toUser(u);
        });
        const defaultRole = await this.roleService.newRole(new Role("user", newUser.id));
        newUser.roles = [];
        newUser.roles.push(defaultRole);
        return newUser;
    }

    public login(req: Request, res: Response, next: NextFunction) {
        return authenticate("local", { session: false}, (err, passportUser, info) => {
            if (err) {
                res.send(err);
            }
            if (passportUser) {
                const user = new User(
                    passportUser.firstName,
                    passportUser.lastName,
                    passportUser.email,
                    passportUser.salt,
                    passportUser.hash,
                    passportUser.roles && passportUser.roles.map((r: RoleDTO) => toRole(r)),
                    passportUser._id
                );
                return res.json(user.toAuthJSON());
            }
            return res.status(400);
        })(req, res, next);
    }

    public async getUser(id: string): Promise<User> {
        return await this.userRepository.getUser(id).then((u: UserDatabaseDTO) => {
            return this.toUser(u);
        });
    }

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.getUsers().then((users: UserDatabaseDTO[]) => users.map((u: UserDatabaseDTO) => {
            return this.toUser(u);
        }));
    }

    private toUserDto(user: User): UserDatabaseDTO {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            hash: user.hash,
            salt: user.salt,
            roles: user.roles && user.roles.map((r) => toRoleDTO(r)),
            _id: user.id
        };
    }

    private toUser(user: UserDatabaseDTO): User {
        return new User(
            user.firstName,
            user.lastName,
            user.email,
            user.salt,
            user.hash,
            user.roles && user.roles.map((r) => toRole(r)),
            user._id
        );
    }

}
