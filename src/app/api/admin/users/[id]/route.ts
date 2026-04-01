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
  const { role } = body;

  if (role !== "admin" && role !== "user") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent removing your own admin role
  if (id === session.user.id && role !== "admin") {
    return NextResponse.json(
      { error: "Cannot remove your own admin role" },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, role: true },
  });

  return NextResponse.json(updated);
}
