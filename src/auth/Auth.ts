import { Request } from "express";
import { UserDatabaseDTO } from "../user/user.schema";

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface DataStoredInToken {
    id: string;
}

export interface RequestWithUser extends Request {
  user: UserDatabaseDTO;
}

export const createCookie = (tokenData: TokenData) => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};
