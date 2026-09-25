import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { Session, User } from "@/lib/server/auth-models";
import { verifyAuthToken } from "@/lib/server/jwt";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const rawToken = token.replace("Bearer ", "");
    const decoded = verifyAuthToken(rawToken);

    await connectMongo();

    const session = await Session.findOne({
      token: rawToken,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    session.lastActive = new Date();
    await session.save();

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session lookup error:", error);
    return NextResponse.json(
      { message: "Invalid authentication token" },
      { status: 401 }
    );
  }
}
