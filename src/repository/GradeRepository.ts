import { injectable } from "inversify";
import { gradeDatabase, GradeDocument, GradeDTO } from "../schema/GradeSchema";
import logger from "../util/Logger";

export interface GradeRepository {
    findAll(): Promise<GradeDTO[]>;
    find(id: string): Promise<GradeDTO>;
    create(gradeDTO: GradeDTO): Promise<GradeDTO>;
    update(gradeDTO: GradeDTO): Promise<GradeDTO>;
    delete(id: string): Promise<GradeDTO>;
}

@injectable()
export class GradeRepositoryImpl implements GradeRepository {
    public async findAll(): Promise<GradeDTO[]> {
        return await gradeDatabase.find();
    }
    public async find(id: string): Promise<GradeDTO> {
        return await gradeDatabase.findById(id);
    }
    public async create(gradeDTO: GradeDTO): Promise<GradeDTO> {
        return await gradeDatabase.create(gradeDTO);
    }
    public async update(gradeDTO: GradeDTO): Promise<GradeDTO> {
        return await gradeDatabase.findByIdAndUpdate(gradeDTO._id, gradeDTO, (err: Error, res: GradeDocument) => {
            return res;
        });
    }
    public async delete(id: string): Promise<GradeDTO> {
        return await gradeDatabase.findByIdAndRemove(id);
    }

}
