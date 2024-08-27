import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server"; // Importing NextResponse

export async function GET(request:Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User; //-> this is calles as assertion
        console.log(user);
        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                message: "Not Authenticated"
            }, { status: 401 });
        }
        
        const userID = new mongoose.Types.ObjectId(user._id); // Ensure session.user._id exists
        const userMessages = await UserModel.aggregate([
            { $match: { _id: userID } }, // Use `_id` field for matching
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } } // Fixed typo: `mesages` -> `messages`
        ]);

        if (!userMessages || userMessages.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            messages: userMessages[0].messages
        }, { status: 200 });

    } catch (error) {
        console.error("An unexpected error occurred", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 });
    }
}
