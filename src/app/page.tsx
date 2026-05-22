"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";
import { PreorderFormNoSSR } from "@/features/preorder/components/preorder-form-no-ssr";

const GOOGLE_LOGO =
  "https://lh3.googleusercontent.com/aida/ADBb0uh2yMI_SzZsA-BvBQfPRKm-QhJaK-JHZ7Lsppm4LvkEtGqzi_fAQ6b-x9GQ_wGOXOSllx14F-BcrCIP76QX47jK9v4sgX_y_n44NvMT0Ds7wuhdYMTKvXPJzeiookNoN-AAXJ7Z-1xy88DDG3qUiGQaTFuDYA5nFi-Je_n82QaIV_LNcm5eZcv7AeRCDGBHzy8KhlUgk0apdGA_JG0nslsJrdJyGBSatgQ06SQi2uMPKZbQeKMnlWZImA";
const EXPLODED_VIEW =
  "https://lh3.googleusercontent.com/aida/ADBb0uh63NbpB_dlZg7bEIzrBttEBE2eT83Aw1ZaKr8jAKzFU9ItX4yN-pC4QDCOD5UnKs9p-3vX6xMs3N4SgrzzdqmjCkvJf7_2Ko3HISb342dywPsRTiH5QLzGtSKJ47NlmVnz6F1v6SNDIKOLyxmDUUg1JE9lSvYAzM2NcSWLA-BLDCKtmQHzD_m_B9EuKN4LeQnffp1i7er-bCpewDqiaoXFfdbZwy5o2DVpNhhPv7uqzklHJHtV_WF7_Q";
const SMART_INTERACTION =
  "https://lh3.googleusercontent.com/aida/ADBb0uh4RswJqPzW2OgIRjNZHwCwUr8GzyB__TAz0ltVjD13f7qxmGqidZT-sjksBo8Y-Anzbfb5Y_NDYp1n4WMQ4BObpXtb1lP5v7fTo6Fo2bbYmQN_Dd9zY0jBU09rumXOiw3loQJx3HBe2x45qmYs-d7K6Fliso0_L2oXtVGHu7-86FJsIRjjMLtJA0CkzszlrTa_Xl0vn29TrxWRJDazSM9v8227Aaee-tUKnuJkum289E9GZAZiPxl33cg";
const BATTERY_IMAGE =
  "https://lh3.googleusercontent.com/aida/ADBb0ugmosDjt8OiMJo7ju3_NSFcObiA3L16_SzS0Sh46Y_FjtauiOS6_57irK67lltMspprBSoxCIrT6lWz2-xS4jcOs1UzDigk2EeNybL9SL_DOdWYHQmyjU2kxk3lByTmfYdP8lhJFPLFr9t3mthkPRiS1fN1CeDc09lLopcbkPoqfn-75eiCg-Yf2z8aU8x1DfWarG9s7ugwuwPFj8Ameq0oaVIxQNbtf-4zaxlDYKVv5vvTWYMDGGEwH9o";
const SPECS_FRONT =
  "https://lh3.googleusercontent.com/aida/ADBb0ujvMVxM1amTqzfE6DBkXPpyKuvzbej6yxqnnyISGanrW0DO_YuxxEaeZzazhAYNffP1R3BEFc3jxuXSvwTn4cPuenOrEyOtUIBxWcLvPcqTeTicAdVbLdhLw8EHY5XnmE8auCa-wdUEK-wQ1XkByv87c0H7IbdxsXMMRrrtmrwqfGZobUZeW2cmnKPD2PB7Rbsq0cRwcP7z63K-n7NrHOr3WFn0KmFgLJb3gQG_S4Mi5-RAjKdactezroQ";
const SPECS_SIDE =
  "https://lh3.googleusercontent.com/aida/ADBb0uh4RswJqPzW2OgIRjNZHwCwUr8GzyB__TAz0ltVjD13f7qxmGqidZT-sjksBo8Y-Anzbfb5Y_NDYp1n4WMQ4BObpXtb1lP5v7fTo6Fo2bbYmQN_Dd9zY0jBU09rumXOiw3loQJx3HBe2x45qmYs-d7K6Fliso0_L2oXtVGHu7-86FJsIRjjMLtJA0CkzszlrTa_Xl0vn29TrxWRJDazSM9v8227Aaee-tUKnuJkum289E9GZAZiPxl33cg";

export default function HomePage() {
  const { t, locale, setLocale } = useI18n();

  return (
    <>
      <BackgroundEffects />
      <TopNavBar locale={locale} setLocale={setLocale} />
      <SideNavBar />
      <main className="relative z-10 pt-32 pb-section-gap flex flex-col items-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <HeroSection />
        <ExplodedViewSection />
        <KeyHighlights />
        <AudioTechSection />
        <SmartInteractionSection />
        <BatterySection />
        <SpecsSection />
        <DesignSection />
        <CTASection />
        <PreorderSection />
      </main>
      <Footer />
    </>
  );
}

function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern" />
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 122, 255, 0.15) 0%, transparent 70%)"
        }}
      />
    </>
  );
}

function TopNavBar({
  locale,
  setLocale
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  const { t } = useI18n();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-xl border-b border-white/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <div className="flex items-center gap-4">
          <Image
            alt="AIva Logo"
            width={24}
            height={24}
            className="object-contain rounded-md"
            src={GOOGLE_LOGO}
          />
          <span className="font-display-lg-mobile text-display-lg-mobile font-bold text-secondary-fixed tracking-tighter hidden md:block">
            {t.brand}
          </span>
        </div>

        <ul className="hidden md:flex gap-8 items-center">
          {[
            { label: t.navExperience, href: "#experience" },
            { label: t.navTech, href: "#tech" },
            { label: t.navSpecs, href: "#specs" },
            { label: t.navReserve, href: "#reserve" }
          ].map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors hover:bg-white/5 px-3 py-2 rounded-lg"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="bg-transparent text-xs uppercase tracking-wider text-on-surface-variant border border-white/10 rounded px-2 py-1 cursor-pointer"
          >
            <option value="vi">VI</option>
            <option value="en">EN</option>
          </select>
          <a
            href="#reserve"
            className="hidden md:flex items-center justify-center bg-brand-gold text-on-secondary-fixed font-label-sm text-label-sm px-6 py-2 rounded-full hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all duration-300"
          >
            {t.ctaBuy}
          </a>
          <button className="text-on-surface hover:text-secondary-fixed transition-colors">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              shopping_bag
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function SideNavBar() {
  const { t } = useI18n();

  const layers = [
    { label: t.layerCore, icon: "layers", active: true },
    { label: t.layerOptics, icon: "visibility", active: false },
    { label: t.layerNeural, icon: "memory", active: false },
    { label: t.layerFrame, icon: "architecture", active: false }
  ];

  return (
    <aside className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 bg-surface-container-lowest/30 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-full py-8 flex-col gap-base items-center px-4">
      {layers.map(({ label, icon, active }) => (
        <div key={label}>
          <button
            aria-label={label}
            className={`group flex flex-col items-center gap-2 p-2 cursor-pointer hover:scale-110 transition-transform duration-500 ${
              active
                ? "text-secondary-fixed scale-110"
                : "text-on-surface-variant opacity-50 hover:opacity-100"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0"
              }}
            >
              {icon}
            </span>
            <span className="font-label-sm text-[10px] absolute -left-16 opacity-0 group-hover:opacity-100 transition-opacity text-secondary-fixed">
              {label}
            </span>
          </button>
          <div className="w-px h-8 bg-white/10 my-2" />
        </div>
      ))}
    </aside>
  );
}

function HeroSection() {
  const { t } = useI18n();

  return (
    <div className="text-center mb-stack-lg z-20 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-brand-gold/60" />
        <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-brand-gold/60">
          {t.brand}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-brand-gold/60" />
      </div>
      <p className="font-body-lg text-body-lg text-on-surface-variant/90 max-w-2xl mx-auto leading-relaxed">
        {t.heroSubtitle}
      </p>
    </div>
  );
}

function ExplodedViewSection() {
  const { t } = useI18n();

  return (
    <div className="relative w-full max-w-4xl aspect-[4/3] max-h-[55vh] mb-section-gap flex items-center justify-center z-20">
      <div className="relative w-full h-full animate-float">
        <Image
          alt="AIva 3D Exploded View"
          fill
          className="object-contain filter drop-shadow-2xl"
          src={EXPLODED_VIEW}
          sizes="(max-width: 1440px) 100vw, 1440px"
        />
        <div className="absolute top-[30%] left-[35%] w-4 h-4 rounded-full bg-secondary-fixed hotspot-ring z-20 cursor-pointer group">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 glass-card p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            <p className="font-label-sm text-label-sm text-secondary-fixed">
              {t.hotspotDisplay}
            </p>
          </div>
        </div>
        <div className="absolute top-[60%] right-[40%] w-4 h-4 rounded-full bg-primary-fixed-dim hotspot-ring z-20 cursor-pointer group">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 glass-card p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            <p className="font-label-sm text-label-sm text-primary-fixed-dim">
              {t.hotspotHaptic}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyHighlights() {
  const { t } = useI18n();

  const highlights = [
    { icon: "architecture", title: t.highlight1Title, desc: t.highlight1Desc },
    { icon: "memory", title: t.highlight2Title, desc: t.highlight2Desc },
    { icon: "visibility", title: t.highlight3Title, desc: t.highlight3Desc },
    { icon: "hearing", title: t.highlight4Title, desc: t.highlight4Desc }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter w-full mb-section-gap z-20">
      {highlights.map(({ icon, title, desc }) => (
        <div
          key={title}
          className="glass-card rounded-xl p-8 flex flex-col gap-4 items-start group"
        >
          <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-2 group-hover:scale-110 transition-transform">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
          <h3 className="font-headline-md-mobile text-headline-md-mobile text-on-surface">
            {title}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}

function AudioTechSection() {
  const { t } = useI18n();

  const items = [
    { icon: "surround_sound", title: t.audio1Title, desc: t.audio1Desc },
    { icon: "mic_noise_cancel_high", title: t.audio2Title, desc: t.audio2Desc },
    { icon: "privacy_tip", title: t.audio3Title, desc: t.audio3Desc }
  ];

  return (
    <div className="w-full mb-section-gap z-20">
      <h2 className="font-headline-md text-headline-md text-center text-brand-gold mb-stack-lg">
        {t.audioTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {items.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="glass-card rounded-xl p-8 flex flex-col gap-4 items-center text-center group"
          >
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
            </div>
            <h3 className="font-headline-md-mobile text-headline-md-mobile text-on-surface">
              {title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmartInteractionSection() {
  const { t } = useI18n();

  return (
    <div
      id="experience"
      className="w-full mb-section-gap z-20 scroll-mt-24 flex flex-col md:flex-row items-center gap-gutter"
    >
      <div className="flex-1">
        <h2 className="font-headline-md text-headline-md text-brand-gold mb-stack-lg">
          {t.interactionTitle}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
          {t.interactionDesc}
        </p>
        <ul className="space-y-4 font-body-md text-on-surface-variant">
          {[t.interaction1, t.interaction2, t.interaction3].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-gold">
                touch_app
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 glass-card rounded-xl p-8 flex justify-center items-center">
        <Image
          alt="Smart Interaction"
          width={500}
          height={500}
          className="w-full max-w-md object-contain rounded-lg"
          src={SMART_INTERACTION}
        />
      </div>
    </div>
  );
}

function BatterySection() {
  const { t } = useI18n();

  return (
    <div
      id="tech"
      className="w-full mb-section-gap z-20 scroll-mt-24 flex flex-col md:flex-row-reverse items-center gap-gutter"
    >
      <div className="flex-1">
        <h2 className="font-headline-md text-headline-md text-brand-gold mb-stack-lg">
          {t.batteryTitle}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
          {t.batteryDesc}
        </p>
        <div className="flex flex-col gap-4 font-body-md text-on-surface-variant mt-6">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
            <span className="material-symbols-outlined text-brand-gold text-4xl">
              battery_charging_full
            </span>
            <div>
              <strong className="text-on-surface text-lg">
                {t.batteryHours}
              </strong>
              <br />
              {t.batteryHoursDesc}
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
            <span className="material-symbols-outlined text-brand-gold text-4xl">
              bolt
            </span>
            <div>
              <strong className="text-on-surface text-lg">
                {t.batteryCharge}
              </strong>
              <br />
              {t.batteryChargeDesc}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Image
          alt="Battery & Performance"
          width={500}
          height={500}
          className="w-full max-w-md object-contain"
          src={BATTERY_IMAGE}
        />
      </div>
    </div>
  );
}

function SpecsSection() {
  const { t } = useI18n();

  return (
    <div id="specs" className="w-full mb-section-gap z-20 scroll-mt-24">
      <h2 className="font-headline-md text-headline-md text-center text-brand-gold mb-stack-lg">
        {t.specsTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="glass-card rounded-xl p-4 flex flex-col items-center">
          <Image
            alt="Front View"
            width={500}
            height={300}
            className="w-full h-auto object-cover rounded-lg mb-4"
            src={SPECS_FRONT}
          />
          <p className="font-label-sm text-center text-on-surface-variant">
            {t.specs1Label}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col items-center">
          <Image
            alt="Side View"
            width={500}
            height={300}
            className="w-full h-auto object-cover rounded-lg mb-4"
            src={SPECS_SIDE}
          />
          <p className="font-label-sm text-center text-on-surface-variant">
            {t.specs2Label}
          </p>
        </div>
      </div>
    </div>
  );
}

function DesignSection() {
  const { t } = useI18n();

  return (
    <div className="w-full mb-section-gap z-20 text-center glass-card p-12 rounded-2xl">
      <h2 className="font-headline-md text-headline-md text-brand-gold mb-6">
        {t.designTitle}
      </h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto mb-8">
        {t.designDesc}
      </p>
    </div>
  );
}

function CTASection() {
  const { t } = useI18n();

  return (
    <div
      id="reserve"
      className="flex flex-col md:flex-row gap-6 items-center justify-center z-20 mb-section-gap scroll-mt-24"
    >
      <a
        href="#preorder-form"
        className="bg-brand-gold text-on-secondary-fixed font-label-sm text-label-sm px-8 py-4 rounded-full hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300 w-full md:w-auto text-center"
      >
        {t.ctaPrimary}
      </a>
      <a
        href="#specs"
        className="glass-panel text-on-surface font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 w-full md:w-auto text-center border border-white/20"
      >
        {t.ctaSecondary}
      </a>
    </div>
  );
}

function PreorderSection() {
  return (
    <div
      id="preorder-form"
      className="w-full max-w-2xl z-20 mb-section-gap glass-card rounded-2xl p-8"
    >
      <PreorderFormNoSSR />
    </div>
  );
}

function Footer() {
  const { t } = useI18n();

  const links = [
    { label: t.footerSecurity, href: "#" },
    { label: t.footerTerms, href: "#" },
    { label: t.footerSupport, href: "#" },
    { label: t.footerContact, href: "#" }
  ];

  return (
    <footer className="w-full py-margin-desktop bg-background border-t border-outline-variant/20 relative z-20">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-stack-lg md:gap-0">
        <div className="font-headline-md text-headline-md text-primary flex items-center gap-4">
          <Image
            alt="AIva Footer Logo"
            width={24}
            height={24}
            className="object-contain rounded-sm opacity-50 transition-all"
            src={GOOGLE_LOGO}
          />
          <span className="text-sm tracking-widest text-on-surface-variant/50">
            {t.tagline}
          </span>
        </div>
        <ul className="flex flex-wrap justify-center gap-8">
          {links.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="font-label-sm text-label-sm text-on-surface-variant/50 text-center md:text-right">
          {t.footerCopyright}
        </div>
      </div>
    </footer>
  );
}
