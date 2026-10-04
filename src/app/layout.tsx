import type { Metadata } from "next";
import { getLang, Lang } from "@/lib/i18n";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  icons: { icon: "/logo/icon.png", apple: "/logo/icon.png" },
  title: {
    default: "Astral Code — Play the Real World",
    template: "%s — Astral Code",
  },
  description:
    "Astral Code is an independent studio building augmented-reality games that turn real places into interactive worlds. Play the real world, earn Astral Coins, and spend them on cosmetics, avatars, and badges.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang: Lang = getLang();
  const user = await getSession();

  return (
    <html
      lang={lang}
      dir={lang === "fa" ? "rtl" : "ltr"}
      className="dark"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <Navbar user={user ? { username: user.username, isAdmin: user.isAdmin } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
