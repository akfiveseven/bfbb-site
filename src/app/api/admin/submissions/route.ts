import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = await prisma.submission.findMany({
    where: { status: "pending" },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}
