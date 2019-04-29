import { Container } from "inversify";
import { makeLoggerMiddleware } from "inversify-logger-middleware";
import { CourseRepository, CourseRepositoryImpl } from "../repository/CourseRepository";
import { GradeCategoryRepository, GradeCategoryRepositoryImpl } from "../repository/GradeCategoryRepository";
import { GradeRepository, GradeRepositoryImpl } from "../repository/GradeRepository";
import { RoleRepository, RoleRepositoryImpl } from "../repository/RoleRepository";
import { UserRepository, UserRepositoryImpl } from "../repository/UserRepository";
import { CourseService, CourseServiceImpl } from "../service/CourseService";
import { GradeCategoryService, GradeCategoryServiceImpl } from "../service/GradeCategoryService";
import { GradeService, GradeServiceImpl } from "../service/GradeService";
import { RoleService, RoleServiceImpl } from "../service/RoleService";
import { UserService, UserServiceImpl } from "../service/UserService";
import TYPES from "./types";

const container = new Container();

container.bind<CourseService>(TYPES.CourseService).to(CourseServiceImpl);
container.bind<CourseRepository>(TYPES.CourseRepository).to(CourseRepositoryImpl);

container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

container.bind<RoleService>(TYPES.RoleService).to(RoleServiceImpl);
container.bind<RoleRepository>(TYPES.RoleRepository).to(RoleRepositoryImpl);

container.bind<GradeCategoryService>(TYPES.GradeCategoryService).to(GradeCategoryServiceImpl);
container.bind<GradeCategoryRepository>(TYPES.GradeCategoryRepository).to(GradeCategoryRepositoryImpl);

container.bind<GradeService>(TYPES.GradeService).to(GradeServiceImpl);
container.bind<GradeRepository>(TYPES.GradeRepository).to(GradeRepositoryImpl);

export default container;
