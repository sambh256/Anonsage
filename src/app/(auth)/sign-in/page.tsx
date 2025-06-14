'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import *as  z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

export default function SignInForm() {
  
  const [isSubmitting,setisSubmitting]=useState(false)
  
  
  const router = useRouter()

  
  //zod implementation
  const form  = useForm({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })
  const { setError } = form;


 

  const onSubmit =async(data: z.infer<typeof signInSchema>)=>{
    setisSubmitting(true);
    const result=await signIn('credentials',{
        redirect:false,
        identifier: data.identifier,
        password:data.password
    })
    if(result?.error){
      setError("password", {
      type: "manual",
      message: "Wrong password or email"
    });
        toast("Login failed")
    }if(result?.url){
        router.replace('/dashboard')

        
    }
    setisSubmitting(false);
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email/username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} 
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
              SignIn
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>  
      </div>    
    </div>
  );
}

