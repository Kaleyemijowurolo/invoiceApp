import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/Invoice";
import dbConnect from "@/lib/mongodb";
import { StatusSchema } from "@/schema";
import { z } from "zod";
import { authMiddleware } from "@/lib/authMiddleware";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check authentication
  const authError = await authMiddleware(req);
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await req.json();
    const { status } = StatusSchema.parse(body);

    const invoice = await Invoice.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    );
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Invoice status updated", invoice },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
