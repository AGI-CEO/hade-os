import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(session.user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
