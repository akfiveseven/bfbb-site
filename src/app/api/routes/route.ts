import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const routes = await prisma.savedRoute.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, updatedAt: true },
  });

  return NextResponse.json(routes);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, data } = body;

  if (!name || !data) {
    return NextResponse.json({ error: "Missing name or data" }, { status: 400 });
  }

  const route = await prisma.savedRoute.create({
    data: {
      userId: session.user.id,
      name,
      data: JSON.stringify(data),
    },
  });

  return NextResponse.json(route, { status: 201 });
}
