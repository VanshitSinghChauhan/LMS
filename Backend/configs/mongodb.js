import mongoose from "mongoose";

//Connect to the mongo Db database

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=>console.log("DB Connected Successfully"))
    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
    //await mongoose.connect(process.env.MONGODB_URI, { dbName: 'lms' })
}

export default connectDB