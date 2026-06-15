import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("EMAIL REQUEST:", body);
    console.log("API KEY EXISTS:", !!process.env.RESEND_API_KEY);

    const {
      customerName,
      customerEmail,
      orderNumber,
      amount,
    } = body;

 const result = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: customerEmail,
  subject: `Order ${orderNumber}`,
  html: `
    <h2>Order Confirmed</h2>
    <p>Hello ${customerName},</p>
    <p>Your order has been received successfully.</p>
    <p>Order Number: ${orderNumber}</p>
    <p>Amount: ₹${amount}</p>
  `,
});console.log("RESEND RESPONSE:", result);

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error: any) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown Error",
      },
      {
        status: 500,
      }
    );
  }
}