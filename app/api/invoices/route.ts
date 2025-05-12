import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import { NextRequest, NextResponse } from "next/server";
import { InvoiceQuerySchema, CreateInvoiceSchema } from "@/schema";
import { generateInvoiceId } from "@/lib/utils";
import { authMiddleware } from "@/lib/authMiddleware";

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    [key: string]: unknown;
  };
}

export async function POST(req: AuthenticatedRequest) {
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

    // Validate request body
    const validatedData = CreateInvoiceSchema.safeParse({
      ...body,
      createdBy: userId,
    });
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Generate ID
    const invoiceData = validatedData.data;
    invoiceData.id = await generateInvoiceId(); // Always generate ID server-side

    // Create invoice
    const invoice = await Invoice.create(invoiceData);
    return NextResponse.json(
      { message: "Invoice created", invoice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: AuthenticatedRequest) {
  try {
    // Check authentication
    const authError = await authMiddleware(req);
    if (authError) return authError;

    const userId = req?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    await dbConnect();

    // Parse and validate query parameters
    const searchParams = req.nextUrl.searchParams;

    const queryParams = {
      status: searchParams.get("status"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    };

    const validatedParams = InvoiceQuerySchema.safeParse(queryParams);
    if (!validatedParams.success) {
      return NextResponse.json(
        { error: validatedParams.error.errors },
        { status: 400 }
      );
    }

    const { status, page, limit } = validatedParams.data;

    // Build query with user filter
    const query: { createdBy: string; status?: { $in: string[] } } = {
      createdBy: userId,
    };
    if (status) {
      query.status = { $in: status };
    }

    // Fetch paginated invoices and total count
    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-_id -__v") // Exclude _id and __v
        .lean(), // Use lean() for better performance
      Invoice.countDocuments(query),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        invoices,
        total,
        page,
        limit,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
