import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export async function POST(request: Request){
    const router = useRouter()
    await dbConnect()
    try{
        const{username,code}= await request.json()
        console.log("Received:", {username,code});

        const decodedusername=decodeURIComponent(username)
        console.log("decoded: ",{decodedusername});
        const user =await UserModel.findOne({username:decodedusername})
        console.log("databse: ",{user});
        if(!user){
            return Response.json({
            success: false,
            message:"Error verifying message"
        },{status:400})
        }else{
            console.log({code});
            
            const isCodeValid=(user.verifyCode==code)
            const dbcode=user.verifyCode
            console.log("db ",{dbcode});
            const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()
            console.log("code: ",{isCodeValid,isCodeNotExpired});
            if(isCodeNotExpired&&isCodeValid){
                user.isVerified=true;
                await user.save()
                return Response.json({
                success: true,
                message:"User verified successfully"
                },{status:200})
                


            }
            if(!isCodeNotExpired){
                return Response.json({
                success: false,
                message:"Code has expired"
                },{status:200})

            }
            else if(!isCodeValid){
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