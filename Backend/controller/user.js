import { User } from "../modules/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACTIVATION_TOKEN_SECRET } from "../config/env.js";
import sendMail from "../middleware/sendMail.js";

export const register = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);   // IMPORTANT FOR DEBUGGING
    res.status(500).json({
      message: error.message,
    });
  }
};