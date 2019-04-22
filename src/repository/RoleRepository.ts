import { injectable } from "inversify";
import * as _ from "lodash";
import { roleDatabase, RoleDocument, RoleDTO } from "../schema/RoleSchema";
import { userDatabase } from "../schema/UserSchema";

export interface RoleRepository {
    findAll(): Promise<RoleDTO[]>;
    find(id: string): Promise<RoleDTO>;
    create(roleDTO: RoleDTO): Promise<RoleDTO>;
    update(roleDTO: RoleDTO): Promise<RoleDTO>;
    delete(id: string): Promise<RoleDTO>;
}

@injectable()
export class RoleRepositoryImpl implements RoleRepository {
    public async findAll(): Promise<RoleDTO[]> {
        return await roleDatabase.find();
    }

    public async find(id: string): Promise<RoleDTO> {
        return await roleDatabase.findById(id);
    }

    public async create(roleDTO: RoleDTO): Promise<RoleDTO> {
        const user = await userDatabase.findById(roleDTO.userId);
        const role = await roleDatabase.create(roleDTO);
        if (user.roles) {
            user.roles.push(role._id);
        }
        user.save();
        return role;
    }

    public async update(roleDTO: RoleDTO): Promise<RoleDTO> {
        return await roleDatabase.findByIdAndUpdate(roleDTO._id, roleDTO, (err: Error, res: RoleDocument) => {
            return res;
        });
    }

    public async delete(id: string): Promise<RoleDTO> {
        const role = await roleDatabase.findById(id);
        const user = await userDatabase.findById(role.userId);
        if (user.roles) {
            user.roles = _.remove(user.roles, (roleId) => roleId === id);
        }
        return await roleDatabase.findByIdAndRemove(id);
    }
}
