import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// App Router form: named GET/POST handlers wrapping NextAuth.
// (The legacy `export default NextAuth(authOptions)` Pages form does NOT work under App Router.)
const handler = NextAuth(authOptions as any);

export const GET = handler;
export const POST = handler;
