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
        return await userDatabase.create(user);
    }

    public async getUser(id: string): Promise<UserDatabaseDTO> {
        return await userDatabase.findById(id).populate("roles").exec();
    }

    public async getUsers(): Promise<UserDatabaseDTO[]> {
        return await userDatabase.find().populate("roles").exec();
    }

}
