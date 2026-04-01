import mongoose from "mongoose";
import Course from "./course.js";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    Course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },  

});

 const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", schema);
 export default Lecture;