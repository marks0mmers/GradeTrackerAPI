import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Course } from "../model/Course";
import { User } from "../model/User";
import { CourseService } from "../service/CourseService";
import { UserService } from "../service/UserService";
import { UserRequest } from "../util/Request";

export interface CourseController {
    getAllCourses(req: UserRequest, res: Response, next: NextFunction): void;
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

        this.getAllCourses = this.getAllCourses.bind(this);
        this.getCoursesByUser = this.getCoursesByUser.bind(this);
        this.getCourse = this.getCourse.bind(this);
        this.newCourse = this.newCourse.bind(this);
        this.updateCourse = this.updateCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    public async getAllCourses(req: UserRequest, res: Response, next: NextFunction) {
        let user: User;
        try {
            user = await this.userService.getUser(req.payload.id);
        } catch (err) {
            next(err);
        }
        try {
            const courses = await this.courseService.getCourses()
                .then((values: Course[]) => values.filter((value: Course) => user.getIsAdmin || value.getUserId === user.getId));
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
            user.getId
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
            if (deletedCourse === "Course Successfully Deleted") {
                res.json(deletedCourse);
            } else {
                res.status(404).json(deletedCourse);
            }
        } catch (err) {
            next(err);
        }
    }

    public async getCoursesByUser(req: UserRequest, res: Response, next: NextFunction) {
        const { userId } = req.params;
        let loggedIn: User;
        try {
            loggedIn = await this.userService.getUser(req.payload.id);
        } catch (err) {
            next(err);
        }
        if (loggedIn.getIsAdmin) {
            const courses = await this.courseService.getCoursesByUser(userId);
            res.json(courses);
        } else {
            res.status(401).json({message: "You are not allowed to perform this action"});
        }
    }

}
