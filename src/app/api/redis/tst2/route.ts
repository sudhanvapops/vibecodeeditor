import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){

    const session = await auth()
    console.log(session)
    return NextResponse.json({session},{status:400})

}