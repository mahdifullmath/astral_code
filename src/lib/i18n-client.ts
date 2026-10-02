// Client-only i18n. Re-exports the server-safe dict/t plus a live useLang hook,
// so client components have one import. RSC pages import from "@/lib/i18n".
"use client";

import { useSyncExternalStore } from "react";
import { getLang, setLang, type Lang } from "@/lib/i18n";

export { dict, t } from "@/lib/i18n";

function subscribe(cb: () => void) {
  window.addEventListener("astral:lang", cb);
  return () => window.removeEventListener("astral:lang", cb);
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => "en");
}

export { setLang };
