// app/api/test/route.js
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await query("SELECT * FROM brands");
    console.log("Query result:", result.rows);

    return NextResponse.json({
      success: true,
      brands: result.rows, // Return all brands instead of current_time
      count: result.rowCount,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack, // More detailed error info
      },
      {
        status: 500,
      }
    );
  }
}
