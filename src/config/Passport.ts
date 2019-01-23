import { use } from "passport";
import { Strategy } from "passport-local";
import { User } from "../model/User";
import { userDatabase, UserMongoSchema } from "../schema/UserSchema";

use(new Strategy({
    usernameField: "email",
    passwordField: "password"
}, async (email: string, password: string, done: (error: any, user?: any, options?: any) => void) => {
    try {
        const users = await userDatabase.connect().then(() => userDatabase.Users.find());
        users.toArray()
            .then((values: UserMongoSchema[]) => values.find((value: UserMongoSchema) => value.email === email))
            .then((user: UserMongoSchema) => {
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
            }).catch(done);
    } catch (err) {
        done(err);
    }
}));
