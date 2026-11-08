/* =========================================================
   FARN Studio — site config
   همهٔ چیزهایی که بعداً باید عوض شوند اینجاست:
   لینک‌ها، ایمیل، نمونه‌کارها و پلن‌ها/قیمت‌ها.
   ========================================================= */

window.FARN_CONFIG = {
  /* ---- Contact & socials (placeholders — replace later) ---- */
  contact: {
    phone: "+989120000000",                            // TODO: شماره تماس واقعی (برای لینک tel:)
    phoneDisplay: "+98 912 000 0000",                  // TODO: نمایش شماره
    email: "hello@farn.studio",                        // TODO: ایمیل واقعی
    instagram: "https://instagram.com/farn.studio",    // TODO: آدرس اینستاگرام
    instagramHandle: "@farn.studio",
    youtube: "https://youtube.com/@farnstudio",        // TODO: آدرس یوتیوب
    youtubeHandle: "@farnstudio",
  },

  /* ---- GitHub username (used for projects with a `github` field) ---- */
  githubUser: "your-github-username",                  // TODO

  /* ---- Portfolio ----
     category: "web" | "brand" | "motion"

     For web projects, the live preview source is chosen in this order:
       1. live:   "https://client-site.com"        → site deployed on a server
       2. github: { repo, pages: true }            → https://<user>.github.io/<repo>/
       3. github: { repo, branch, path }           → front-end only, rendered via htmlpreview.github.io
       4. local:  "work/demo-xxx/index.html"       → a demo bundled with this site
     `source` (optional) = link to the GitHub repo shown in the viewer.

     For motion projects: youtubeId: "VIDEO_ID" opens the video in the viewer.
  */
  projects: [
    {
      id: "saffron-cafe",
      category: "web",
      local: "work/demo-cafe/index.html",
      // github: { repo: "saffron-cafe", pages: true },
      source: null,
      year: 2026,
      accent: ["#ff7a4a", "#ff5c8a"],
      title: { en: "Saffron Café", fa: "کافه زعفران" },
      desc: {
        en: "Landing page & online menu for a specialty coffee shop — with live cart.",
        fa: "لندینگ و منوی آنلاین برای یک کافهٔ تخصصی — همراه با سبد خرید زنده.",
      },
      stack: ["HTML", "CSS", "JS"],
    },
    {
      id: "pulse-dashboard",
      category: "web",
      local: "work/demo-dashboard/index.html",
      source: null,
      year: 2026,
      accent: ["#8f7cff", "#6aa8ff"],
      title: { en: "Pulse Analytics", fa: "داشبورد پالس" },
      desc: {
        en: "SaaS analytics dashboard with interactive charts and dark UI.",
        fa: "داشبورد آنالیتیکس SaaS با نمودارهای تعاملی و رابط تیره.",
      },
      stack: ["JS", "Charts", "API"],
    },
    {
      id: "noor-brand",
      category: "brand",
      year: 2026,
      accent: ["#ff7a4a", "#f6f4f1"],
      art: "brand1",
      title: { en: "Noor Skincare", fa: "برند نور" },
      desc: {
        en: "Full identity: logo, palette, packaging and Instagram system.",
        fa: "هویت کامل: لوگو، پالت رنگ، بسته‌بندی و سیستم اینستاگرام.",
      },
      stack: ["Logo", "Guidelines", "Instagram"],
    },
    {
      id: "atlas-brand",
      category: "brand",
      year: 2025,
      accent: ["#6aa8ff", "#8f7cff"],
      art: "brand2",
      title: { en: "Atlas Travel", fa: "آژانس اطلس" },
      desc: {
        en: "Rebrand for a travel agency — mark, type and social templates.",
        fa: "بازطراحی برند آژانس مسافرتی — نشانه، تایپوگرافی و قالب‌های شبکه اجتماعی.",
      },
      stack: ["Rebrand", "Social"],
    },
    {
      id: "farn-reel",
      category: "motion",
      year: 2026,
      accent: ["#ff7a4a", "#ff5c8a"],
      art: "motion1",
      youtubeId: null,                                 // TODO: آیدی ویدیو یوتیوب
      title: { en: "FARN Showreel", fa: "شوریل فرن" },
      desc: {
        en: "Our motion reel — logo animations, UI motion and promos. Coming soon.",
        fa: "شوریل موشن ما — انیمیشن لوگو، موشن رابط کاربری و تیزر. به‌زودی.",
      },
      stack: ["After Effects", "3D"],
    },
    {
      id: "explainer",
      category: "motion",
      year: 2025,
      accent: ["#8f7cff", "#6aa8ff"],
      art: "motion2",
      youtubeId: null,
      title: { en: "Fintech Explainer", fa: "موشن‌گرافیک فین‌تک" },
      desc: {
        en: "60‑second 2D explainer for a payments app launch.",
        fa: "موشن‌گرافیک ۶۰ ثانیه‌ای برای معرفی یک اپ پرداخت.",
      },
      stack: ["2D", "Script", "Voice"],
    },
  ],

  /* ---- YouTube videos (placeholders) — set id: "VIDEO_ID" when ready ---- */
  videos: [
    { id: null, title: { en: "Building a brand from a single shape", fa: "ساخت یک برند از یک شکل ساده" } },
    { id: null, title: { en: "Full‑stack site in a weekend", fa: "یک سایت فول‌استک در یک آخر هفته" } },
    { id: null, title: { en: "Logo animation breakdown", fa: "پشت‌صحنهٔ انیمیشن لوگو" } },
  ],

  /* ---- Plans & pricing (placeholders) ----
     price.usd → English site,  price.irt → Persian site (Toman)
     period: null | "mo"   featured: highlights one plan
  */
  plans: {
    web: [
      {
        id: "web-starter",
        name: { en: "Starter", fa: "پایه" },
        tagline: { en: "A sharp one‑page presence", fa: "یک حضور حرفه‌ای تک‌صفحه‌ای" },
        price: { usd: 490, irt: 18000000 },
        features: {
          en: ["One‑page landing site", "Responsive design", "Contact form", "Basic SEO", "1 revision round"],
          fa: ["سایت لندینگ تک‌صفحه‌ای", "طراحی واکنش‌گرا", "فرم تماس", "سئوی پایه", "۱ مرحله اصلاح"],
        },
      },
      {
        id: "web-business",
        featured: true,
        name: { en: "Business", fa: "کسب‌وکار" },
        tagline: { en: "Multi‑page site with CMS", fa: "سایت چندصفحه‌ای با پنل مدیریت" },
        price: { usd: 1290, irt: 45000000 },
        features: {
          en: ["Up to 8 custom pages", "Admin panel / CMS", "Bilingual (EN / FA)", "Advanced SEO & speed", "Analytics setup", "3 revision rounds"],
          fa: ["تا ۸ صفحهٔ اختصاصی", "پنل مدیریت محتوا", "دو زبانه (فارسی / انگلیسی)", "سئو و سرعت پیشرفته", "راه‌اندازی آنالیتیکس", "۳ مرحله اصلاح"],
        },
      },
      {
        id: "web-fullstack",
        name: { en: "Full‑stack", fa: "فول‌استک" },
        tagline: { en: "Custom web app or store", fa: "وب‌اپ یا فروشگاه اختصاصی" },
        price: { usd: 2900, irt: 110000000, from: true },
        features: {
          en: ["E‑commerce or web app", "Custom back‑end & database", "User accounts & payments", "API integrations", "3 months support"],
          fa: ["فروشگاه یا وب‌اپلیکیشن", "بک‌اند و دیتابیس اختصاصی", "حساب کاربری و درگاه پرداخت", "اتصال به API ها", "۳ ماه پشتیبانی"],
        },
      },
    ],
    brand: [
      {
        id: "brand-logo",
        name: { en: "Logo", fa: "لوگو" },
        tagline: { en: "A mark that lasts", fa: "نشانه‌ای ماندگار" },
        price: { usd: 290, irt: 12000000 },
        features: {
          en: ["3 logo concepts", "Final logo + variations", "Color palette", "All file formats"],
          fa: ["۳ کانسپت لوگو", "لوگوی نهایی + نسخه‌ها", "پالت رنگی", "همهٔ فرمت‌های فایل"],
        },
      },
      {
        id: "brand-complete",
        featured: true,
        name: { en: "Complete Brand", fa: "برندینگ کامل" },
        tagline: { en: "Identity from strategy to system", fa: "هویت کامل از استراتژی تا سیستم" },
        price: { usd: 790, irt: 32000000 },
        features: {
          en: ["Brand strategy & naming help", "Logo suite & icon", "Typography & color system", "Brand guidelines PDF", "Stationery & mockups", "Instagram starter kit"],
          fa: ["استراتژی برند و کمک در نام‌گذاری", "مجموعهٔ لوگو و آیکون", "سیستم رنگ و تایپوگرافی", "کتابچهٔ راهنمای برند", "اوراق اداری و ماکاپ", "کیت شروع اینستاگرام"],
        },
      },
      {
        id: "brand-social",
        name: { en: "Instagram Care", fa: "مدیریت بصری اینستاگرام" },
        tagline: { en: "Monthly content design", fa: "طراحی محتوای ماهانه" },
        price: { usd: 390, irt: 15000000 },
        period: "mo",
        features: {
          en: ["12 post designs / month", "8 story designs", "Highlight covers", "Feed planning"],
          fa: ["۱۲ طرح پست در ماه", "۸ طرح استوری", "کاور هایلایت", "برنامه‌ریزی فید"],
        },
      },
    ],
    motion: [
      {
        id: "motion-logo",
        name: { en: "Logo Motion", fa: "موشن لوگو" },
        tagline: { en: "Bring your mark to life", fa: "لوگوی شما، زنده" },
        price: { usd: 190, irt: 8000000 },
        features: {
          en: ["5–8s logo animation", "Sound design", "4K + social formats"],
          fa: ["انیمیشن ۵ تا ۸ ثانیه‌ای لوگو", "طراحی صدا", "خروجی 4K و فرمت شبکه‌های اجتماعی"],
        },
      },
      {
        id: "motion-explainer",
        featured: true,
        name: { en: "Explainer", fa: "موشن‌گرافیک" },
        tagline: { en: "Tell your story in 60s", fa: "داستان شما در ۶۰ ثانیه" },
        price: { usd: 690, irt: 28000000 },
        features: {
          en: ["Up to 60s 2D animation", "Script & storyboard", "Voice‑over (EN / FA)", "Music & SFX", "2 revision rounds"],
          fa: ["تا ۶۰ ثانیه انیمیشن دوبعدی", "سناریو و استوری‌بورد", "صداگذاری فارسی / انگلیسی", "موسیقی و افکت", "۲ مرحله اصلاح"],
        },
      },
      {
        id: "motion-youtube",
        name: { en: "YouTube Pack", fa: "پکیج یوتیوب" },
        tagline: { en: "Monthly video production", fa: "تولید ویدیوی ماهانه" },
        price: { usd: 990, irt: 40000000 },
        period: "mo",
        features: {
          en: ["4 edited videos / month", "Custom thumbnails", "Intro & lower‑thirds", "8 shorts / reels"],
          fa: ["۴ ویدیوی تدوین‌شده در ماه", "تامبنیل اختصاصی", "اینترو و زیرنویس گرافیکی", "۸ شورتس / ریلز"],
        },
      },
    ],
  },
};
