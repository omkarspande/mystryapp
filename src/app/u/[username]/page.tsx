'use client'
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useRef, useState } from 'react'

const MessagePage = () => {
  const [isSubmittingMessage,setIsSubmittingMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); 
  const params = useParams<{ username: string }>()

  const onClick = async()=>{

    if(!inputRef.current)
    {
      return;
    }
    try {
      setIsSubmittingMessage(true);
      const response = await axios.post<ApiResponse>('/api/add-messages',{username:params.username,message:inputRef.current.value});
      if(response.status === 200){
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default"
        })
        if(inputRef.current){
          inputRef.current.value = '';
        }
      }
      else{
        toast({
          title: "Success",
          description: response.data.message,
          variant: "destructive"
        })
      }
     
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingMessage(false);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
        <input
          type="text"
          placeholder="Please enter your message"
          ref={inputRef}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onClick}
          disabled={isSubmittingMessage}
          className={`w-full px-4 py-2 font-semibold text-white rounded-lg ${
            isSubmittingMessage ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {isSubmittingMessage ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default MessagePage