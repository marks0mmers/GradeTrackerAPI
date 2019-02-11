import { Document, model, Schema } from "mongoose";
import { connection } from "..";

export interface UserDTO {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    isAdmin: boolean;
}

export interface UserDatabaseDTO extends Document {
    _id: string;
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
    isAdmin: {
        type: Boolean,
        required: true
    }
});

export const userDatabase = model<UserDatabaseDTO>("users", userSchema);
