import { Application } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { CourseController } from "../controller/CourseController";
import { auth } from "../util/Auth";
import { RegistrableRoute } from "./RegistrableRoute";

@injectable()
export class CourseRoute implements RegistrableRoute {
    @inject(TYPES.CourseContoller)
    private courseController: CourseController;

    public register(app: Application): void {
        app.route("/courses")
        .get(auth.required, this.courseController.getAllCourses)
        .post(auth.required, this.courseController.newCourse);

        app.route("/courses/:id")
        .get(auth.required, this.courseController.getCourse)
        .put(auth.required, this.courseController.updateCourse)
        .delete(auth.required, this.courseController.deleteCourse);
    }

}
