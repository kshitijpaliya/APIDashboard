import { query } from "@/lib/db";
import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if email matches either brand pattern
    const isBrandA = email.toLowerCase().includes("brand-a");
    const isBrandB = email.toLowerCase().includes("brand-b");

    if (!isBrandA && !isBrandB) {
      return NextResponse.json(
        {
          error:
            "Invalid credentials. Use brand-a@example.com or brand-b@example.com",
        },
        { status: 401 }
      );
    }

    // Get the corresponding brand from database
    const brandName = isBrandA ? "Brand A" : "Brand B";
    const result = await query(
      `SELECT id, name, api_key FROM brands WHERE name = $1`,
      [brandName]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brand = result.rows[0];
    const user = {
      brandId: brand.id,
      name: `${brand.name} User`,
      email: email,
    };

    // Generate JWT token
    const token = generateToken(user);

    return NextResponse.json({
      token,
      user: {
        id: `user_${brand.id}`, // Removed .split() since id is a number
        name: user.name,
        email: user.email,
        brandId: brand.id,
        brand: brand.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
