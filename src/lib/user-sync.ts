import { prisma } from "./prisma";

export async function syncUserToDb(clerkUserId: string, email: string, name?: string | null) {
  return prisma.user.upsert({
    where: { clerkUserId },
    update: { email, name: name ?? undefined },
    create: {
      clerkUserId,
      email,
      name: name ?? undefined,
    },
  });
}
