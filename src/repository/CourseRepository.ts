import { injectable } from "inversify";
import { courseDatabase, CourseDTO, CourseMongoSchema } from "../schema/CourseSchema";
import logger from "../util/Logger";

export interface CourseRepository {
    findAll(): Promise<CourseDTO[]>;
    find(id: string): Promise<CourseDTO>;
    create(courseDTO: CourseDTO): Promise<CourseDTO>;
    update(courseDTO: CourseDTO): Promise<CourseDTO>;
    delete(id: string): Promise<string>;
}

@injectable()
export class CourseRepositoryImpl implements CourseRepository {

    public async findAll(): Promise<CourseDTO[]> {
        const courseDTOs = await courseDatabase.connect().then(() => courseDatabase.Courses.find());
        return courseDTOs.toArray();
    }

    public async find(id: string): Promise<CourseDTO> {
        return await courseDatabase.connect().then(() => courseDatabase.Courses.findOne(id));
    }

    public async create(courseDTO: CourseDTO): Promise<CourseDTO> {
        return await courseDatabase.connect().then(() => courseDatabase.Courses.create(courseDTO));
    }

    public async update(courseDTO: CourseDTO): Promise<CourseDTO> {
        const dto: CourseMongoSchema = await courseDatabase.connect().then(() => courseDatabase.Courses.findOne(courseDTO._id));

        dto.title = courseDTO.title;
        dto.description = courseDTO.description;
        dto.section = courseDTO.section;
        dto.creditHours = courseDTO.creditHours;

        const saved = await dto.save((err: Error, c: CourseDTO) => {
            if (err) {
                logger.error("Error updating course: " + err);
                throw err;
            }
            return c;
        });

        return saved;
    }

    public async delete(courseId: string): Promise<string> {
        return await courseDatabase.connect().then(() => courseDatabase.Courses.remove({_id: courseId})).then((numberOfDeleted: number) => {
            return numberOfDeleted > 0 ? "Course Successfully Deleted" : "Course doesn't exist";
        });
    }

}
