import { Application } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { RoleController } from "../controller/RoleController";
import { userHasRole } from "../middleware/RoleMiddleware";
import { auth } from "../util/Auth";
import { RegistrableRoute } from "./RegistrableRoute";

@injectable()
export class RoleRoute implements RegistrableRoute {

    @inject(TYPES.RoleController)
    private roleController: RoleController;

    public register(app: Application) {
        app.route("/api/roles/user/:userId")
        .get(auth.required, userHasRole("admin"), this.roleController.getAllRoles)
        .post(auth.required, userHasRole("admin"), this.roleController.createRole);

        app.route("/api/roles/:roleId")
        .get(auth.required, userHasRole("admin"), this.roleController.getRole)
        .put(auth.required, userHasRole("admin"), this.roleController.updateRole)
        .delete(auth.required, userHasRole("admin"), this.roleController.deleteRole);
    }
}
