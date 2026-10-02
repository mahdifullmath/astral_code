import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";


export interface AuthUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export class ApiError extends Error {
  constructor(public status: number, msg: string, public details?: unknown) {
    super(msg);
  }
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  providers: [
    {
      type: "credentials" as const,
      authorize: async (cred: any) => {
        const email = String(cred?.email ?? "").toLowerCase().trim();
        const password = String(cred?.password ?? "");
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin };
      },
    },
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.uid = user.id;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      session.user.uid = token.uid;
      session.user.username = token.username;
      (session.user as any).isAdmin = token.isAdmin;
      return session;
    },
  },
} as const;
