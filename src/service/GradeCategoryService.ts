import { ObjectId } from "bson";
import { inject, injectable } from "inversify";
import { Schema } from "mongoose";
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
        // TODO: Implement logic to calculate grades once grade object is implemented
        return await this.gradeCategoryRepository.findAll()
            .then((categories: GradeCategoryDTO[]) => categories.map((g: GradeCategoryDTO) => this.calculateGrades(this.toGradeCategory(g))))
            .then((categories: GradeCategory[]) => categories.filter((g: GradeCategory) => new ObjectId(g.courseId).toHexString() === courseId));
    }

    public async getOne(id: string): Promise<GradeCategory> {
        // TODO: Implement logic to calculate grades once grade object is implemented
        return await this.gradeCategoryRepository.find(id)
            .then((g: GradeCategoryDTO) => this.calculateGrades(this.toGradeCategory(g)));
    }

    public async create(gradeCategory: GradeCategory): Promise<GradeCategory> {
        // TODO: Implement logic to calculate grades once grade object is implemented
        const gradeCategoryDTO = this.toGradeCategoryDTO(gradeCategory);
        return await this.gradeCategoryRepository.create(gradeCategoryDTO)
            .then((g: GradeCategoryDTO) => this.calculateGrades(this.toGradeCategory(g)));
    }

    public async update(gradeCategory: GradeCategory): Promise<GradeCategory> {
        // TODO: Implement logic to calculate grades once grade object is implemented
        const gradeCategoryDTO = this.toGradeCategoryDTO(gradeCategory);
        return await this.gradeCategoryRepository.update(gradeCategoryDTO)
            .then((g: GradeCategoryDTO) => this.calculateGrades(this.toGradeCategory(g)));
    }

    public async delete(id: string): Promise<GradeCategory> {
        return await this.gradeCategoryRepository.delete(id)
            .then((g: GradeCategoryDTO) => this.calculateGrades(this.toGradeCategory(g)));
    }

    private calculateGrades(gc: GradeCategory) {
        const gradeCategory = new GradeCategory(
            gc.title,
            gc.percentage,
            gc.numberOfGrades,
            gc.courseId,
            gc.id,
            undefined,
            undefined,
            undefined,
            undefined,
            gc.grades
        );
        if (gradeCategory.grades) {
            const { numberOfGrades, grades } = gradeCategory;
            const totalOfCurrentGrades = grades.reduce((total: number, grade: Grade) => total += grade.grade, 0);
            const remainingGrades = numberOfGrades - grades.length;
            const currentAverage = totalOfCurrentGrades / (grades.length || 1);
            const potentialAverage = (totalOfCurrentGrades + 100 * remainingGrades) / numberOfGrades;
            const guarenteedAverage = totalOfCurrentGrades / numberOfGrades;
            gradeCategory.remainingGrades = remainingGrades;
            gradeCategory.currentAverage = currentAverage;
            gradeCategory.potentialAverage = potentialAverage;
            gradeCategory.guarenteedAverage = guarenteedAverage;
        }
        return gradeCategory;
    }

    private toGradeCategory(gradeCategoryDTO: GradeCategoryDTO): GradeCategory {
        return new GradeCategory(
            gradeCategoryDTO.title,
            gradeCategoryDTO.percentage,
            gradeCategoryDTO.numberOfGrades,
            gradeCategoryDTO.courseId,
            gradeCategoryDTO._id,
            gradeCategoryDTO.remainingGrades,
            gradeCategoryDTO.currentAverage,
            gradeCategoryDTO.guarenteedAverage,
            gradeCategoryDTO.potentialAverage,
            gradeCategoryDTO.grades && gradeCategoryDTO.grades.map((g) => toGrade(g))
        );
    }

    private toGradeCategoryDTO(gradeCategory: GradeCategory): GradeCategoryDTO {
        return {
            title: gradeCategory.title,
            percentage: gradeCategory.percentage,
            numberOfGrades: gradeCategory.numberOfGrades,
            courseId: gradeCategory.courseId,
            remainingGrades: gradeCategory.remainingGrades,
            currentAverage: gradeCategory.currentAverage,
            guarenteedAverage: gradeCategory.guarenteedAverage,
            potentialAverage: gradeCategory.potentialAverage,
            _id: gradeCategory.id,
            grades: gradeCategory.grades && gradeCategory.grades.map((g) => toGradeDTO(g))
        };
    }

}
