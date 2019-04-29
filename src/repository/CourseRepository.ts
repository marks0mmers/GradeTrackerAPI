import { injectable } from "inversify";
import { courseDatabase, CourseDocument, CourseDTO } from "../schema/CourseSchema";

export interface CourseRepository {
    findAll(): Promise<CourseDTO[]>;
    find(id: string): Promise<CourseDTO>;
    create(courseDTO: CourseDTO): Promise<CourseDTO>;
    update(courseDTO: CourseDTO): Promise<CourseDTO>;
    delete(id: string): Promise<CourseDTO>;
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
        return await courseDatabase.findByIdAndUpdate(courseDTO._id, courseDTO, (err: Error, res: CourseDocument) => res);
    }

    public async delete(courseId: string): Promise<CourseDTO> {
        return await courseDatabase.findByIdAndRemove({_id: courseId});
    }

}
