import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Course, toCourse, toCourseDTO } from "../model/Course";
import { CourseRepository } from "../repository/CourseRepository";
import { CourseDTO } from "../schema/CourseSchema";

export interface CourseService {
    getCourses(): Promise<Course[]>;
    getCourse(id: string): Promise<Course>;
    createCourse(course: Course): Promise<Course>;
    updateCourse(course: Course): Promise<Course>;
    deleteCourse(id: string): Promise<Course>;
    getCoursesByUser(id: string): Promise<Course[]>;
}

@injectable()
export class CourseServiceImpl implements CourseService {

    @inject(TYPES.CourseRepository)
    private courseRepository: CourseRepository;

    public async getCourses(): Promise<Course[]> {
        return await this.courseRepository.findAll().then((c: CourseDTO[]) => c.map((course: CourseDTO) => {
            return toCourse(course);
        }));
    }

    public async getCoursesByUser(id: string): Promise<Course[]> {
        return await this.courseRepository.findAll().then((c: CourseDTO[]) => {
            return c.map((course: CourseDTO) => toCourse(course))
                .filter((course: Course) => course.userId === id);
        });
    }

    public async getCourse(id: string): Promise<Course> {
        return await this.courseRepository.find(id).then((c: CourseDTO) => {
            return toCourse(c);
        });
    }

    public async createCourse(course: Course): Promise<Course> {
        const courseDTO = toCourseDTO(course);
        return await this.courseRepository.create(courseDTO).then((c: CourseDTO) => {
            return toCourse(c);
        });
    }

    public async updateCourse(course: Course): Promise<Course> {
        const courseDTO = toCourseDTO(course);
        return await this.courseRepository.update(courseDTO).then((c: CourseDTO) => {
            return toCourse(c);
        });
    }

    public async deleteCourse(id: string): Promise<Course> {
        return await this.courseRepository.delete(id).then((c: CourseDTO) => {
            return toCourse(c);
        });
    }

}
