import { NextRequest, NextResponse } from "next/server";
import { validateDomainFiles } from "@/lib/validation/validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, platforms } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain provided." }, { status: 400 });
    }

    const results = await validateDomainFiles(domain, platforms || ["ios", "android"]);

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
