import { getLang, dict } from "@/lib/i18n";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

export const metadata = { title: "About" };

export default function About() {
  const lang = getLang();
  const d = dict[lang];
  const team = [
    { name: "A. Rahimi", role: lang === "fa" ? "بنیان‌گذار و کارگردان خلاق" : "Founder & Creative Director" },
    { name: "S. Karimi", role: lang === "fa" ? "مهندس AR" : "AR Engineer" },
    { name: "N. Soltani", role: "Art Director" },
    { name: "M. Tavakoli", role: "Lead Game Designer" },
  ];
  return (
    <div className="container-page py-16">
      <Starfield />
      <Reveal>
        <h1 className="heading-display text-4xl mb-3">{d.about_title}</h1>
        <p className="text-ink-soft max-w-2xl mb-12">{d.about_sub}</p>
      </Reveal>
      <Reveal>
        <h2 className="heading-display text-2xl mb-6">{d.team_title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="glass card p-5 text-center">
              <div className="h-14 w-14 mx-auto rounded-full bg-gradient-to-br from-violet-neon to-cyan-neon flex items-center justify-center font-display font-black text-space-950 mb-3">
                {m.name[0]}
              </div>
              <div className="font-semibold text-white">{m.name}</div>
              <div className="text-ink-faint text-sm mt-1">{m.role}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
