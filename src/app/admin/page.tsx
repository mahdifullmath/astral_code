// Admin panel shell — auth check server-side, panels client-side.
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import { AdminGames, AdminUsers } from "./AdminPanels";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function Admin() {
  const s = await getSession();
  if (!s?.isAdmin) redirect("/login");

  return (
    <div className="container-page py-12">
      <Starfield />
      <Reveal>
        <h1 className="heading-display text-4xl mb-8">Admin</h1>
      </Reveal>
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="glass card p-6">
            <h2 className="font-display font-bold text-white mb-4">Games</h2>
            <AdminGames />
          </div>
        </Reveal>
        <Reveal>
          <div className="glass card p-6">
            <h2 className="font-display font-bold text-white mb-4">Users</h2>
            <AdminUsers />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
