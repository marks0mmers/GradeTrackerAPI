import { Document, model, Schema } from "mongoose";
import { GradeDTO } from "./GradeSchema";

export interface GradeCategoryDTO {
    _id: string;
    title: string;
    percentage: number;
    numberOfGrades: number;
    remainingGrades?: number;
    currentAverage?: number;
    guarenteedAverage?: number;
    potentialAverage?: number;
    courseId: string;
    grades?: GradeDTO[];
}

export interface GradeCategoryDocument extends Document {
    _id: string;
    title: string;
    percentage: number;
    numberOfGrades: number;
    remainingGrades?: number;
    currentAverage?: number;
    guarenteedAverage?: number;
    potentialAverage?: number;
    courseId: string;
    grades?: any[];
}

const gradeCategorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    numberOfGrades: {
        type: Number,
        required: true
    },
    remainingGrades: {
        type: Number,
        required: false
    },
    currentAverage: {
        type: Number,
        required: false
    },
    guarenteedAverage: {
        type: Number,
        required: false
    },
    potentialAverage: {
        type: Number,
        required: false
    },
    courseId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    grades: [
        { type: Schema.Types.ObjectId, ref: "Grade" }
    ]
});

export const gradeCategoryDatabase = model<GradeCategoryDocument>("GradeCategory", gradeCategorySchema);
