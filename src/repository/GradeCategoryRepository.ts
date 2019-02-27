import { injectable } from "inversify";
import { gradeCategoryDatabase, GradeCategoryDocument, GradeCategoryDTO } from "../schema/GradeCategorySchema";
import logger from "../util/Logger";

export interface GradeCategoryRepository {
    findAll(): Promise<GradeCategoryDTO[]>;
    find(id: string): Promise<GradeCategoryDTO>;
    create(gradeCategoryDTO: GradeCategoryDTO): Promise<GradeCategoryDTO>;
    update(gradeCategoryDTO: GradeCategoryDTO): Promise<GradeCategoryDTO>;
    delete(id: string): Promise<string>;
}

@injectable()
export class GradeCategoryRepositoryImpl implements GradeCategoryRepository {

    public async findAll(): Promise<GradeCategoryDTO[]> {
        return await gradeCategoryDatabase.find();
    }

    public async find(id: string): Promise<GradeCategoryDTO> {
        return await gradeCategoryDatabase.findById(id);
    }

    public async create(gradeCategoryDTO: GradeCategoryDTO): Promise<GradeCategoryDTO> {
        return await gradeCategoryDatabase.create(gradeCategoryDTO);
    }

    public async update(gradeCategoryDTO: GradeCategoryDTO): Promise<GradeCategoryDTO> {
        return await gradeCategoryDatabase.findByIdAndUpdate(gradeCategoryDTO._id, gradeCategoryDTO, (err: Error, res: GradeCategoryDocument) => {
            return res;
        });
    }

    public async delete(id: string): Promise<string> {
        const deleted =  await gradeCategoryDatabase.findByIdAndRemove(id);
        return deleted ? "Grade Category Successfully Deleted" : "Grade Category Doesn't Exist";
    }

}
