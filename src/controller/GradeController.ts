import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Grade } from "../model/Grade";
import { GradeService } from "../service/GradeService";
import { UserRequest } from "../util/Request";

export interface GradeController {
    getAllGrades(req: UserRequest, res: Response, next: NextFunction): void;
    getGrade(req: UserRequest, res: Response, next: NextFunction): void;
    createGrade(req: UserRequest, res: Response, next: NextFunction): void;
    updateGrade(req: UserRequest, res: Response, next: NextFunction): void;
    deleteGrade(req: UserRequest, res: Response, next: NextFunction): void;
}

@injectable()
export class GradeControllerImpl implements GradeController {

    private gradeService: GradeService;

    constructor(
        @inject(TYPES.GradeService) gradeService: GradeService
    ) {
        this.gradeService = gradeService;

        this.createGrade = this.createGrade.bind(this);
        this.deleteGrade = this.deleteGrade.bind(this);
        this.getAllGrades = this.getAllGrades.bind(this);
        this.getGrade = this.getGrade.bind(this);
        this.updateGrade = this.updateGrade.bind(this);
    }

    public async getAllGrades(req: UserRequest, res: Response, next: NextFunction) {
        const gradeCategoryId: string = req.params.gradeCategoryId;
        try {
            const grades = await this.gradeService.getGradesFromCategory(gradeCategoryId);
            res.json(grades);
        } catch (err) {
            next(err);
        }
    }
    public async getGrade(req: UserRequest, res: Response, next: NextFunction) {
        const gradeId: string = req.params.gradeId;
        try {
            const grade = await this.gradeService.getGrade(gradeId);
            res.json(grade);
        } catch (err) {
            next(err);
        }
    }
    public async createGrade(req: UserRequest, res: Response, next: NextFunction) {
        const grade = new Grade(
            req.body.name,
            req.body.grade,
            req.params.gradeCategoryId
        );
        try {
            const createdGrade = await this.gradeService.newGrade(grade);
            res.json(createdGrade);
        } catch (err) {
            next(err);
        }
    }
    public async updateGrade(req: UserRequest, res: Response, next: NextFunction) {
        const grade = new Grade(
            req.body.name,
            req.body.grade,
            req.body.gradeCategoryId,
            req.params.gradeId
        );
        try {
            const updatedGrade = await this.gradeService.updateGrade(grade);
            res.json(updatedGrade);
        } catch (err) {
            next(err);
        }
    }
    public async deleteGrade(req: UserRequest, res: Response, next: NextFunction) {
        const gradeId = req.params.gradeId;
        try {
            const deletedMessage = await this.gradeService.deleteGrade(gradeId);
            if (deletedMessage === "Grade successfully deleted") {
                res.json(deletedMessage);
            } else {
                res.status(404).json(deletedMessage);
            }
        } catch (err) {
            next(err);
        }
    }

}
