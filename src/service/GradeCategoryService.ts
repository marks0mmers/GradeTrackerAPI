import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { GradeCategory } from "../model/GradeCategory";
import { GradeCategoryRepository } from "../repository/GradeCategoryRepository";
import { GradeCategoryDTO } from "../schema/GradeCategorySchema";

export interface GradeCategoryService {
    getAll(courseId: string): Promise<GradeCategory[]>;
    getOne(id: string): Promise<GradeCategory>;
    create(gradeCategory: GradeCategory): Promise<GradeCategory>;
    update(gradeCategory: GradeCategory): Promise<GradeCategory>;
    delete(id: string): Promise<string>;
}

@injectable()
export class GradeCategoryServiceImpl implements GradeCategoryService {

    @inject(TYPES.GradeCategoryRepository)
    private gradeCategoryRepository: GradeCategoryRepository;

    public async getAll(courseId: string): Promise<GradeCategory[]> {
        // TODO: Implement logic to calculate grades once grade object is implemented
        return await this.gradeCategoryRepository.findAll()
            .then((categories: GradeCategoryDTO[]) => categories.map((g: GradeCategoryDTO) => this.toGradeCategory(g)))
            .then((categories: GradeCategory[]) => categories.filter((g: GradeCategory) => g.courseId === courseId));
    }

    public async getOne(id: string): Promise<GradeCategory> {
        // TODO: Implement logic to calculate grades once grade object is implemented
        return await this.gradeCategoryRepository.find(id)
            .then((g: GradeCategoryDTO) => this.toGradeCategory(g));
    }

    public async create(gradeCategory: GradeCategory): Promise<GradeCategory> {
        // TODO: Implement logic to calculate grades once grade object is implemented
        const gradeCategoryDTO = this.toGradeCategoryDTO(gradeCategory);
        return await this.gradeCategoryRepository.create(gradeCategoryDTO)
            .then((g: GradeCategoryDTO) => this.toGradeCategory(g));
    }

    public async update(gradeCategory: GradeCategory): Promise<GradeCategory> {
        // TODO: Implement logic to calculate grades once grade object is implemented
        const gradeCategoryDTO = this.toGradeCategoryDTO(gradeCategory);
        return await this.gradeCategoryRepository.update(gradeCategoryDTO)
            .then((g: GradeCategoryDTO) => this.toGradeCategory(g));
    }

    public async delete(id: string): Promise<string> {
        return await this.gradeCategoryRepository.delete(id);
    }

    private toGradeCategory(gradeCategoryDTO: GradeCategoryDTO): GradeCategory {
        return new GradeCategory(
            gradeCategoryDTO.title,
            gradeCategoryDTO.percentage,
            gradeCategoryDTO.numberOfGrades,
            gradeCategoryDTO.userId,
            gradeCategoryDTO.courseId,
            gradeCategoryDTO._id,
            gradeCategoryDTO.remainingGrades,
            gradeCategoryDTO.currentAverage,
            gradeCategoryDTO.guarenteedAverage,
            gradeCategoryDTO.potentialAverage
        );
    }

    private toGradeCategoryDTO(gradeCategory: GradeCategory): GradeCategoryDTO {
        return {
            title: gradeCategory.title,
            percentage: gradeCategory.percentage,
            numberOfGrades: gradeCategory.numberOfGrades,
            userId: gradeCategory.userId,
            courseId: gradeCategory.courseId,
            remainingGrades: gradeCategory.remainingGrades,
            currentAverage: gradeCategory.currentAverage,
            guarenteedAverage: gradeCategory.guarenteedAverage,
            potentialAverage: gradeCategory.potentialAverage,
            _id: gradeCategory.id
        };
    }

}
