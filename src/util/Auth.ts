import { Request, Response } from "express";
import * as jwt from "express-jwt";

const getTokenFromHeaders = (req: Request): string => {
    const { headers: { authorization } } = req;
    if (authorization && authorization.split(" ")[0] === "Bearer") {
        return authorization.split(" ")[1];
    }
    return null;
};

export const authError = (err, req, res: Response, next) => {
    res.status(401).json({message: "User unauthorized"});
};

export const auth = {
    required: jwt({
        secret: "secret",
        userProperty: "payload",
        getToken: getTokenFromHeaders
    }),
    optional: jwt({
        secret: "secret",
        userProperty: "payload",
        getToken: getTokenFromHeaders,
        credentialsRequired: false
    })
};
