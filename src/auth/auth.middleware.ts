import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { DataStoredInToken, RequestWithUser } from "../auth/Auth";
import { WrongAuthentificationTokenException } from "../exceptions/WrongAuthenticationToken";
import { userDatabase } from "../user/user.schema";

export const authMiddleware = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET || "secret";
        try {
            const verificationResponse = verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse.id;
            const user = await userDatabase.findById(id);
            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthentificationTokenException());
            }
        } catch (error) {
            next(new WrongAuthentificationTokenException());
        }
    } else {
        next(new WrongAuthentificationTokenException());
    }
  };
