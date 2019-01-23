import { Container } from "inversify";
import "reflect-metadata";
import { CourseController, CourseControllerImpl } from "../controller/CourseController";
import { UserController, UserControllerImpl } from "../controller/UserController";
import { CourseRepository, CourseRepositoryImpl } from "../repository/CourseRepository";
import { UserRepository, UserRepositoryImpl } from "../repository/UserRepository";
import { CourseRoute } from "../Route/CourseRoute";
import { RegistrableRoute } from "../Route/RegistrableRoute";
import { UserRoute } from "../Route/UserRoute";
import { CourseService, CourseServiceImpl } from "../service/CourseService";
import { UserService, UserServiceImpl } from "../service/UserService";
import TYPES from "./types";

const container = new Container();

container.bind<RegistrableRoute>(TYPES.Route).to(CourseRoute);
container.bind<RegistrableRoute>(TYPES.Route).to(UserRoute);

container.bind<CourseController>(TYPES.CourseContoller).to(CourseControllerImpl);
container.bind<CourseService>(TYPES.CourseService).to(CourseServiceImpl);
container.bind<CourseRepository>(TYPES.CourseRepository).to(CourseRepositoryImpl);

container.bind<UserController>(TYPES.UserController).to(UserControllerImpl);
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

export default container;
