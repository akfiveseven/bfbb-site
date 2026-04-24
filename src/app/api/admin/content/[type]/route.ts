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
      strategies.map((s) => ({
        ...s,
        prerequisites: JSON.parse(s.prerequisites),
        links: JSON.parse(s.links),
      }))
    );
  }

  if (type === "methods") {
    const methods = await prisma.method.findMany();
    return NextResponse.json(methods);
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
        spatula: body.spatula,
        level: body.level,
        prerequisites: JSON.stringify(body.prerequisites || []),
        hans: body.hans,
        description: body.description,
        links: JSON.stringify(body.links || []),
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
        videoURL: body.videoURL,
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

  return NextResponse.json({ error: "Unknown type" }, { status: 404 });
}
