import { Application } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { GradeCategoryController } from "../controller/GradeCategoryController";
import { auth } from "../util/Auth";
import { RegistrableRoute } from "./RegistrableRoute";

@injectable()
export class GradeCategoryRoute implements RegistrableRoute {

    @inject(TYPES.GradeCategoryController)
    private gradeCategoryController: GradeCategoryController;

    public register(app: Application) {
        app.route("/api/gradeCategories")
        .get(auth.required, this.gradeCategoryController.getAllForCurrentUser);

        app.route("/api/gradeCategories/course/:courseId")
        .get(auth.required, this.gradeCategoryController.getAllByCourse)
        .post(auth.required, this.gradeCategoryController.create);

        app.route("/api/gradeCategories/:id")
        .get(auth.required, this.gradeCategoryController.getOne)
        .put(auth.required, this.gradeCategoryController.update)
        .delete(auth.required, this.gradeCategoryController.delete);
    }
}
