import express from "express";
import { updatedRoletoEducator } from "../controllers/educatorController.js";
import upload from "../configs/multer.js";

const educatorRouter = express.Router()

educatorRouter.get('/update-role', updatedRoletoEducator)
educatorRouter.post('/add-course', upload.single('image'))

export default educatorRouter