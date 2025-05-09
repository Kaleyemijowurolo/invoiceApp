import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import StatusCodes from "@/lib/statusCodes";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json(); // Parse request body

    await dbConnect(); // Connect to the database

    // Validate presence of email and affiliateType
    if (!email) {
      return NextResponse.json(
        { message: `email is required` },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Check if user with given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
    });

    // Remove password from user object before sending response
    const userObj = user.toObject();
    delete userObj.password;

    // Return success response
    return NextResponse.json(
      { message: "User created successfully", user: userObj },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    // Return error response
    return NextResponse.json(
      { message: "Error creating user", error },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}
