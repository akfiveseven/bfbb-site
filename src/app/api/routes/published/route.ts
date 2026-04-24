import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const routes = await prisma.savedRoute.findMany({
    where: { published: true },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(
    routes.map((r) => {
      let category: string | null = null;
      try {
        const parsed = JSON.parse(r.data);
        if (!Array.isArray(parsed)) {
          category = parsed.category || null;
        }
      } catch { /* ignore */ }
      return {
        id: r.id,
        name: r.name,
        category,
        data: JSON.parse(r.data),
        updatedAt: r.updatedAt,
        author: { name: r.user.name, image: r.user.image },
      };
    })
  );
}
