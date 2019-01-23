import { pbkdf2Sync, randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { UserDTO } from "../schema/UserSchema";

export class User {

    constructor(
        private firstName: string,
        private lastName: string,
        private email: string,
        private salt: string,
        private hash: string,
        private isAdmin: boolean,
        private id?: string
    ) {}

    get getFirstName() {
        return this.firstName;
    }

    get getLastName() {
        return this.lastName;
    }

    get getEmail() {
        return this.email;
    }

    get getSalt() {
        return this.salt;
    }

    get getHash() {
        return this.hash;
    }

    get getIsAdmin() {
        return this.isAdmin;
    }

    get getId() {
        return this.id;
    }

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
            isAdmin: this.isAdmin,
            token: this.generateJWT()
        };
    }

}
