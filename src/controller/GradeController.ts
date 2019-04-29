import { NextFunction, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import TYPES from "../config/types";
import { Grade } from "../model/Grade";
import { GradeService } from "../service/GradeService";
import { auth } from "../util/Auth";
import { UserRequest } from "../util/Request";

@controller("/grades", auth.required)
export class GradeController {

    @inject(TYPES.GradeService)
    private gradeService: GradeService;

    @httpGet("/gradeCategory/:gradeCategoryId")
    public async getAllGrades(req: UserRequest, res: Response, next: NextFunction) {
        const gradeCategoryId: string = req.params.gradeCategoryId;
        try {
            const grades = await this.gradeService.getGradesFromCategory(gradeCategoryId);
            res.json(grades);
        } catch (err) {
            next(err);
        }
    }

    @httpGet("/:gradeId")
    public async getGrade(req: UserRequest, res: Response, next: NextFunction) {
        const gradeId: string = req.params.gradeId;
        try {
            const grade = await this.gradeService.getGrade(gradeId);
            res.json(grade);
        } catch (err) {
            next(err);
        }
    }

    @httpPost("/gradeCategory/:gradeCategoryId")
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

    @httpPut("/:gradeId")
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

    @httpDelete("/:gradeId")
    public async deleteGrade(req: UserRequest, res: Response, next: NextFunction) {
        const gradeId = req.params.gradeId;
        try {
            const deletedGrade = await this.gradeService.deleteGrade(gradeId);
            if (deletedGrade) {
                res.json(deletedGrade);
            } else {
                res.status(404).json({message: "Cannot find grade"});
            }
        } catch (err) {
            next(err);
        }
    }

}
