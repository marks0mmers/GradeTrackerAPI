import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Grade } from "../model/Grade";
import { GradeRepository } from "../repository/GradeRepository";
import { GradeDTO } from "../schema/GradeSchema";

export interface GradeService {
    getGradesFromCategory(gradeCategoryId: string): Promise<Grade[]>;
    getGrade(gradeId: string): Promise<Grade>;
    newGrade(grade: Grade): Promise<Grade>;
    updateGrade(grade: Grade): Promise<Grade>;
    deleteGrade(gradeId: string): Promise<string>;
}

@injectable()
export class GradeServiceImpl implements GradeService {

    @inject(TYPES.GradeRepository)
    private gradeRepository: GradeRepository;

    public async getGradesFromCategory(gradeCategoryId: string): Promise<Grade[]> {
        return await this.gradeRepository.findAll()
            .then((dtos: GradeDTO[]) => dtos.map((dto) => this.toGrade(dto)))
            .then((grades: Grade[]) => grades.filter((grade: Grade) => grade.gradeCategoryId === gradeCategoryId));
    }

    public async getGrade(gradeId: string): Promise<Grade> {
        return await this.gradeRepository.find(gradeId)
            .then((grade: GradeDTO) => this.toGrade(grade));
    }

    public async newGrade(grade: Grade): Promise<Grade> {
        const newGrade = this.toGradeDTO(grade);
        return await this.gradeRepository.create(newGrade)
            .then((createdGrade: GradeDTO) => this.toGrade(createdGrade));
    }

    public async updateGrade(grade: Grade): Promise<Grade> {
        const newGrade = this.toGradeDTO(grade);
        return await this.gradeRepository.update(newGrade)
            .then((createdGrade: GradeDTO) => this.toGrade(createdGrade));
    }

    public async deleteGrade(gradeId: string): Promise<string> {
        return await this.gradeRepository.delete(gradeId);
    }

    private toGrade(gradeDTO: GradeDTO): Grade {
        return new Grade(
            gradeDTO.name,
            gradeDTO.grade,
            gradeDTO.gradeCategoryId,
            gradeDTO._id
        );
    }

    private toGradeDTO(grade: Grade): GradeDTO {
        return {
            _id: grade.id,
            name: grade.name,
            grade: grade.grade,
            gradeCategoryId: grade.gradeCategoryId
        };
    }

}
