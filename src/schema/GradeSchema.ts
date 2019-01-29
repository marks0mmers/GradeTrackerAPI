import { Collection, Core, Index, Instance, Model, ObjectID, Property } from "iridium";

export interface GradeDTO {
    _id?: string;
    name: string;
    grade: number;
    gradeCategoryId: string;
}

@Index({name: 1})
@Collection("grades")
export class GradeMongoSchema extends Instance<GradeDTO, GradeMongoSchema> {
    @ObjectID
    // tslint:disable-next-line:variable-name
    public _id?: string;

    @Property(String, true)
    public name: string;

    @Property(Number, true)
    public grade: number;

    @Property(String, true)
    public gradeCategoryId: string;
}

// tslint:disable-next-line:max-classes-per-file
class GradeDatabase extends Core {
    public Grades = new Model<GradeDTO, GradeMongoSchema>(this, GradeMongoSchema);
}

export const gradeDatabase = new GradeDatabase({database: "grade_tracker"});
