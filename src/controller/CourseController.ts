import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Course } from "../model/Course";
import { User } from "../model/User";
import { CourseService } from "../service/CourseService";
import { UserService } from "../service/UserService";
import { UserRequest } from "../util/Request";

export interface CourseController {
    getCoursesCurrentUser(req: UserRequest, res: Response, next: NextFunction): void;
    getCourse(req: UserRequest, res: Response, next: NextFunction): void;
    newCourse(req: UserRequest, res: Response, next: NextFunction): void;
    updateCourse(req: UserRequest, res: Response, next: NextFunction): void;
    deleteCourse(req: UserRequest, res: Response, next: NextFunction): void;
    getCoursesByUser(req: UserRequest, res: Response, next: NextFunction): void;
}

@injectable()
export class CourseControllerImpl implements CourseController {

    private courseService: CourseService;

    private userService: UserService;

    constructor(
        @inject(TYPES.CourseService) courseService: CourseService,
        @inject(TYPES.UserService) userService: UserService
    ) {
        this.courseService = courseService;
        this.userService = userService;

        this.getCoursesCurrentUser = this.getCoursesCurrentUser.bind(this);
        this.getCoursesByUser = this.getCoursesByUser.bind(this);
        this.getCourse = this.getCourse.bind(this);
        this.newCourse = this.newCourse.bind(this);
        this.updateCourse = this.updateCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    public async getCoursesCurrentUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courses = await this.courseService.getCoursesByUser(req.payload.id);
            res.json(courses);
        } catch (err) {
            next(err);
        }
    }
    public async getCourse(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const course = await this.courseService.getCourse(req.params.id as string);
            res.json(course);
        } catch (err) {
            next(err);
        }
    }
    public async newCourse(req: UserRequest, res: Response, next: NextFunction) {
        let user: User;
        try {
            user = await this.userService.getUser(req.payload.id);
        } catch (err) {
            next(err);
        }

        const course = new Course(
            req.body.title,
            req.body.description,
            req.body.section,
            req.body.creditHours,
            user.id
        );
        try {
            const createdCourse = await this.courseService.createCourse(course);
            res.json(createdCourse);
        } catch (err) {
            next(err);
        }
    }
    public async updateCourse(req: UserRequest, res: Response, next: NextFunction) {
        const course = new Course(
            req.body.title,
            req.body.description,
            req.body.section,
            req.body.creditHours,
            req.payload.id,
            req.params.id
        );

        try {
            const updatedCourse = await this.courseService.updateCourse(course);
            res.json(updatedCourse);
        } catch (err) {
            next(err);
        }
    }
    public async deleteCourse(req: UserRequest, res: Response, next: NextFunction) {
        const id: string = req.params.id;
        try {
            const deletedCourse = await this.courseService.deleteCourse(id);
            if (deletedCourse) {
                res.json(deletedCourse);
            } else {
                res.status(404).json({message: "Cannot Find Course"});
            }
        } catch (err) {
            next(err);
        }
    }

    public async getCoursesByUser(req: UserRequest, res: Response, next: NextFunction) {
        const { userId } = req.params;
        let user: User;
        try {
            user = await this.userService.getUser(req.params.id);
        } catch (err) {
            next(err);
        }
        if (user.id.toString() === userId) {
            const courses = await this.courseService.getCoursesByUser(userId);
            res.json(courses);
        } else {
            res.status(401).json({message: "You are not allowed to perform this action"});
        }
    }

}
