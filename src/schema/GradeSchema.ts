import { Document, model, Schema } from "mongoose";

export interface GradeDTO extends Document {
    _id: string;
    name: string;
    grade: number;
    gradeCategoryId: string;
}

const gradeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    gradeCategoryId: {
        type: String,
        required: true
    }
});

export const gradeDatabase = model<GradeDTO>("grades", gradeSchema);
