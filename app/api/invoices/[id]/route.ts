import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import Invoice from "@/models/Invoice";
import dbConnect from "@/lib/mongodb";
import { UpdateInvoiceSchema } from "@/schema";
import { authMiddleware } from "@/lib/authMiddleware";

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    [key: string]: unknown;
  };
}

export async function GET(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check authentication
  const authError = await authMiddleware(req);
  if (authError) return authError;
  try {
    await dbConnect();

    const userId = req.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const invoice = await Invoice.findOne({ id: id, createdBy: userId });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json({ invoice }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Check authentication
  const authError = await authMiddleware(req);
  if (authError) return authError;
  try {
    await dbConnect();

    const userId = req.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = UpdateInvoiceSchema.parse(body);

    const invoice = await Invoice.findOneAndUpdate(
      { id: id, createdBy: userId },
      validatedData,
      {
        new: true,
      }
    );
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Invoice updated", invoice },
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

export async function DELETE(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Check authentication
  const authError = await authMiddleware(req);
  if (authError) return authError;
  try {
    await dbConnect();

    const userId = req.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const invoice = await Invoice.findOneAndDelete({
      id: id,
      createdBy: userId,
    });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Invoice deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
