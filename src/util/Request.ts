import { Request } from "express";

export interface UserRequest extends Request {
    payload: {id: string};
}
