'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import *as  z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function SignUpForm() {
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setisCheckingUsername]=useState(false)
  const [isSubmitting,setisSubmitting]=useState(false)
  const debounced =  useDebounceCallback(setUsername,300)
  
  const router = useRouter()

  
  //zod implementation
  const form  = useForm({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email: '',
      password:''
    }
  })


  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setisCheckingUsername(true)
        setUsernameMessage('')
        try{
          const response= await axios.get(`/api/check-username-unique?username=${username}`)
          let message = response.data.message
          setUsernameMessage(message)
        }catch(error){
          const axiosError =error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message??"Error checking username"
          )
        } finally{
          setisCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit =async(data: z.infer<typeof signUpSchema>)=>{
    setisSubmitting(true)
    try{
      const response= await axios.post<ApiResponse>('/api/sign-up',data)
      toast('Success')
      router.replace(`/verify/${username}`)
    }catch(error){
      console.error("Error in signup of user",error)
      const axiosError =error as AxiosError<ApiResponse>
      let errorMessage =axiosError.response?.data.message
      toast('Signup failed')


    }finally{
      setisSubmitting(false)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} 
                    onChange={(e)=>{

                      field.onChange(e)
                      debounced(e.target.value)
                    }} />
                    
                  </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    <p className={`text-sm ${usernameMessage==="Username is unique" ?'text-green-500':'text-red-500'}`}>test {usernameMessage}</p>


                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} 
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} 
                     />
                  </FormControl>
                  


                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting?(
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait

                  
                  </>
                ):('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>  
      </div>    
    </div>
  );
}

