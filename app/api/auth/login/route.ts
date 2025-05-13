import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import StatusCodes from "@/lib/statusCodes";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  await dbConnect();

  // Validate presence of email and password
  if (!email) {
    return NextResponse.json(
      { message: `email is required` },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  if (!password) {
    return NextResponse.json(
      { message: `password is required` },
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
  // Validate password length
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters long" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  // Check if user with given email already exists
  try {
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "30d", // Expiration time is 30 days
    });

    const userObj = user.toObject();
    delete userObj.password; // Exclude the password field

    return NextResponse.json(
      {
        token,
        user: userObj,
        message: "User logged in successfully",
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging in", error },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}
