import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  switch (type) {
    case "strategies": {
      const strategies = await prisma.strategy.findMany();
      return NextResponse.json(
        strategies.map((s) => ({
          ...s,
          prerequisites: JSON.parse(s.prerequisites),
          links: JSON.parse(s.links),
        }))
      );
    }
    case "methods": {
      const methods = await prisma.method.findMany();
      return NextResponse.json(methods);
    }
    case "spatulas": {
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
    case "socks": {
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
    case "glossary": {
      const glossary = await prisma.glossaryEntry.findMany();
      return NextResponse.json(glossary);
    }
    case "guides": {
      const guides = await prisma.guide.findMany();
      return NextResponse.json(guides);
    }
    default:
      return NextResponse.json({ error: "Unknown data type" }, { status: 404 });
  }
}
