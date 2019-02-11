import { use } from "passport";
import { Strategy } from "passport-local";
import { User } from "../model/User";
import { userDatabase, UserDatabaseDTO } from "../schema/UserSchema";

use(new Strategy({
    usernameField: "email",
    passwordField: "password"
}, async (email: string, password: string, done: (error: any, user?: any, options?: any) => void) => {
    try {
        const values = await userDatabase.find();
        const user = values.find((value: UserDatabaseDTO) => value.email === email);
        const userObject = new User(
            user.firstName,
            user.lastName,
            user.email,
            user.salt,
            user.hash,
            user.isAdmin,
            user._id
        );
        if (!userObject || !userObject.validatePassword(password)) {
            return done(null, false, { errors: { "email or password": "is invalid" } });
        }
        return done(null, user);
    } catch (err) {
        done(err);
    }
}));
