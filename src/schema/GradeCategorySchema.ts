import { Document, model, Schema } from "mongoose";

export interface GradeCategoryDTO {
    _id: string;
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

export interface GradeCategoryDocument extends Document {
    _id: string;
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
        required: true
    },
    potentialAverage: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    }
});

export const gradeCategoryDatabase = model<GradeCategoryDocument>("grade-categories", gradeCategorySchema);
