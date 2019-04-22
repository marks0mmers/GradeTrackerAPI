import { Application } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { CourseController } from "../controller/CourseController";
import { userHasRole } from "../middleware/RoleMiddleware";
import { auth } from "../util/Auth";
import { RegistrableRoute } from "./RegistrableRoute";

@injectable()
export class CourseRoute implements RegistrableRoute {
    @inject(TYPES.CourseContoller)
    private courseController: CourseController;

    public register(app: Application): void {
        app.route("/api/courses")
        .get(auth.required, this.courseController.getCoursesCurrentUser)
        .post(auth.required, this.courseController.newCourse);

        app.route("/api/courses/:id")
        .get(auth.required, this.courseController.getCourse)
        .put(auth.required, this.courseController.updateCourse)
        .delete(auth.required, this.courseController.deleteCourse);

        app.route("/api/courses/user/:userId")
        .get(auth.required, userHasRole("admin"), this.courseController.getCoursesByUser);
    }

}
