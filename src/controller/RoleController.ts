import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Role } from "../model/Role";
import { RoleService } from "../service/RoleService";
import { UserRequest } from "../util/Request";

export interface RoleController {
    getAllRoles(req: UserRequest, res: Response, next: NextFunction): void;
    getRole(req: UserRequest, res: Response, next: NextFunction): void;
    createRole(req: UserRequest, res: Response, next: NextFunction): void;
    updateRole(req: UserRequest, res: Response, next: NextFunction): void;
    deleteRole(req: UserRequest, res: Response, next: NextFunction): void;
}

@injectable()
export class RoleControllerImpl implements RoleController {

    private roleService: RoleService;

    constructor(
        @inject(TYPES.RoleService) roleService: RoleService
    ) {
        this.roleService = roleService;

        this.createRole = this.createRole.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.getAllRoles = this.getAllRoles.bind(this);
        this.getRole = this.getRole.bind(this);
        this.updateRole = this.updateRole.bind(this);
    }

    public async getAllRoles(req: UserRequest, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        try {
            const roles = await this.roleService.getRolesForUser(userId);
            res.json(roles);
        } catch (err) {
            next(err);
        }
    }

    public async getRole(req: UserRequest, res: Response, next: NextFunction) {
        const roleId: string = req.params.roleId;
        try {
            const role = await this.roleService.getRole(roleId);
            res.json(role);
        } catch (err) {
            next(err);
        }
    }

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
