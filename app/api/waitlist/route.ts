import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("waitlist")
      .insert([{ name, email }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You're already on the waitlist." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}