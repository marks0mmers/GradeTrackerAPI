import { Collection, Core, Index, Instance, Model, ObjectID, Property } from "iridium";

export interface CourseDTO {
    _id?: string;
    title: string;
    description: string;
    section: number;
    creditHours: number;
    userId: string;
}

@Index({name: 1})
@Collection("courses")
export class CourseMongoSchema extends Instance<CourseDTO, CourseMongoSchema> implements CourseDTO {

    @ObjectID
    // tslint:disable-next-line:variable-name
    public _id?: string;

    @Property(String, true)
    public title: string;

    @Property(String, true)
    public description: string;

    @Property(Number, true)
    public section: number;

    @Property(Number, true)
    public creditHours: number;

    @Property(String, true)
    public userId: string;

}

// tslint:disable-next-line:max-classes-per-file
class CourseDatabase extends Core {
    public Courses = new Model<CourseDTO, CourseMongoSchema>(this, CourseMongoSchema);
}

export const courseDatabase = new CourseDatabase({database: "grade_tracker"});
