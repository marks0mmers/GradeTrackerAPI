import { injectable } from "inversify";
import { userDatabase, UserDatabaseDTO } from "../schema/UserSchema";

export interface UserRepository {
    newUser(user: UserDatabaseDTO): Promise<UserDatabaseDTO>;
    getUser(id: string): Promise<UserDatabaseDTO>;
    getUsers(): Promise<UserDatabaseDTO[]>;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {

    public async newUser(user: UserDatabaseDTO): Promise<UserDatabaseDTO> {
        return await userDatabase.connect().then(() => userDatabase.Users.create(user));
    }

    public async getUser(id: string): Promise<UserDatabaseDTO> {
        return await userDatabase.connect().then(() => userDatabase.Users.findOne(id));
    }

    public async getUsers(): Promise<UserDatabaseDTO[]> {
        const userDtos = await userDatabase.connect().then(() => userDatabase.Users.find());
        return userDtos.toArray();
    }

}
