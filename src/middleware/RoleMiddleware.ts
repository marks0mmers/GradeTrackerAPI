import { NextFunction } from "connect";
import { Response } from "express";
import { RoleDTO } from "../schema/RoleSchema";
import { userDatabase, UserDatabaseDTO } from "../schema/UserSchema";
import { UserRequest } from "../util/Request";

export const userHasRole = (...roles: string[]) => async (req: UserRequest, res: Response, next: NextFunction) => {
    const user: UserDatabaseDTO = await userDatabase.findById(req.payload.id).populate("roles").exec();
    const doesUserHaveRole = user.roles ? user.roles.some((role: RoleDTO) => roles.indexOf(role.role) >= 0) : false;
    if (doesUserHaveRole) {
        next();
    } else {
        res.status(401).json({message: "You do not have the privledges to perform this action"});
    }
};
