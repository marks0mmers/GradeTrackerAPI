import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Role, toRole, toRoleDTO } from "./role.model";
import { RoleRepository } from "./role.repository";
import { RoleDTO } from "./role.schema";

export interface RoleManager {
    getRolesForUser(userId: string): Promise<Role[]>;
    getRole(roleId: string): Promise<Role>;
    newRole(role: Role): Promise<Role>;
    updateRole(role: Role): Promise<Role>;
    deleteRole(roleId: string): Promise<Role>;
}

@injectable()
export class RoleManagerImpl implements RoleManager {

    @inject(TYPES.RoleRepository)
    private roleRepository: RoleRepository;

    public async getRolesForUser(userId: string): Promise<Role[]> {
        return await this.roleRepository.findAll().then((roles) => roles
            .map(toRole)
            .filter((r) => r.userId === userId)
        );
    }
    public async getRole(roleId: string): Promise<Role> {
        return await this.roleRepository.find(roleId).then(toRole);
    }
    public async newRole(role: Role): Promise<Role> {
        const newRole = toRoleDTO(role);
        return await this.roleRepository.create(newRole).then(toRole);
    }
    public async updateRole(role: Role): Promise<Role> {
        const updated = toRoleDTO(role);
        return await this.roleRepository.update(updated).then(toRole);
    }
    public async deleteRole(roleId: string): Promise<Role> {
        return await this.roleRepository.delete(roleId).then(toRole);
    }

}
