import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action, reviewNote } = body;

  if (action !== "approve" && action !== "deny") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (action === "approve") {
    const data = JSON.parse(submission.data);

    if (submission.type === "strategy") {
      await prisma.strategy.create({
        data: {
          name: data.name,
          spatula: data.spatula || "N/A",
          level: data.level,
          prerequisites: JSON.stringify(data.prerequisites || []),
          hans: data.hans || "N/A",
          description: data.description,
          links: JSON.stringify(data.links || []),
        },
      });
    } else if (submission.type === "method") {
      await prisma.method.create({
        data: {
          name: data.name,
          strat: data.strat,
          difficulty: String(data.difficulty),
          description: data.description,
          videoURL: data.videoURL || "N/A",
        },
      });
    } else if (submission.type === "guide") {
      await prisma.guide.create({
        data: {
          name: data.name,
          difficulty: data.difficulty || "Beginner",
          category: data.category || "",
          link: data.link,
        },
      });
    }
  }

  const updated = await prisma.submission.update({
    where: { id },
    data: {
      status: action === "approve" ? "approved" : "denied",
      reviewNote: reviewNote || null,
      reviewedBy: session.user.id,
    },
  });

  return NextResponse.json(updated);
}
