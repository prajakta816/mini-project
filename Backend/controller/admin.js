import TryCatch from "../middleware/TryCatch.js";
import Course from "../models/course.js";
import Lecture  from "../models/lecture.js";
import { User } from "../models/user.js";
import {rm} from "fs";
import { promisify } from "util";
import fs from "fs";

export const createCourse = TryCatch(async (req, res) => {
   const { title, description, category, createdBy, duration, price} = req.body;
    
   const image = req.file.path;
   
   await Course.create({
    title,
    description,
      category,
      createdBy,
      image: image,
      duration,
      price,
   });

   res.status(201).json({
    success: true,
    message: "Course created successfully",
   });
});

export const addLecture = TryCatch(async (req, res) => {
      const course = await Course.findById(req.params.id);

      if(!course)
        return res.status(404).json({
            message: "Course not found",
        });

        const { title, description } = req.body;

        const file = req.file

        const lecture = await Lecture.create({
            title,
            description,
            video: file.path,
            Course: course.id,
        });

        res.status(201).json({
            success: true,
            message: "Lecture added successfully",
        });
});

export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    
    rm(lecture.video, async (err) => {
        if(err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting video file",
            });
        }
        console.log("Video file deleted successfully");
    });

    await lecture.deleteOne();

    res.status(200).json({
        success: true,
        message: "Lecture deleted successfully",
    });
});

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req,res)=>{
    const course = await Course.findById(req.params.id);
 
    const lectures = await Lecture.find({Course: course._id});

    await Promise.all(
        lectures.map(async (lecture) => {
          await unlinkAsync(lecture.video);
          console.log("video file deleted successfully");
        })
    );

    rm(course.image, async (err) => {
        if(err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting video file",
            });
        }
        console.log("image file deleted successfully");
    });
    
    await Lecture.find({Course: course._id}).deleteMany();
    await course.deleteOne();

    await User.updateMany(
        { },
        { $pull: { subscription: req.params.id } }
    );

    res.json({
        success: true,
        message: "Course and associated lectures deleted successfully",
    });
});

export const getAllStates = TryCatch(async(req,res)=>{
    const totalcourses = (await Course.find()).length;
    const totallectures = (await Lecture.find()).length;
    const totalusers = (await User.find()).length;

    const stats = {
        totalcourses,
        totallectures,
        totalusers,
    };

    res.status(200).json({
        success: true,
        stats,
    }); 
});

