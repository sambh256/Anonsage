import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request){
    await dbConnect()
    try{
        const{username,code}= await request.json()
        const decodedusername=decodeURIComponent(username)
        const user =await UserModel.findOne({username:decodedusername})
        if(!user){
            return Response.json({
            success: false,
            message:"Error verifying message"
        },{status:400})
        }else{
            const isCodeValid=user.verifyCode===code
            const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()
            if(isCodeNotExpired&&isCodeValid){
                user.isVerified=true,
                await user.save()
                return Response.json({
                success: true,
                message:"User verified successfully"
                },{status:200})


            }
            if(isCodeNotExpired){
                return Response.json({
                success: false,
                message:"Code has expired"
                },{status:200})

            }
            else if(isCodeValid){
                return Response.json({
                success: false,
                message:"Code is wrong"
                },{status:200})

            }
        
        }
    }catch(error){
        console.error("Error verifying user",error)
        return Response.json({
            success: false,
            message:"Error verifying message"
        },{status:500})
    }
}