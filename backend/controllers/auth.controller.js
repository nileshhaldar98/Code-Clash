import { UserRole } from "../src/generated/prisma/index.js";
import {db} from "../src/libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    
    const { name, password, email } = req.body;
    if (!name || !password || !email) { 
        return res.status(400).json({ error: "All fields are required" })
    }
    try {
        const exisitingUser = await db.user.findUnique({
            where: {
                email
            }
        })
        if (exisitingUser) {
            return res.status(400).json({ error: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER
            }
        })
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        res.status(201).json({
            success:true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        })
    } catch (error) {
        console.log("error in register controller",error);
        res.status(500).json({
            error: "Error Creating an User"
        })
    }
  }
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(400).json({
                error: "user not found"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { 
            return res.status(401).json({
                success: false,
                error: "invalid Credentials"
            })
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn:"7d"
        })
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 24 * 7
        })
        console.log("here in the log in ");
        res.status(200).json({
            success: true,
            message: "User Logged in Suceessfully",
            user: {
                id:user.id,
                email: user.email,
                name: user.name,
                role:user.role,
                image:user.image
            }
        });

    } catch (error) {
        
    }
 }
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt",{
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
        })
        res.status(200).json({
            success: true,
            message:"User log-out sucessfully"
        })
    } catch (error) {
        console.log("error in the logout ", error);
        return res.status(500).json({
            error:"Error Logging outr user"
        })
    }
 }
export const check = async (req, res) => {
    try {

        return res.status(200).json({
            success: true,
            message: "User is authenticated successfully",
            user:req.user
        })
    } catch (error) {
        console.log("error in the check controller:", error);
        return res.status(500).json({
            error: "Error Checking User "
        })
    }
 }
