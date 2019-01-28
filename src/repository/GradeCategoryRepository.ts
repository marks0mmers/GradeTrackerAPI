import { injectable } from "inversify";
import { gradeCategoryDatabase, GradeCategoryDTO, GradeCategoryMongoSchema } from "../schema/GradeCategorySchema";
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
        const gradeCategoryDTOs = await gradeCategoryDatabase.connect().then(() => gradeCategoryDatabase.GradeCategories.find());
        return gradeCategoryDTOs.toArray();
    }

    public async find(id: string): Promise<GradeCategoryDTO> {
        return await gradeCategoryDatabase.connect().then(() => gradeCategoryDatabase.GradeCategories.findOne(id));
    }

    public async create(gradeCategoryDTO: GradeCategoryDTO): Promise<GradeCategoryDTO> {
        return await gradeCategoryDatabase.connect().then(() => gradeCategoryDatabase.GradeCategories.create(gradeCategoryDTO));
    }

    public async update(gradeCategoryDTO: GradeCategoryDTO): Promise<GradeCategoryDTO> {
        const dto: GradeCategoryMongoSchema = await gradeCategoryDatabase.connect()
            .then(() => gradeCategoryDatabase.GradeCategories.findOne(gradeCategoryDTO._id));

        dto.title = gradeCategoryDTO.title;
        dto.percentage = gradeCategoryDTO.percentage;
        dto.numberOfGrades = gradeCategoryDTO.numberOfGrades;
        dto.potentialAverage = gradeCategoryDTO.potentialAverage || null;
        dto.remainingGrades = gradeCategoryDTO.remainingGrades || null;
        dto.userId = gradeCategoryDTO.userId;
        dto.courseId = gradeCategoryDTO.courseId;
        dto.currentAverage = gradeCategoryDTO.currentAverage || null;
        dto.guarenteedAverage = gradeCategoryDTO.guarenteedAverage || null;

        const saved = await dto.save((err: Error, g: GradeCategoryDTO) => {
            if (err) {
                logger.error("Error updating Grade Category: " + err);
                throw err;
            }
            return g;
        });

        return saved;
    }

    public async delete(id: string): Promise<string> {
        return await gradeCategoryDatabase.connect().then(() => gradeCategoryDatabase.GradeCategories.remove({_id: id})).then((numberOfDeleted: number ) => {
            return numberOfDeleted > 0 ? "Grade Category Successfully Deleted" : "Grade Category Doesn't Exist";
        });
    }

}
