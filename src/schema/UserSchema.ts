import { Document, model, Schema } from "mongoose";
import { RoleDTO } from "./RoleSchema";

export interface UserDTO {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    roles?: RoleDTO[];
}

export interface UserDatabaseDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    hash: string;
    salt: string;
    roles?: RoleDTO[];
}

export interface UserDatabaseDocument extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    hash: string;
    salt: string;
    roles?: any[];
}

export interface NewUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    roles: [
        { type: Schema.Types.ObjectId, ref: "Role" }
    ]
});

export const userDatabase = model<UserDatabaseDocument>("User", userSchema);
