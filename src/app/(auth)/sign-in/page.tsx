'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting,setIsSubmitting] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password: data.password
      })
  
      if(result?.error){
        if(result.error == 'CredentialsSignin'){
          toast({
            title:"Login failed",
            description:"Incorrect username or password",
            variant:"destructive"
          })
        }
        else{
          toast({
            title:"Error",
            description:result.error,
            variant:"destructive"
          })
        }
        
      }
  
      if(result?.url){
        router.replace('/dashboard')
      }
    } catch (error) {
      console.log("Error ocurred while login",error);
      toast({
        title: "Signin Failed",
        description: "Signin Failed",
        variant: "destructive"
      })
    }
    finally{
      setIsSubmitting(false);
    }
   
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">             
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Email/Username</FormLabel>
                      <FormControl>
                        <Input placeholder="email/username" {...field} />
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
                      <FormLabel className="font-bold">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">
                  {isSubmitting  ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
                    </>
                  ) : ('Signin')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page