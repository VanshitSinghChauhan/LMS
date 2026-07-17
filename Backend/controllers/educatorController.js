import {clerkClient, getAuth} from '@clerk/express'
import Course from '../models/Course'
import {v2 as cloudinary} from 'cloudinary'

//Update role to educator
export const updatedRoletoEducator = async (req, res)=>{
    try {
        const { userId } = getAuth(req)
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator',
            }
        })
        res.json({success: true, message: 'You can publish a course now'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export const addCourse = async(req, res)=>{
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = getAuth(req)

        if(!imageFile){
            return res.json({ status: false, message: 'Thumbnail not attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThubnail =  imageUpload.secure_url
        await newCourse.save()

        res.json({ status: true, message: 'Course added'})
    } catch (error) {
        res.json({ status: false, message: error.message})
    }
}