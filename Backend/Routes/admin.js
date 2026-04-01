import express from 'express';

import {getAllStates,deleteCourse,deleteLecture, createCourse ,addLecture} from '../controller/admin.js';
import { isAdmin, isAuth } from '../middleware/auth.js';
import { uploadFile } from '../middleware/multer.js';

const router = express.Router();

router.post("/admin/create-course",isAuth,isAdmin,uploadFile,createCourse);
router.post("/admin/add-lecture/:id",isAuth,isAdmin,uploadFile,addLecture);
router.delete("/admin/delete-lecture/:id",isAuth,isAdmin,deleteLecture);
router.delete("/admin/delete-course/:id",isAuth,isAdmin,deleteCourse);
router.get("/admin/stats",isAuth,isAdmin,getAllStates);


export default router;