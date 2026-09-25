import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { Session } from "@/lib/server/auth-models";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Logged out successfully" });
  }

  try {
    await connectMongo();
    await Session.deleteOne({ token });

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Unable to log out. Please try again." },
      { status: 500 }
    );
  }
}
