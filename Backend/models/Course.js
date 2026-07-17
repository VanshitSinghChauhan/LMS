import mongoose from "mongoose";



const lectureSchema = new mongoose.Schema({
    lectureId: {type: String, required: true},
    lectureTitle: {type: String, required: true},
    lectureDuration: {type: Number, required: true},
    lectureUrl: {type: String, required: true},
    isPreviewFree: {type: Boolean, required: true},
    lectureOrder: {type: Number, required: true},
}, {_id: false})


const chapterSchema = new mongoose.Schema({
    chapterId: {type: String, required: true},
    chapterOrder: {type: String, required: true},
    chapterTitle: {type: String, required: true},
    chapterContent: [lectureSchema],
}, {_id: false}) // if any chapter is created then this will not create any id for chapter because we are already providing the unique id from the frontend

const courseSchema = new mongoose.Schema({
    courseTitle: {type: String, required: true},
    courseDescription: {type: String, required: true},
    courseThubnail: {type: String }, //will store the url in string format
    coursePrice: {type: Number, required: true},
    isPublished: {type: Boolean, default: true},
    discount: {type: Number, required: true, min: 0, max: 100},
    courseContent: [chapterSchema],
    courseRatings: [
        { userId: {type: String}, rating: {type: Number, min: 1, max: 5}}
    ],
    educator: {type: String, ref: 'User', required: true},
    enrolledStudents: [
        {type: String, ref: 'User'}
    ]   
}, {timestamps: true, minimize: false})//will create timestamp automatically and if we do not provide any value for these properties then this will create these props without any value also

const Course = mongoose.model('Course', courseSchema)
export default Course;