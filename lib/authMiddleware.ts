import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Define the expected JWT payload shape
interface JwtPayload {
  id: string;
  // Add other fields if your JWT includes them
}

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Validate the decoded payload
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Assign to req.user
    req.user = { id: decoded.id };
    return null;
  } catch (error) {
    return NextResponse.json(
      { error: error || "Invalid token" },
      { status: 401 }
    );
  }
}
