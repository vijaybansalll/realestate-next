import { NextResponse } from "next/server";
import { sendInquiryEmail, type ContactEmailPayload } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactEmailPayload;

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.trim() || !body.email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const result = await sendInquiryEmail(body);

    return NextResponse.json({
      success: true,
      message: "Inquiry delivered successfully.",
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error("API /api/inquiries error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to deliver inquiry email.",
      },
      { status: 500 }
    );
  }
}
