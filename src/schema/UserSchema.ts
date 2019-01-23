import { Collection, Core, Index, Instance, Model, ObjectID, Property } from "iridium";

export interface UserDTO {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    isAdmin: boolean;
}

export interface UserDatabaseDTO {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    hash: string;
    salt: string;
    isAdmin: boolean;
}

export interface NewUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export interface LoginDTO {
    email: string;
    password: string;
}

@Index({name: 1})
@Collection("users")
export class UserMongoSchema extends Instance<UserDatabaseDTO, UserMongoSchema> {

    @ObjectID
    // tslint:disable-next-line:variable-name
    public _id?: string;

    @Property(String, true)
    public firstName: string;

    @Property(String, true)
    public lastName: string;

    @Property(String, true)
    public email: string;

    @Property(String)
    public hash: string;

    @Property(String)
    public salt: string;

    @Property(Boolean, true)
    public isAdmin: boolean;
}

// tslint:disable-next-line:max-classes-per-file
class UserDatabase extends Core {
    public Users = new Model<UserDatabaseDTO, UserMongoSchema>(this, UserMongoSchema);
}

export const userDatabase = new UserDatabase({database: "grade_tracker"});
