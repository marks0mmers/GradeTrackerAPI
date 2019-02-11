import { injectable } from "inversify";
import { courseDatabase, CourseDTO } from "../schema/CourseSchema";
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
        return await courseDatabase.find();
    }

    public async find(id: string): Promise<CourseDTO> {
        return await courseDatabase.findById(id);
    }

    public async create(courseDTO: CourseDTO): Promise<CourseDTO> {
        return await courseDatabase.create(courseDTO);
    }

    public async update(courseDTO: CourseDTO): Promise<CourseDTO> {
        const dto = await courseDatabase.findById(courseDTO._id);

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
        const numberOfDeleted =  await courseDatabase.findByIdAndRemove({_id: courseId});
        return numberOfDeleted ? "Course Successfully Deleted" : "Course doesn't exist";
    }

}
