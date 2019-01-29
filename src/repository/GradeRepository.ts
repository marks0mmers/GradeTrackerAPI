import { injectable } from "inversify";
import { gradeDatabase, GradeDTO, GradeMongoSchema } from "../schema/GradeSchema";
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
        const grades = await gradeDatabase.connect().then(() => gradeDatabase.Grades.find());
        return grades.toArray();
    }
    public async find(id: string): Promise<GradeDTO> {
        return await gradeDatabase.connect().then(() => gradeDatabase.Grades.findOne(id));
    }
    public async create(gradeDTO: GradeDTO): Promise<GradeDTO> {
        return await gradeDatabase.connect().then(() => gradeDatabase.Grades.create(gradeDTO));
    }
    public async update(gradeDTO: GradeDTO): Promise<GradeDTO> {
        const dto: GradeMongoSchema = await gradeDatabase.connect().then(() => gradeDatabase.Grades.findOne(gradeDTO._id));

        dto.name = gradeDTO.name;
        dto.grade = gradeDTO.grade;
        dto.gradeCategoryId = gradeDTO.gradeCategoryId;

        const saved = await dto.save((err: Error, grade: GradeMongoSchema) => {
            if (err) {
                logger.error("Error updating grade: " + err);
                throw err;
            }
            return grade;
        });
        return saved;
    }
    public async delete(id: string): Promise<string> {
        return await gradeDatabase.connect().then(() => gradeDatabase.Grades.remove({_id: id})).then((numberDeleted: number) => {
            return numberDeleted > 0 ? "Grade successfully deleted" : "Grade not found";
        });
    }

}
