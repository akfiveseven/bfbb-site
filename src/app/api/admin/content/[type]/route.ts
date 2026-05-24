import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { type } = await params;

  if (type === "strategies") {
    const strategies = await prisma.strategy.findMany();
    return NextResponse.json(
      strategies.map((s) => {
        let spatulas: string[];
        try {
          spatulas = JSON.parse(s.spatula);
          if (!Array.isArray(spatulas)) spatulas = [s.spatula];
        } catch {
          spatulas = s.spatula ? [s.spatula] : ["N/A"];
        }
        return {
          ...s,
          spatulas,
        };
      })
    );
  }

  if (type === "methods") {
    const methods = await prisma.method.findMany();
    return NextResponse.json(
      methods.map((m) => ({
        ...m,
        videoURLs: JSON.parse(m.videoURLs),
        prerequisites: JSON.parse(m.prerequisites),
      }))
    );
  }

  if (type === "socks") {
    const socks = await prisma.sock.findMany();
    return NextResponse.json(
      socks.map((s) => ({
        id: s.id,
        name: s.name,
        area: s.area,
        level: s.level,
        min_spat_requirement: s.minSpatRequirement,
      }))
    );
  }

  if (type === "spatulas") {
    const spatulas = await prisma.spatula.findMany();
    return NextResponse.json(
      spatulas.map((s) => ({
        id: s.id,
        pos: s.pos,
        name: s.name,
        level: s.level,
        min_spatula_requirement: s.minSpatulaRequirement,
      }))
    );
  }

  if (type === "guides") {
    const guides = await prisma.guide.findMany();
    return NextResponse.json(guides);
  }

  if (type === "glossary") {
    const glossary = await prisma.glossaryEntry.findMany();
    return NextResponse.json(glossary);
  }

  if (type === "sockStrategies") {
    const sockStrategies = await prisma.sockStrategy.findMany();
    return NextResponse.json(sockStrategies);
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { type } = await params;
  const body = await request.json();

  if (type === "strategies") {
    const updated = await prisma.strategy.update({
      where: { id: body.id },
      data: {
        name: body.name,
        spatula: JSON.stringify(body.spatulas || []),
        level: body.level,
        description: body.description,
      },
    });
    return NextResponse.json(updated);
  }

  if (type === "methods") {
    const updated = await prisma.method.update({
      where: { id: body.id },
      data: {
        name: body.name,
        strat: body.strat,
        difficulty: String(body.difficulty),
        description: body.description,
        videoURLs: JSON.stringify(body.videoURLs || []),
        prerequisites: JSON.stringify(body.prerequisites || []),
        hans: body.hans || "N/A",
        obsolete: body.obsolete ?? false,
      },
    });
    return NextResponse.json(updated);
  }

  if (type === "socks") {
    const updated = await prisma.sock.update({
      where: { id: body.id },
      data: {
        name: body.name,
        area: body.area || null,
        level: body.level,
        minSpatRequirement: body.min_spat_requirement,
      },
    });
    return NextResponse.json(updated);
  }

  if (type === "spatulas") {
    const updated = await prisma.spatula.update({
      where: { id: body.id },
      data: {
        pos: body.pos,
        name: body.name,
        level: body.level,
        minSpatulaRequirement: body.min_spatula_requirement,
      },
    });
    return NextResponse.json(updated);
  }

  if (type === "guides") {
    const updated = await prisma.guide.update({
      where: { id: body.id },
      data: {
        name: body.name,
        difficulty: body.difficulty,
        category: body.category || "",
        link: body.link,
      },
    });
    return NextResponse.json(updated);
  }

  if (type === "glossary") {
    const updated = await prisma.glossaryEntry.update({
      where: { id: body.id },
      data: {
        name: body.name,
        difficulty: body.difficulty || "Beginner",
        description: body.description,
        videoURL: body.videoURL || "",
      },
    });
    return NextResponse.json(updated);
  }

  if (type === "sockStrategies") {
    const updated = await prisma.sockStrategy.update({
      where: { id: body.id },
      data: {
        name: body.name,
        sock: body.sock,
        level: body.level,
      },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 404 });
}
