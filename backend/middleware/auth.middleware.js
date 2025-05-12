import jwt from "jsonwebtoken";
import { db } from "../src/libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    const user = await db.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in the auth middleware ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const chekAdmin = async (req, res, next) => { 
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role:true
      }
    })
    if (!user || user.role !== "ADMIN") { 
      return res.status(401).json({
        success: false,
        message: "unauthorized access"
      })
    }
    next();
  } catch (error) {
    console.log("error in the auth mdiddleware admin checking", error);
    return req.status(500).json({
      success: false,
      message:"Internal server error in the admin checkiing"
    })
  }
}