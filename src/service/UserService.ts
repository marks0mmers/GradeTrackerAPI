import { NextFunction } from "connect";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { authenticate } from "passport";
import TYPES from "../config/types";
import { User } from "../model/User";
import { UserRepository } from "../repository/UserRepository";
import { LoginDTO, NewUserDTO, UserDatabaseDTO, UserDTO } from "../schema/UserSchema";

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

    public async newUser(user: NewUserDTO): Promise<User> {
        const createdUser = new User(user.firstName, user.lastName, user.email, "", "", user.isAdmin);
        createdUser.setPassword(user.password);
        return await this.userRepository.newUser(this.toUserDto(createdUser)).then((u: UserDatabaseDTO) => {
            return this.toUser(u);
        });
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
                    passportUser.isAdmin,
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
            firstName: user.getFirstName,
            lastName: user.getLastName,
            email: user.getEmail,
            hash: user.getHash,
            salt: user.getSalt,
            isAdmin: user.getIsAdmin,
            _id: user.getId
        };
    }

    private toUser(user: UserDatabaseDTO): User {
        return new User(
            user.firstName,
            user.lastName,
            user.email,
            user.salt,
            user.hash,
            user.isAdmin,
            user._id
        );
    }

}
