import { NextFunction, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import TYPES from "../config/types";
import { userHasRole } from "../middleware/RoleMiddleware";
import { Course } from "../model/Course";
import { User } from "../model/User";
import { CourseService } from "../service/CourseService";
import { UserService } from "../service/UserService";
import { auth } from "../util/Auth";
import { UserRequest } from "../util/Request";

@controller("/courses", auth.required)
export class CourseController {

    @inject(TYPES.CourseService)
    private courseService: CourseService;

    @inject(TYPES.UserService)
    private userService: UserService;

    @httpGet("/")
    public async getCoursesCurrentUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courses = await this.courseService.getCoursesByUser(req.payload.id);
            res.json(courses);
        } catch (err) {
            next(err);
        }
    }

    @httpGet("/:id")
    public async getCourse(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const course = await this.courseService.getCourse(req.params.id as string);
            res.json(course);
        } catch (err) {
            next(err);
        }
    }

    @httpPost("/")
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

    @httpPut("/:id")
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

    @httpDelete("/:id")
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

    @httpGet("/user/:userId", auth.required, userHasRole("admin"))
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
