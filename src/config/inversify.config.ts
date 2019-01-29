import { Container } from "inversify";
import "reflect-metadata";
import { CourseController, CourseControllerImpl } from "../controller/CourseController";
import { GradeCategoryController, GradeCategoryControllerImpl } from "../controller/GradeCategoryController";
import { GradeController, GradeControllerImpl } from "../controller/GradeController";
import { UserController, UserControllerImpl } from "../controller/UserController";
import { CourseRepository, CourseRepositoryImpl } from "../repository/CourseRepository";
import { GradeCategoryRepository, GradeCategoryRepositoryImpl } from "../repository/GradeCategoryRepository";
import { GradeRepository, GradeRepositoryImpl } from "../repository/GradeRepository";
import { UserRepository, UserRepositoryImpl } from "../repository/UserRepository";
import { CourseRoute } from "../Route/CourseRoute";
import { GradeCategoryRoute } from "../route/GradeCategoryRoute";
import { GradeRoute } from "../route/GradeRoute";
import { RegistrableRoute } from "../Route/RegistrableRoute";
import { UserRoute } from "../Route/UserRoute";
import { CourseService, CourseServiceImpl } from "../service/CourseService";
import { GradeCategoryService, GradeCategoryServiceImpl } from "../service/GradeCategoryService";
import { GradeService, GradeServiceImpl } from "../service/GradeService";
import { UserService, UserServiceImpl } from "../service/UserService";
import TYPES from "./types";

const container = new Container();

container.bind<RegistrableRoute>(TYPES.Route).to(CourseRoute);
container.bind<RegistrableRoute>(TYPES.Route).to(UserRoute);
container.bind<RegistrableRoute>(TYPES.Route).to(GradeCategoryRoute);
container.bind<RegistrableRoute>(TYPES.Route).to(GradeRoute);

container.bind<CourseController>(TYPES.CourseContoller).to(CourseControllerImpl);
container.bind<CourseService>(TYPES.CourseService).to(CourseServiceImpl);
container.bind<CourseRepository>(TYPES.CourseRepository).to(CourseRepositoryImpl);

container.bind<UserController>(TYPES.UserController).to(UserControllerImpl);
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

container.bind<GradeCategoryController>(TYPES.GradeCategoryController).to(GradeCategoryControllerImpl);
container.bind<GradeCategoryService>(TYPES.GradeCategoryService).to(GradeCategoryServiceImpl);
container.bind<GradeCategoryRepository>(TYPES.GradeCategoryRepository).to(GradeCategoryRepositoryImpl);

container.bind<GradeController>(TYPES.GradeController).to(GradeControllerImpl);
container.bind<GradeService>(TYPES.GradeService).to(GradeServiceImpl);
container.bind<GradeRepository>(TYPES.GradeRepository).to(GradeRepositoryImpl);

export default container;
