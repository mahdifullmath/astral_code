// i18n dictionary (en/fa) + language switcher helpers. Client-safe.
export type Lang = "en" | "fa";

const storeKey = "astral-lang";

// ponytail: tiny in-memory cache + localStorage; replace with next-intl if the catalog grows.
let cache: Lang = "en";
try {
  if (typeof window !== "undefined") {
    const v = window.localStorage.getItem(storeKey);
    if (v === "en" || v === "fa") cache = v;
  }
} catch {
  /* storage unavailable — default */
}

export function getLang(): Lang {
  return cache;
}

export function setLang(l: Lang) {
  cache = l;
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(storeKey, l);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = l;
  document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
  // Notify so live components (nav, footer) can re-render labels.
  window.dispatchEvent(new CustomEvent("astral:lang", { detail: l }));
}

export type Dict = Record<string, string>;

export const dict: Record<Lang, Dict> = {
  en: {
    nav_home: "Home",
    nav_games: "Games",
    nav_leaderboard: "Leaderboard",
    nav_about: "About",
    nav_contact: "Contact",
    nav_shop: "Shop",
    nav_dashboard: "Dashboard",
    login: "Log in",
    register: "Create account",
    logout: "Log out",
    play_now: "Play now",
    hero_title: "Astral Code",
    hero_tag: "Play the Real World. The city is your arena — the camera your joystick.",
    how_title: "How it works",
    how_1_t: "Sign up",
    how_1: "Create a free account in seconds.",
    how_2_t: "Play",
    how_2: "Launch an AR game around you with your phone's camera.",
    how_3_t: "Earn",
    how_3: "Complete sessions to earn Astral Coins.",
    how_4_t: "Spend",
    how_4: "Unlock cosmetics, avatars and badges in the shop.",
    coin_title: "Astral Coin",
    coin_body:
      "Astral Coins are earned by playing and spent on in-game cosmetics. They have no cash value and cannot be exchanged for money.",
    games_title: "Games",
    games_sub: "Choose your arena.",
    play: "Play",
    learn_more: "Learn more",
    reward: "reward per session",
    about_title: "The studio",
    about_sub:
      "Astral Code is an independent studio building augmented-reality games that turn real places into interactive worlds.",
    team_title: "Team",
    contact_title: "Contact",
    contact_sub: "Questions, press, or partnerships.",
    send: "Send message",
    name: "Name",
    email: "Email",
    message: "Message",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    copyright: "© Astral Code. In-game currency — no cash value.",
    global_lb: "Global leaderboard",
    per_game: "Per game",
    shop_title: "Shop",
    shop_sub: "Spend Astral Coins on cosmetics.",
    dash_title: "Dashboard",
    balance: "Astral Coin balance",
    games_played: "Games played",
    play_time: "Play time",
    achievements: "Achievements",
    tx_history: "Coin history",
    device_req: "Device requirements",
    cam: "Camera",
    gyro: "Gyroscope",
    gps: "GPS",
    how_to_play: "How to play",
    leaderboard: "Leaderboard",
    coins_per_session: "coins per session",
    admin: "Admin",
    users: "Users",
    settings: "Settings",
    verified: "verified",
    unverified: "unverified",
  },
  fa: {
    nav_home: "خانه",
    nav_games: "بازی‌ها",
    nav_leaderboard: "جدول امتیازات",
    nav_about: "درباره ما",
    nav_contact: "تماس",
    nav_shop: "فروشگاه",
    nav_dashboard: "داشبورد",
    login: "ورود",
    register: "ایجاد حساب",
    logout: "خروج",
    play_now: "شروع بازی",
    hero_title: "استرال کد",
    hero_tag: "دنیای واقعی را بازی کن. شهر عرصه‌ی تو است؛ دوربین، دستگیره‌ات.",
    how_title: "چگونه کار می‌کند",
    how_1_t: "ثبت‌نام",
    how_1: "در چند ثانیه حساب رایگان بساز.",
    how_2_t: "بازی کن",
    how_2: "با دوربین گوشی، یک بازی واقعیت افزوده اطرافت راه‌اندازی کن.",
    how_3_t: "دریافت",
    how_3: "با تکمیل جلسات، سکه‌ی استرال بکش.",
    how_4_t: "مصرف",
    how_4: "کالاهای ظاهری، آواتار و نشان‌ها را در فروشگاه باز کن.",
    coin_title: "سکه‌ی استرال",
    coin_body:
      "سکه‌های استرال با بازی کسب می‌شوند و صرفا‌ً برای اقلام ظاهری بازی به‌کار می‌روند. ارزش نقدی ندارند و قابل تبدیل به پول نیستند.",
    games_title: "بازی‌ها",
    games_sub: "عرصه‌ات را انتخاب کن.",
    play: "بازی",
    learn_more: "بیشتر بدان",
    reward: "پاداش هر جلسه",
    about_title: "استودیو",
    about_sub:
      "استرال کد یک استودیوی مستقل است که بازی‌های واقعیت افزوده می‌سازد و مکان‌های واقعی را به دنیاهای تعاملی تبدیل می‌کند.",
    team_title: "تیم",
    contact_title: "تماس",
    contact_sub: "سؤال، رسانه یا همکاری.",
    send: "ارسال پیام",
    name: "نام",
    email: "ایمیل",
    message: "پیام",
    privacy: "حریم خصوصی",
    terms: "قوانین و مقررات",
    copyright: "© استرال کد. ارز درون‌بازی — بدون ارزش نقدی.",
    global_lb: "جدول جهانی",
    per_game: "بر حسب بازی",
    shop_title: "فروشگاه",
    shop_sub: "سکه‌های استرال را صرف کالاهای ظاهری کن.",
    dash_title: "داشبورد",
    balance: "موجودی سکه‌ی استرال",
    games_played: "بازی‌های انجام‌شده",
    play_time: "زمان بازی",
    achievements: "دستاوردها",
    tx_history: "تاریخچه‌ی سکه",
    device_req: "نیازمندی‌های دستگاه",
    cam: "دوربین",
    gyro: "ژیروسکوپ",
    gps: "GPS",
    how_to_play: "نحوه‌ی بازی",
    leaderboard: "جدول امتیازات",
    coins_per_session: "سکه در هر جلسه",
    admin: "مدیریت",
    users: "کاربران",
    settings: "تنظیمات",
    verified: "تأییدشده",
    unverified: "تأییدنشده",
  },
};

export function t(key: keyof Dict, lang: Lang = "en"): string {
  return dict[lang][key] ?? dict.en[key] ?? key;
}
