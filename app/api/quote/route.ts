import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

type QuoteRequestBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  productType?: string;
  projectDetails?: string;
};

const requiredFields: Array<keyof QuoteRequestBody> = [
  "fullName",
  "email",
  "phone",
  "location",
  "productType",
  "projectDetails",
];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuoteRequestBody;

    const missingField = requiredFields.find((field) => !body[field]?.trim());

    if (missingField) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("quote_requests").insert([
      {
        full_name: body.fullName!.trim(),
        email: body.email!.trim(),
        phone: body.phone!.trim(),
        location: body.location!.trim(),
        product_type: body.productType!.trim(),
        project_details: body.projectDetails!.trim(),
      },
    ]);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Quote request submitted successfully." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to submit quote request." },
      { status: 400 }
    );
  }
}
