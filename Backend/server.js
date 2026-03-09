import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import userRoutes from "./Routes/user.js";
import dotenv from "dotenv";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api", userRoutes);


app.get("/", (req, res) => {
    res.send("Backend server is running 🚀");
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


//instead of these 3 limes to write everytime when i want to use these variables i can write in one line and export them and import them where i want to use by writing only one line of code and that is the reason we have created env.js file in config folder and we are exporting these variables from there and importing them where we want to use them
//import dotenv from "dotenv";
//dotenv.config();
 //const PORT = process.env.PORT || 5000;

 //only write
    //import { PORT } from "./config/env.js"; and we can use PORT variable in this file without writing process.env.PORT every time and also we can use MONGO_URI and JWT_SECRET variables in this file without writing process.env.MONGO_URI and process.env.JWT_SECRET every time because we have exported these variables from env.js file and imported them in this file.