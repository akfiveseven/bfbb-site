import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const route = await prisma.savedRoute.findUnique({ where: { id } });

  if (!route) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.savedRoute.update({
    where: { id },
    data: { published: !route.published },
  });

  return NextResponse.json({ published: updated.published });
}
