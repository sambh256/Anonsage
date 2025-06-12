'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import dayjs from "dayjs";


import { Message } from "@/models/User"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"
type MessageCardProps={
    message: Message,
    onMessageDelete:(messageId:string)=>void
}

const MessageCard= ({message,onMessageDelete}:MessageCardProps)=>{
    const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message);
      onMessageDelete(message._id);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error');
    } 
  };




    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
                    <div className="text-sm">
                        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                    </div>
            </CardHeader>
            <CardContent>
                
            </CardContent>
            
        </Card>

    )
}
export default MessageCard;