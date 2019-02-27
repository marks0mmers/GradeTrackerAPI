import { inject, injectable } from "inversify";
import TYPES from "../config/types";
import { Course } from "../model/Course";
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
            return this.toCourse(course);
        }));
    }

    public async getCoursesByUser(id: string): Promise<Course[]> {
        return await this.courseRepository.findAll().then((c: CourseDTO[]) => {
            return c.map((course: CourseDTO) => this.toCourse(course))
                .filter((course: Course) => course.userId === id);
        });
    }

    public async getCourse(id: string): Promise<Course> {
        return await this.courseRepository.find(id).then((c: CourseDTO) => {
            return this.toCourse(c);
        });
    }

    public async createCourse(course: Course): Promise<Course> {
        const courseDTO = this.toCourseDTO(course);
        return await this.courseRepository.create(courseDTO).then((c: CourseDTO) => {
            return this.toCourse(c);
        });
    }

    public async updateCourse(course: Course): Promise<Course> {
        const courseDTO = this.toCourseDTO(course);
        return await this.courseRepository.update(courseDTO).then((c: CourseDTO) => {
            return this.toCourse(c);
        });
    }

    public async deleteCourse(id: string): Promise<Course> {
        return await this.courseRepository.delete(id).then((c: CourseDTO) => {
            return this.toCourse(c);
        });
    }

    private toCourseDTO(course: Course): CourseDTO {
        return {
            title: course.title,
            description: course.description,
            section: course.section,
            creditHours: course.creditHours,
            userId: course.userId,
            _id: course.id
        };
    }

    private toCourse(courseDTO: CourseDTO): Course {
        return new Course(
            courseDTO.title,
            courseDTO.description,
            courseDTO.section,
            courseDTO.creditHours,
            courseDTO.userId,
            courseDTO._id.toString()
        );
    }

}
