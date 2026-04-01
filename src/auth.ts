import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Discord],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        session.user.role = dbUser?.role ?? "user";
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "discord" && account.providerAccountId) {
        const adminIds = (process.env.ADMIN_DISCORD_IDS ?? "")
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

        if (adminIds.includes(account.providerAccountId)) {
          await prisma.user.update({
            where: { id: user.id! },
            data: { role: "admin", discordId: account.providerAccountId },
          });
        } else {
          await prisma.user.update({
            where: { id: user.id! },
            data: { discordId: account.providerAccountId },
          });
        }
      }
    },
  },
});
