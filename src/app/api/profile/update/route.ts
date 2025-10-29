import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const favoriteProtein = formData.get("favoriteProtein") as string;
    const smokerType = formData.get("smokerType") as string;
    const experienceLevel = formData.get("experienceLevel") as string;

    // Get user first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or update profile
    await prisma.profile.upsert({
      where: { 
        userId: user.id
      },
      update: {
        bio: bio || null,
        favoriteProtein: favoriteProtein || null,
      },
      create: {
        userId: user.id,
        bio: bio || null,
        favoriteProtein: favoriteProtein || null,
      },
    });

    // Redirect to profile page
    return NextResponse.redirect(new URL("/profile", request.url));
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}