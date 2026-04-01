import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import TryCatch from './TryCatch.js';
import { User } from '../models/user.js';

export const isAuth = TryCatch(async (req, res, next) => {

    const token = req.headers.token;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized or login first",
        });
    }
   
    const decodedData = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decodedData.id)

    next()
}); 

export const isAdmin = TryCatch(async (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({
            message: "Forbidden, you are not an admin",
        });
    }
    next();//to move to the next middleware or controller function
})

