import { clerkClient, getAuth } from "@clerk/express";

//Middleware (Protect Educator Routes)

export const protectEducator = async (req, res, next)=>{
    try {
        const { userId } = getAuth(req)
        const response = await clerkClient.users.getUser(userId) 
        
        if(response.publicMetadata.role !== 'educator'){
            return res.json({ status: false, message: 'Unauthorized Access'})
        }

        next()
    } catch (error) {
        res.json({ status: false, message: error.message})
    }
}