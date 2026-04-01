import mongoose from "mongoose";

import { instance } from "../server.js";
import TryCatch from "../middleware/TryCatch.js";
import Course from "../models/course.js";
import Lecture from "../models/lecture.js";
import { User } from "../models/user.js";
import { request } from "express";
import crypto from 'crypto';
import {Payment} from '../models/Payment.js';

export const getAllCourses =TryCatch(async(req, res) => {

    const course = await Course.find();
    res.status(200).json({
        success: true,
        course
    });
});

export const getSingleCourse = TryCatch(async(req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).json({
        success: false,
        message: "Course not found"
    });
     res.status(200).json({
        success: true,
        course,
    });
});

export const fetchLectures = TryCatch(async (req, res) => {
    const courseId = req.params.id; // course ID from request

    // Fetch the user
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    // Admins can see all lectures
    if (user.role === "admin") {
        const lectures = await Lecture.find({ Course: courseId }); // string match
        return res.status(200).json({ lectures });
    }

    // Regular users: check subscription
    const subscribedCourses = user.subscription.map(id => id.toString());
    if (!subscribedCourses.includes(courseId)) {
        return res.status(400).json({ message: "You have not subscribed to this course" });
    }

    // Fetch lectures for subscribed users
    const lectures = await Lecture.find({ Course: courseId }); // string match
    return res.status(200).json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user.id);

    if(user.role === "admin") {
        return res.status(200).json({ lecture });
    }

    if(!user.subscription.includes(request.params.id)) {
        return res.status(400).json({ message: "You have not subscribed to this course" });
    }   

    res.json({
        success: true,
        lecture,
    }); 
});

export const getMyCourses = TryCatch(async(req , res)=>{
    const courses = await Courses.find({_id: req.user.subscription});

    res.status(200).json({
            success: true,
            courses,       
    });
});

export const checkout = TryCatch(async(req,res)=>{
    const user =await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);



    if(user.Subscription.includes(course._id)){

      return res.status(400).json({
        message:"you alrady have this course",
      });

    }

    const options ={
      amount:Number(course.price*100),
      currency:"INR",
    };

    const order = await instance.orders.create(options);


    res.status(201).json({
      order,
      course,
    });
});

  
// for the payment verification..

export const paymentVerification = TryCatch(async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;


    const body = razorpay_order_id + " | "+  razorpay_payment_id;

    const expectedSignature = crypto
    .createHmac("sha256",process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic){

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,

      });

      const user = await User.findById(req.user._id)

      const course = await Courses.findById(req.params.id)

      user.Subscription.push(course._id)

      await user.save

      res.status(200).json({


        message:"Course purchased Succesfully",
      });

    }
    else{
       return res.status(400).json({
        message:"Payment Failed"

      })
    }
  });


