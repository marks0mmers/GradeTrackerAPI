import { Collection, Core, Index, Instance, Model, ObjectID, Property } from "iridium";

export interface GradeCategoryDTO {
    _id?: string;
    title: string;
    percentage: number;
    numberOfGrades: number;
    remainingGrades?: number;
    currentAverage?: number;
    guarenteedAverage?: number;
    potentialAverage?: number;
    userId: string;
    courseId: string;
}

@Index({name: 1})
@Collection("grade-categories")
export class GradeCategoryMongoSchema extends Instance<GradeCategoryDTO, GradeCategoryMongoSchema> implements GradeCategoryDTO {

    @ObjectID
    // tslint:disable-next-line:variable-name
    public _id?: string;

    @Property(String, true)
    public title: string;

    @Property(Number, true)
    public percentage: number;

    @Property(Number, true)
    public numberOfGrades: number;

    @Property(Number, false)
    public remainingGrades?: number;

    @Property(Number, false)
    public currentAverage?: number;

    @Property(Number, false)
    public guarenteedAverage?: number;

    @Property(Number, false)
    public potentialAverage?: number;

    @Property(String, true)
    public userId: string;

    @Property(String, true)
    public courseId: string;

}

// tslint:disable-next-line: max-classes-per-file
class GradeCategoryDatabase extends Core {
    public GradeCategories = new Model<GradeCategoryDTO, GradeCategoryMongoSchema>(this, GradeCategoryMongoSchema);
}

export const gradeCategoryDatabase = new GradeCategoryDatabase({database: "grade_tracker"});
