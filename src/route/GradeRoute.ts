import { Application } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { GradeController } from "../controller/GradeController";
import { auth } from "../util/Auth";
import { RegistrableRoute } from "./RegistrableRoute";

@injectable()
export class GradeRoute implements RegistrableRoute {

    @inject(TYPES.GradeController)
    private gradeController: GradeController;

    public register(app: Application) {
        app.route("/api/grades/gradeCategory/:gradeCategoryId")
        .get(auth.required, this.gradeController.getAllGrades)
        .post(auth.required, this.gradeController.createGrade);

        app.route("/api/grades/:gradeId")
        .get(auth.required, this.gradeController.getGrade)
        .put(auth.required, this.gradeController.updateGrade)
        .delete(auth.required, this.gradeController.deleteGrade);
    }
}
