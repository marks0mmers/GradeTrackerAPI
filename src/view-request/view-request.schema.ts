import { Document, model, Schema } from "mongoose";
export interface ViewRequestDTO {
    _id: string;
    status: number;
    requester: string;
    reciever: string;
}

export interface ViewRequestDocument extends Document {
    _id: string;
    status: number;
    requester: string;
    reciever: string;
}

const viewRequestSchema = new Schema({
    status: {
        type: Number,
        required: true,
        min: 0,
        max: 2
    },
    requester: {
        type: String,
        required: true
    },
    reciever: {
        type: String,
        required: true
    }
});

export const viewRequestDatabase = model<ViewRequestDocument>("ViewRequest", viewRequestSchema);
