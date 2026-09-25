import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/server/mongodb";
import { Session, User } from "@/lib/server/auth-models";
import { createAuthToken } from "@/lib/server/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = createAuthToken(user._id.toString());
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Session.create({
      userId: user._id,
      token,
      expiresAt,
      deviceInfo: req.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Unable to sign in. Please try again." },
      { status: 500 }
    );
  }
}
