import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACTIVATION_TOKEN_SECRET } from "../config/env.js";
import sendMail from "../middleware/sendMail.js";
import TryCatch from "../middleware/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = {
      name,
      email,
      password: hashPassword,
    };

    const otp = Math.floor(100000 + Math.random() * 900000);

    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      ACTIVATION_TOKEN_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const data = {
      name,
      otp,
    };

    await sendMail(email, "learning", data);

    res.status(201).json({
      message:
        "Registration successful, please check your email to activate your account",
      activationToken,
    });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp , activationToken } = req.body;

  const verify = jwt.verify(activationToken, ACTIVATION_TOKEN_SECRET);

  //in activationToken we have user and otp, so we can get user and otp from activationToken
  if(!verify){
    return res.status(400).json({
      message: "Invalid activation token or otp expired",
    });
  }
  
  //if otp from request.body is not equal to otp from activationToken then return error
  if(verify.otp!==otp){
    return res.status(400).json({
      message: "Invalid activation token or otp wrong",
    });
  }

  //creating user 
  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password, 
  })
  //then we will send response to client
  res.json({
    message:"user registered"
  })

});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  } 

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token =  jwt.sign(
    {
      id: user._id,
    },
    ACTIVATION_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.json({
    message:`Welcome back ${user.name}`,
    token,
    user,
  })
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json({user});
});