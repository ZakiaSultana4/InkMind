// app/api/test-db/route.ts
import { connectToDatabase } from "@/lib/db/mongoose"; // Update path as needed
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
      dbName: db.connection.name,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
