import { NextFunction, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import TYPES from "../config/types";
import { userHasRole } from "../middleware/RoleMiddleware";
import { Role } from "../model/Role";
import { RoleService } from "../service/RoleService";
import { auth } from "../util/Auth";
import { UserRequest } from "../util/Request";

@controller("/roles", auth.required, userHasRole("admin"))
export class RoleController {

    @inject(TYPES.RoleService)
    private roleService: RoleService;

    @httpGet("/user/:userId")
    public async getAllRoles(req: UserRequest, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        try {
            const roles = await this.roleService.getRolesForUser(userId);
            res.json(roles);
        } catch (err) {
            next(err);
        }
    }

    @httpGet("/:roleId")
    public async getRole(req: UserRequest, res: Response, next: NextFunction) {
        const roleId: string = req.params.roleId;
        try {
            const role = await this.roleService.getRole(roleId);
            res.json(role);
        } catch (err) {
            next(err);
        }
    }

    @httpPost("/user/:userId")
    public async createRole(req: UserRequest, res: Response, next: NextFunction) {
        const role = new Role(
            req.body.role,
            req.params.userId
        );
        try {
            const createdRole = await this.roleService.newRole(role);
            res.json(createdRole);
        } catch (err) {
            next(err);
        }
    }

    @httpPut("/:roleId")
    public async updateRole(req: UserRequest, res: Response, next: NextFunction) {
        const role = new Role(
            req.body.role,
            req.body.userId,
            req.params.roleId
        );
        try {
            const updatedRole = await this.roleService.updateRole(role);
            res.json(updatedRole);
        } catch (err) {
            next(err);
        }
    }

    @httpDelete("/:roleId")
    public async deleteRole(req: UserRequest, res: Response, next: NextFunction) {
        const roleId = req.params.roleId;
        try {
            const deletedRole = await this.roleService.deleteRole(roleId);
            if (deletedRole) {
                res.json(deletedRole);
            } else {
                res.status(404).json({message: "Cannot find role"});
            }
        } catch (err) {
            next(err);
        }
    }

}
