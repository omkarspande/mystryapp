import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model/User";
import { MessageModel } from "@/model/User";
export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, message } = await request.json();

        const userData = await UserModel.findOne({username});
        console.log(userData);
        if(!userData){
            return Response.json({
                success:false,
                message:"User does not exists"
            },{status:500})
        }
        if(userData && !userData.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not aceepting messages at this moment"
            },{status:500})
        }
        // const msgArray:Message[] = userData.messages;
        const newMsg = new  MessageModel({content:message,createdAt: new Date()});
        await newMsg.save();
        userData.messages.push(newMsg);
        userData.save();
        return Response.json({
            success:true,
            username:userData?.username,
            message:"Message updated sucessfully"
        },{status:200})

    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Error ocurred while processing your request"
        },{status:500})
    }
}