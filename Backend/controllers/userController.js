import { getAuth } from "@clerk/express"
import User from "../models/User.js"



export const getUserData = async (req, res)=>{
    try {
        const { userId } = getAuth(req)
        const user = await User.findById(userId)

        if(!user){
            return res.json({ success: false, message: "User not found"})
        }

        res.json({ success: true, user})
   } catch (error) {
        res.json({ success: false, message: error.message})
   }
}

export const userEnrolledCourses = async (req, res)=>{
    try {
        const { userId } = getAuth(req)
        const user = await User.findById(userId).populate('enrolledCourses')

        res.json({success: true, enrolledCourses: user.enrolledCourses})

        
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}