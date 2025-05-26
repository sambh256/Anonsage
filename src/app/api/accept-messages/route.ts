import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../sign-up/auth/[...nexthauth]/options";



export async function POST(request:Request){
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session||!session.user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },{status:400})


    }
    const userId =user._id
    const {acceptMessages} =await request.json()
    try{
        const updatedUser = await UserModel.findById(userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}

        )
        if(!updatedUser){
            return Response.json(
            {
                success:false,
                message:"failed to update status to accept messages"

            },{status:401})

        }else{
            return Response.json(
            {
                success:true,
                message:"Message acceptance status updated successfully"
                
            },{status:200})
            updatedUser


        }

    }catch(error){
        console.error("failed to update status to accept messages")
        return Response.json(
            {
                success:false,
                message:"failed to update status to accept messages"
            },{status:500})

    }


}


export async function GET(request: Request){
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session||!session.user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },{status:400})


    }
    const userId =user._id
    try{
        const foundUser =await UserModel.findById(userId)
        if(!foundUser){
            return Response.json(
                {
                    success:false,
                    message:"Not Authenticated"
                },{status:404})


        }else{
            return Response.json(
                {
                    success:true,
                    isAcceptingMessages:foundUser.isAcceptingMessage
                
                },{status:200})
            

        }
    }catch(error){
        console.error("failed to update status to accept messages")
        return Response.json(
            {
                success:false,
                message:"Error in getting message acceptance session"
            },{status:500})

    }

}
