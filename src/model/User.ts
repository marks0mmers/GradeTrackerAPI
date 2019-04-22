import { pbkdf2Sync, randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { UserDTO } from "../schema/UserSchema";
import { Role, toRoleDTO } from "./Role";

export class User {

    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public salt: string,
        public hash: string,
        public roles?: Role[],
        public id?: string
    ) {}

    public setPassword(password: string) {
        this.salt = randomBytes(16).toString("hex");
        this.hash = pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
    }

    public validatePassword(password: string) {
        const hash = this.hash = pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
        return this.hash === hash;
    }

    public generateJWT() {
        const today = new Date();
        const expirationDate = new Date(today.toString());
        expirationDate.setDate(today.getDate() + 60);

        return sign({
            email: this.email,
            id: this.id,
            exp: expirationDate.getTime() / 1000
        }, "secret");
    }

    public toAuthJSON(): UserDTO {
        return {
            _id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            token: this.generateJWT(),
            roles: this.roles.map((role: Role) => toRoleDTO(role))
        };
    }

    public toJSON() {
        return {
            _id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            roles: this.roles.map((role: Role) => toRoleDTO(role))
        };
    }

}
