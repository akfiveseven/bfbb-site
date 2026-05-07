import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { type, id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (type === "strategies") {
    await prisma.strategy.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  }

  if (type === "methods") {
    await prisma.method.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  }

  if (type === "socks") {
    await prisma.sock.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  }

  if (type === "spatulas") {
    await prisma.spatula.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  }

  if (type === "guides") {
    await prisma.guide.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  }

  if (type === "glossary") {
    await prisma.glossaryEntry.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  }

  if (type === "sockStrategies") {
    await prisma.sockStrategy.delete({ where: { id: numericId } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 404 });
}
