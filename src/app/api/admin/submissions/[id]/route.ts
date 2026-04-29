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
          videoURLs: JSON.stringify(data.videoURLs || (data.videoURL ? [data.videoURL] : [])),
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
    } else if (submission.type === "glossary") {
      await prisma.glossaryEntry.create({
        data: {
          name: data.name,
          difficulty: Number(data.difficulty) || 0,
          description: data.description,
          videoURL: data.videoURL || "",
        },
      });
    } else if (submission.type === "route") {
      if (data.routeId) {
        // Publish existing saved route
        await prisma.savedRoute.update({
          where: { id: data.routeId },
          data: { published: true },
        });
      } else {
        // Create a new published route from submission data
        await prisma.savedRoute.create({
          data: {
            userId: submission.userId,
            name: data.name,
            data: JSON.stringify(data.routeData),
            published: true,
          },
        });
      }
    } else if (submission.type === "edit") {
      const entityType = data.entityType;
      const entityId = data.entityId;
      const changes = data.changes;

      if (entityType === "strategy") {
        await prisma.strategy.update({
          where: { id: entityId },
          data: {
            name: changes.name,
            spatula: changes.spatula,
            level: changes.level,
            prerequisites: JSON.stringify(changes.prerequisites || []),
            hans: changes.hans,
            description: changes.description,
            links: JSON.stringify(changes.links || []),
          },
        });
      } else if (entityType === "method") {
        await prisma.method.update({
          where: { id: entityId },
          data: {
            name: changes.name,
            strat: changes.strat,
            difficulty: String(changes.difficulty),
            description: changes.description,
            videoURLs: JSON.stringify(changes.videoURLs || []),
          },
        });
      } else if (entityType === "guide") {
        await prisma.guide.update({
          where: { id: entityId },
          data: {
            name: changes.name,
            difficulty: changes.difficulty,
            category: changes.category || "",
            link: changes.link,
          },
        });
      } else if (entityType === "glossary") {
        await prisma.glossaryEntry.update({
          where: { id: entityId },
          data: {
            name: changes.name,
            difficulty: Number(changes.difficulty) || 0,
            description: changes.description,
            videoURL: changes.videoURL || "",
          },
        });
      }
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
