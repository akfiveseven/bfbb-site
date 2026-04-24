import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body;

  if (!type || !data) {
    return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
  }

  if (type !== "strategy" && type !== "method" && type !== "guide" && type !== "glossary" && type !== "route" && type !== "feedback") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      type,
      data: JSON.stringify(data),
    },
  });

  return NextResponse.json(submission, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}
