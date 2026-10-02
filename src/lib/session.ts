import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface SessionUser {
  id: string;
  username: string;
  email: string | null;
  isAdmin: boolean;
}

export async function getSession(): Promise<SessionUser | null> {
  const session = (await getServerSession(authOptions as any)) as
    | (Session & { user?: any })
    | null;
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.uid,
    username: u.username,
    email: session.user.email ?? null,
    isAdmin: Boolean(u.isAdmin),
  };
}

export async function requireAdmin() {
  const s = await getSession();
  return s?.isAdmin ? s : null;
}
