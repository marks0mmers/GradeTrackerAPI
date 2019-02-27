import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { GradeCategory } from "../model/GradeCategory";
import { User } from "../model/User";
import { GradeCategoryService } from "../service/GradeCategoryService";
import { UserService } from "../service/UserService";
import { UserRequest } from "../util/Request";

export interface GradeCategoryController {
    getAllByCourse(req: UserRequest, res: Response, next: NextFunction): void;
    getOne(req: UserRequest, res: Response, next: NextFunction): void;
    create(req: UserRequest, res: Response, next: NextFunction): void;
    update(req: UserRequest, res: Response, next: NextFunction): void;
    delete(req: UserRequest, res: Response, next: NextFunction): void;
}

@injectable()
export class GradeCategoryControllerImpl implements GradeCategoryController {

    private gradeCategoryService: GradeCategoryService;

    private userService: UserService;

    constructor(
        @inject(TYPES.GradeCategoryService) gradeCategoryService: GradeCategoryService,
        @inject(TYPES.UserService) userService: UserService
    ) {
        this.gradeCategoryService = gradeCategoryService;
        this.userService = userService;

        this.getAllByCourse = this.getAllByCourse.bind(this);
        this.getOne = this.getOne.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async getAllByCourse(req: UserRequest, res: Response, next: NextFunction) {
        const courseId = req.params.courseId;
        try {
            const gradeCategories = await this.gradeCategoryService.getAll(courseId);
            res.json(gradeCategories);
        } catch (err) {
            next(err);
        }
    }
    public async getOne(req: UserRequest, res: Response, next: NextFunction) {
        const categoryId = req.params.id;
        try {
            const gradeCategory = await this.gradeCategoryService.getOne(categoryId);
            res.json(gradeCategory);
        } catch (err) {
            next(err);
        }
    }
    public async create(req: UserRequest, res: Response, next: NextFunction) {

        const gradeCategory = new GradeCategory(
            req.body.title,
            req.body.percentage,
            req.body.numberOfGrades,
            req.payload.id,
            req.params.courseId
        );

        try {
            const createdCategory = await this.gradeCategoryService.create(gradeCategory);
            res.json(createdCategory);
        } catch (err) {
            next(err);
        }
    }
    public async update(req: UserRequest, res: Response, next: NextFunction) {
        const gradeCategory = new GradeCategory(
            req.body.title,
            req.body.percentage,
            req.body.numberOfGrades,
            req.payload.id,
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
