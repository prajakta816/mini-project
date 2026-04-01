import express from 'express';

import { getMyCourses,fetchLecture,fetchLectures, getAllCourses, getSingleCourse ,checkout,paymentVerification} from '../controller/courses.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get("/courses/getAllCourses", getAllCourses);
router.get("/courses/:id", getSingleCourse);
router.get("/lectures/fetchLectures/:id",isAuth,fetchLectures);
router.get("/lecture/fetchLecture/:id",isAuth,fetchLecture);
router.get("/user/my-courses",isAuth,getMyCourses);
router.post("/courses/checkout/:id",isAuth,checkout);
router.post("/courses/verification/:id",isAuth,paymentVerification);


export default router;