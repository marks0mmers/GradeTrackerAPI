import { injectable } from "inversify";
import { gradeDatabase, GradeDTO } from "../schema/GradeSchema";
import logger from "../util/Logger";

export interface GradeRepository {
    findAll(): Promise<GradeDTO[]>;
    find(id: string): Promise<GradeDTO>;
    create(gradeDTO: GradeDTO): Promise<GradeDTO>;
    update(gradeDTO: GradeDTO): Promise<GradeDTO>;
    delete(id: string): Promise<string>;
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
        const dto = await gradeDatabase.findById(gradeDTO._id);

        dto.name = gradeDTO.name;
        dto.grade = gradeDTO.grade;
        dto.gradeCategoryId = gradeDTO.gradeCategoryId;

        const saved = await dto.save((err: Error, grade: GradeDTO) => {
            if (err) {
                logger.error("Error updating grade: " + err);
                throw err;
            }
            return grade;
        });
        return saved;
    }
    public async delete(id: string): Promise<string> {
        const deleted = await gradeDatabase.findByIdAndRemove(id);
        return deleted ? "Grade successfully deleted" : "Grade not found";
    }

}
