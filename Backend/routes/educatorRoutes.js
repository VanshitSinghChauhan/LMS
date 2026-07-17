import express from "express";
import { updatedRoletoEducator } from "../controllers/educatorController.js";

const educatorRouter = express.Router()

educatorRouter.get('/update-role', updatedRoletoEducator)

export default educatorRouter