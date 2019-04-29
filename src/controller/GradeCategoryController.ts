import { NextFunction, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import TYPES from "../config/types";
import { GradeCategory } from "../model/GradeCategory";
import { GradeCategoryService } from "../service/GradeCategoryService";
import { auth } from "../util/Auth";
import { UserRequest } from "../util/Request";

@controller("/gradeCategories", auth.required)
export class GradeCategoryController {

    @inject(TYPES.GradeCategoryService)
    private gradeCategoryService: GradeCategoryService;

    @httpGet("/")
    public async getAllForCurrentUser(req: UserRequest, res: Response, next: NextFunction) {
        const userId = req.payload.id;
        try {
            const gradeCategories = await this.gradeCategoryService.getAllForUser(userId);
            res.json(gradeCategories);
        } catch (err) {
            next(err);
        }
    }

    @httpGet("/course/:courseId")
    public async getAllByCourse(req: UserRequest, res: Response, next: NextFunction) {
        const courseId = req.params.courseId;
        try {
            const gradeCategories = await this.gradeCategoryService.getAll(courseId);
            res.json(gradeCategories);
        } catch (err) {
            next(err);
        }
    }

    @httpGet("/:id")
    public async getOne(req: UserRequest, res: Response, next: NextFunction) {
        const categoryId = req.params.id;
        try {
            const gradeCategory = await this.gradeCategoryService.getOne(categoryId);
            res.json(gradeCategory);
        } catch (err) {
            next(err);
        }
    }

    @httpPost("/course/:courseId")
    public async create(req: UserRequest, res: Response, next: NextFunction) {

        const gradeCategory = new GradeCategory(
            req.body.title,
            req.body.percentage,
            req.body.numberOfGrades,
            req.params.courseId
        );

        try {
            const createdCategory = await this.gradeCategoryService.create(gradeCategory);
            res.json(createdCategory);
        } catch (err) {
            next(err);
        }
    }

    @httpPut("/:id")
    public async update(req: UserRequest, res: Response, next: NextFunction) {
        const gradeCategory = new GradeCategory(
            req.body.title,
            req.body.percentage,
            req.body.numberOfGrades,
            req.body.courseId,
            req.params.id
        );

        try {
            const createdCategory = await this.gradeCategoryService.update(gradeCategory);
            res.json(createdCategory);
        } catch (err) {
            next(err);
        }
    }

    @httpDelete("/:id")
    public async delete(req: UserRequest, res: Response, next: NextFunction) {
        const id: string = req.params.id;
        try {
            const deletedCourse = await this.gradeCategoryService.delete(id);
            if (deletedCourse) {
                res.json(deletedCourse);
            } else {
                res.status(404).json({message: "Grade Category Not Found"});
            }
        } catch (err) {
            next(err);
        }
    }

}
