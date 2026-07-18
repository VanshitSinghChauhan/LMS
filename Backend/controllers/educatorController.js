import {clerkClient, getAuth} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'

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
        const { userId } = getAuth(req) // this userId is educatorId

        if(!imageFile){
            return res.json({ status: false, message: 'Thumbnail not attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = userId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course added'})
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}

//Get educator course
export const getEducatorCourses = async(req, res)=>{
    try {
        const { userId } = getAuth(req) // userId is the educator
        const courses = await Course.find({ educator: userId }) 
        res.json({success: true, courses})
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}


export const educatorDashboardData = async(req, res)=>{
    try {
        const { userId } = getAuth(req) // educator
        const courses = await Course.find({ educator: userId }) 
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id)

        //Calculate ttal earning from Purchases
        const purchase = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        })

        const totalEarnings = purchase.reduce((sum, purchase) => sum + purchase.amount, 0);

        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            });
        }

        res.json({success: true, dashboardData: {
            totalEarnings, enrolledStudentsData, totalCourses
        }})
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const courses = await Course.find({ educator: userId });
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map(purchase =>({
        student: purchase.userId,
        courseTitle: purchase.courseId.courseTitle,
        purchaseDate: purchase.createdAt
    }))

    res.json({success: true, enrolledStudents})

  } catch (error) {
    res.json({ success: false, message: error.message})
  }
}