import express from "express";
import { updatedRoletoEducator } from "../controllers/educatorController.js";

const educatorRouter = express.Router()
console.log("Educator router loaded") // ← temporary debug line

educatorRouter.get('/update-role', updatedRoletoEducator)

export default educatorRouter