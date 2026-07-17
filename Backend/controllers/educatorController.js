import {clerkClient, getAuth} from '@clerk/express'


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