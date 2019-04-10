import { ObjectId } from "bson";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Grade, toGrade, toGradeDTO } from "../model/Grade";
import { GradeCategory } from "../model/GradeCategory";
import { GradeCategoryRepository } from "../repository/GradeCategoryRepository";
import { GradeCategoryDTO } from "../schema/GradeCategorySchema";

export interface GradeCategoryService {
    getAll(courseId: string): Promise<GradeCategory[]>;
    getOne(id: string): Promise<GradeCategory>;
    create(gradeCategory: GradeCategory): Promise<GradeCategory>;
    update(gradeCategory: GradeCategory): Promise<GradeCategory>;
    delete(id: string): Promise<GradeCategory>;
}

@injectable()
export class GradeCategoryServiceImpl implements GradeCategoryService {

    @inject(TYPES.GradeCategoryRepository)
    private gradeCategoryRepository: GradeCategoryRepository;

    public async getAll(courseId: string): Promise<GradeCategory[]> {
        return await this.gradeCategoryRepository.findAll(courseId)
            .then((categories: GradeCategoryDTO[]) => categories.map((g: GradeCategoryDTO) => this.toGradeCategory(g).calculateGrades()));
    }

    public async getOne(id: string): Promise<GradeCategory> {
        return await this.gradeCategoryRepository.find(id)
            .then((g: GradeCategoryDTO) => this.toGradeCategory(g).calculateGrades());
    }

    public async create(gradeCategory: GradeCategory): Promise<GradeCategory> {
        const gradeCategoryDTO = this.toGradeCategoryDTO(gradeCategory);
        return await this.gradeCategoryRepository.create(gradeCategoryDTO)
            .then((g: GradeCategoryDTO) => this.toGradeCategory(g).calculateGrades());
    }

    public async update(gradeCategory: GradeCategory): Promise<GradeCategory> {
        const gradeCategoryDTO = this.toGradeCategoryDTO(gradeCategory);
        return await this.gradeCategoryRepository.update(gradeCategoryDTO)
            .then((g: GradeCategoryDTO) => this.toGradeCategory(g).calculateGrades());
    }

    public async delete(id: string): Promise<GradeCategory> {
        return await this.gradeCategoryRepository.delete(id)
            .then((g: GradeCategoryDTO) => this.toGradeCategory(g).calculateGrades());
    }

    private toGradeCategory(gradeCategoryDTO: GradeCategoryDTO): GradeCategory {
        return new GradeCategory(
            gradeCategoryDTO.title,
            gradeCategoryDTO.percentage,
            gradeCategoryDTO.numberOfGrades,
            gradeCategoryDTO.courseId,
            gradeCategoryDTO._id,
            gradeCategoryDTO.grades && gradeCategoryDTO.grades.map((g) => toGrade(g))
        );
    }

    private toGradeCategoryDTO(gradeCategory: GradeCategory): GradeCategoryDTO {
        return {
            title: gradeCategory.title,
            percentage: gradeCategory.percentage,
            numberOfGrades: gradeCategory.numberOfGrades,
            courseId: gradeCategory.courseId,
            _id: gradeCategory.id,
            grades: gradeCategory.grades && gradeCategory.grades.map((g) => toGradeDTO(g))
        };
    }

}
