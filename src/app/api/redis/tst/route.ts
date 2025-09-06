import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export  async function GET(){
    // Set Data
    await redis.set("message","Hi from redis")

    // Read Data
    const value = await redis.get("message")

    return NextResponse.json({value})

}