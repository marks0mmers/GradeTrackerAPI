import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Course, toCourse, toCourseDTO } from "./course.model";
import { CourseRepository } from "./course.repository";
import { CourseDTO } from "./course.schema";

export interface CourseManager {
    getCourses(): Promise<Course[]>;
    getCourse(id: string): Promise<Course>;
    createCourse(course: Course): Promise<Course>;
    updateCourse(course: Course): Promise<Course>;
    deleteCourse(id: string): Promise<Course>;
    getCoursesByUser(id: string): Promise<Course[]>;
}

@injectable()
export class CourseManagerImpl implements CourseManager {

    @inject(TYPES.CourseRepository)
    private courseRepository: CourseRepository;

    public async getCourses(): Promise<Course[]> {
        return await this.courseRepository.findAll().then((c: CourseDTO[]) => c.map((course: CourseDTO) => {
            return toCourse(course);
        }));
    }

    public async getCoursesByUser(id: string): Promise<Course[]> {
        return await this.courseRepository.findByUser(id).then((c: CourseDTO[]) => {
            return c.map((course: CourseDTO) => toCourse(course));
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
