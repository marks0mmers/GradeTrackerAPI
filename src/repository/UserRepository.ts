import { injectable } from "inversify";
import { userDatabase, UserDatabaseDTO } from "../schema/UserSchema";

export interface UserRepository {
    newUser(user: UserDatabaseDTO): Promise<UserDatabaseDTO>;
    current(id: string): Promise<UserDatabaseDTO>;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {

    public async newUser(user: UserDatabaseDTO): Promise<UserDatabaseDTO> {
        return await userDatabase.connect().then(() => userDatabase.Users.create(user));
    }

    public async current(id: string): Promise<UserDatabaseDTO> {
        return await userDatabase.connect().then(() => userDatabase.Users.findOne(id));
    }

}
