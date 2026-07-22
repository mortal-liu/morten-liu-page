"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type PanelId = "story" | "favorites" | "pictures" | "thinking";
type FavoriteId = "music" | "screen" | "books";

const featuredQuotes = [
  {
    text: "圣诞树无论是位于地下室房间里，还是无人光顾的街角小店，总会闪闪发光。",
    source: "《苦尽柑来遇见你》",
    author: "",
    citation: "南山塔夜景",
    lang: "zh-CN",
    medium: "SERIES / POSTER",
    coverTitle: "苦尽柑来遇见你",
    coverMeta: "苦尽柑来遇见你 · POSTER",
    image: "/quotes/when-life-gives-you-tangerines-poster.jpg",
    backdropImage: "/quotes/when-life-gives-you-tangerines.jpg",
    imageAlt: "《苦尽柑来遇见你》竖版海报",
    imageOpacity: 0.44,
    theme: "night",
  },
  {
    text: "如果你也来自小镇，成功从来不靠等待。",
    source: "《你给的恨》",
    author: "Asen艾志恒",
    citation: "专辑《在雨后醒来》",
    lang: "zh-CN",
    medium: "MUSIC / ALBUM",
    coverTitle: "在雨后醒来",
    coverMeta: "ASEN · ALBUM",
    image: "/quotes/after-rain.jpg",
    backdropImage: "/quotes/after-rain.jpg",
    imageAlt: "Asen《在雨后醒来》专辑封面",
    imageOpacity: 0.34,
    theme: "clay",
  },
  {
    text: "从来如此，便对么？",
    source: "《狂人日记》",
    author: "鲁迅",
    citation: "收录于《呐喊》",
    lang: "zh-CN",
    medium: "BOOK / LITERATURE",
    coverTitle: "狂人日记",
    coverMeta: "鲁迅 · 1918",
    image: "/quotes/madmans-diary.jpg",
    backdropImage: "/quotes/madmans-diary.jpg",
    imageAlt: "鲁迅《狂人日记》书封",
    imageOpacity: 0.2,
    theme: "moss",
  },
  {
    text: "Who looks outside, dreams; who looks inside, awakes.",
    source: "Carl Gustav Jung",
    author: "",
    citation: "Letter (1916), published in C. G. Jung Letters, Vol. 1",
    lang: "en",
    medium: "BOOK / LETTERS",
    coverTitle: "C. G. JUNG LETTERS",
    coverMeta: "VOL. 1 · 1906—1950",
    image: "/quotes/jung-letters-vol-1.jpg",
    backdropImage: "/quotes/jung-letters-vol-1.jpg",
    imageAlt: "C. G. Jung Letters, Volume 1 书封",
    imageOpacity: 0.34,
    theme: "ink",
  },
];

const portals: Array<{ id: PanelId; index: string; title: string; subtitle: string }> = [
  { id: "story", index: "01", title: "STORY", subtitle: "人生经历" },
  { id: "favorites", index: "02", title: "FAVORITES", subtitle: "音乐 · 影视 · 书" },
  { id: "pictures", index: "03", title: "PICTURES", subtitle: "影像与瞬间" },
  { id: "thinking", index: "04", title: "THINKING", subtitle: "一些想法" },
];

const panelTitles: Record<PanelId, string> = {
  story: "STORY",
  favorites: "FAVORITES",
  pictures: "PICTURES",
  thinking: "THINKING",
};

const favoriteSections: Array<{
  id: FavoriteId;
  index: string;
  title: string;
  chineseTitle: string;
  categories: string;
  note: string;
}> = [
  {
    id: "music",
    index: "01",
    title: "MUSIC",
    chineseTitle: "音乐",
    categories: "SONGS / ALBUMS",
    note: "歌曲、专辑与反复播放的声音。",
  },
  {
    id: "screen",
    index: "02",
    title: "SCREEN",
    chineseTitle: "影视",
    categories: "FILMS / SERIES / ANIMATION",
    note: "电影、电视剧与动漫。",
  },
  {
    id: "books",
    index: "03",
    title: "BOOKS",
    chineseTitle: "书籍",
    categories: "BOOKS / AUTHORS / PASSAGES",
    note: "书籍、作者与留下来的段落。",
  },
];

const musicFavorites = [
  {
    title: "焦虑",
    artist: "艾志恒Asen · Maikon Flocka Flame",
    image: "/favorites/music/anxiety.jpg",
  },
  {
    title: "小镇的孩子",
    artist: "艾志恒Asen",
    image: "/favorites/music/small-town-child.jpg",
  },
  {
    title: "你给的恨",
    artist: "艾志恒Asen · Maikon Flocka Flame",
    image: "/favorites/music/the-hate-you-gave.jpg",
  },
];

type ScreenKind = "电影" | "电视剧" | "动漫";

const screenFavorites: Array<{ title: string; kind: ScreenKind; image: string }> = [
  { title: "搏击俱乐部", kind: "电影", image: "/favorites/screen/fight-club.jpg" },
  { title: "帕特森", kind: "电影", image: "/favorites/screen/paterson.jpg" },
  { title: "苦尽柑来遇见你", kind: "电视剧", image: "/favorites/screen/tangerines.jpg" },
  { title: "绝命毒师", kind: "电视剧", image: "/favorites/screen/breaking-bad.jpg" },
  { title: "风骚律师", kind: "电视剧", image: "/favorites/screen/better-call-saul.jpg" },
  { title: "进击的巨人", kind: "动漫", image: "/favorites/screen/attack-on-titan.jpg" },
  { title: "我的青春恋爱物语果然有问题", kind: "动漫", image: "/favorites/screen/oregairu.jpg" },
];

const bookFavorites = [
  { title: "活着", author: "余华", type: "小说", image: "/favorites/books/to-live.jpg" },
  { title: "被讨厌的勇气", author: "岸见一郎 · 古贺史健", type: "心理 / 哲学", image: "/favorites/books/courage-to-be-disliked.jpg" },
  { title: "小岛经济学", author: "彼得·希夫 · 安德鲁·希夫", type: "经济学", image: "/favorites/books/island-economics.jpg" },
];

export default function Home() {
  const [activeFavorite, setActiveFavorite] = useState<FavoriteId | null>(null);
  const [favoriteView, setFavoriteView] = useState<FavoriteId | null>(null);
  const [musicSelection, setMusicSelection] = useState(0);
  const [screenKind, setScreenKind] = useState<ScreenKind>("电影");
  const [screenSelection, setScreenSelection] = useState(0);
  const [bookSelection, setBookSelection] = useState(0);
  const pageRef = useRef<HTMLElement>(null);
  const favoriteEnterTimerRef = useRef<number | null>(null);
  const favoriteViewRef = useRef<FavoriteId | null>(null);
  const skipIntroRef = useRef<() => void>(() => undefined);
  const changeQuoteRef = useRef<(direction: number) => void>(() => undefined);
  const openPanelRef = useRef<(panel: PanelId) => void>(() => undefined);
  const closePanelRef = useRef<() => void>(() => undefined);

  useLayoutEffect(() => {
    favoriteViewRef.current = favoriteView;
  }, [favoriteView]);

  const enterFavoriteSection = (id: FavoriteId) => {
    if (favoriteEnterTimerRef.current) window.clearTimeout(favoriteEnterTimerRef.current);
    setActiveFavorite(id);
    favoriteEnterTimerRef.current = window.setTimeout(() => {
      setFavoriteView(id);
      favoriteEnterTimerRef.current = null;
      window.setTimeout(() => pageRef.current?.querySelector<HTMLButtonElement>("[data-favorite-back]")?.focus(), 40);
    }, 520);
  };

  const leaveFavoriteSection = () => {
    const previousView = favoriteView;
    setFavoriteView(null);
    setActiveFavorite(null);
    window.setTimeout(() => {
      if (previousView) pageRef.current?.querySelector<HTMLButtonElement>(`[data-favorite-column="${previousView}"]`)?.focus();
    }, 40);
  };

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = page.querySelector<HTMLElement>("[data-intro]");
    const homeScreen = page.querySelector<HTMLElement>("[data-home-screen]");
    const transition = page.querySelector<HTMLElement>("[data-page-transition]");
    const transitionLabel = page.querySelector<HTMLElement>("[data-transition-label]");
    const quoteHero = page.querySelector<HTMLElement>(".quote-hero");
    const quoteText = page.querySelector<HTMLElement>("[data-quote-text]");
    const quoteSource = page.querySelector<HTMLElement>("[data-quote-source]");
    const quoteCitation = page.querySelector<HTMLElement>("[data-quote-citation]");
    const quoteCounter = page.querySelector<HTMLElement>("[data-quote-counter]");
    const coverTitle = page.querySelector<HTMLElement>("[data-cover-title]");
    const coverMedium = page.querySelector<HTMLElement>("[data-cover-medium]");
    const coverMeta = page.querySelector<HTMLElement>("[data-cover-meta]");
    const coverIndex = page.querySelector<HTMLElement>("[data-cover-index]");
    const coverImages = Array.from(page.querySelectorAll<HTMLImageElement>("[data-cover-image]"));
    const backdropImages = Array.from(page.querySelectorAll<HTMLImageElement>("[data-quote-backdrop-image]"));
    const quoteStage = page.querySelector<HTMLElement>("[data-quote-stage]");

    let introTimeline: gsap.core.Timeline | null = null;
    let introExitTimeline: gsap.core.Timeline | null = null;
    let quoteTimeline: gsap.core.Timeline | null = null;
    let quoteProgress: gsap.core.Tween | null = null;
    let panelTimeline: gsap.core.Timeline | null = null;
    let quoteIndex = 0;
    let activePanel: PanelId | null = null;
    let introIsExiting = false;
    let panelIsTransitioning = false;
    let quoteIsTransitioning = false;
    let mediaSlot = 0;
    let disposed = false;

    document.body.classList.add("experience-lock");
    page.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => panel.setAttribute("inert", ""));

    const writeQuote = (index: number) => {
      const quote = featuredQuotes[index];
      if (quoteText) {
        quoteText.textContent = quote.text;
        quoteText.closest("blockquote")?.setAttribute("lang", quote.lang);
      }
      if (quoteSource) quoteSource.textContent = [quote.source, quote.author].filter(Boolean).join(" · ");
      if (quoteCitation) quoteCitation.textContent = quote.citation;
      if (quoteCounter) quoteCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(featuredQuotes.length).padStart(2, "0")}`;
      if (coverTitle) coverTitle.textContent = quote.coverTitle;
      if (coverMedium) coverMedium.textContent = quote.medium;
      if (coverMeta) coverMeta.textContent = quote.coverMeta;
      if (coverIndex) coverIndex.textContent = `M—L / ${String(index + 1).padStart(3, "0")}`;
      quoteHero?.style.setProperty("--quote-image-opacity", String(quote.imageOpacity));
      quoteHero?.setAttribute("data-quote-theme", quote.theme);
      quoteHero?.setAttribute("data-quote-length", quote.text.length > 30 ? "long" : "standard");
    };

    const prepareQuoteMedia = async (index: number, slot: number) => {
      const quote = featuredQuotes[index];
      const cover = coverImages[slot];
      const backdrop = backdropImages[slot];

      if (cover) {
        cover.src = quote.image;
        cover.alt = quote.imageAlt;
      }
      if (backdrop) backdrop.src = quote.backdropImage;

      await Promise.all(
        [cover, backdrop].filter((image): image is HTMLImageElement => Boolean(image)).map((image) => {
          if (!image.decode) return Promise.resolve();
          return image.decode().catch(() => undefined);
        }),
      );
    };

    const scheduleQuote = () => {
      quoteProgress?.kill();
      if (activePanel || reducedMotion) return;
      quoteProgress = gsap.delayedCall(6, () => changeQuoteRef.current(1));
    };

    changeQuoteRef.current = (direction: number) => {
      void (async () => {
        if (quoteTimeline?.isActive() || quoteIsTransitioning || activePanel || panelIsTransitioning) return;
        quoteIsTransitioning = true;

        const nextIndex = (quoteIndex + direction + featuredQuotes.length) % featuredQuotes.length;
        const nextSlot = mediaSlot === 0 ? 1 : 0;
        quoteProgress?.kill();
        await prepareQuoteMedia(nextIndex, nextSlot);

        if (disposed || activePanel || panelIsTransitioning) {
          quoteIsTransitioning = false;
          return;
        }

        const outgoingCover = coverImages[mediaSlot];
        const incomingCover = coverImages[nextSlot];
        const outgoingBackdrop = backdropImages[mediaSlot];
        const incomingBackdrop = backdropImages[nextSlot];

        if (reducedMotion) {
          quoteIndex = nextIndex;
          writeQuote(quoteIndex);
          gsap.set([outgoingCover, outgoingBackdrop].filter(Boolean), { autoAlpha: 0 });
          gsap.set([incomingCover, incomingBackdrop].filter(Boolean), { autoAlpha: 1, scale: 1 });
          mediaSlot = nextSlot;
          quoteIsTransitioning = false;
          return;
        }

        quoteTimeline = gsap
          .timeline({
            defaults: { ease: "sine.inOut" },
            onComplete: () => {
              mediaSlot = nextSlot;
              quoteIsTransitioning = false;
              scheduleQuote();
            },
          })
          .to(".quote-text, .quote-attribution-inner, .quote-cover-copy", {
            y: direction > 0 ? -30 : 30,
            autoAlpha: 0,
            duration: 0.38,
            stagger: 0.025,
          }, 0)
          .to(outgoingBackdrop, { scale: 1.045, autoAlpha: 0, duration: 0.62 }, 0)
          .fromTo(incomingBackdrop, { scale: 1.08, autoAlpha: 0 }, { scale: 1.02, autoAlpha: 1, duration: 0.92 }, 0.1)
          .to(outgoingCover, { scale: 1.025, autoAlpha: 0, duration: 0.54 }, 0.02)
          .fromTo(incomingCover, { scale: 1.06, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.78, ease: "power2.out" }, 0.12)
          .add(() => {
            quoteIndex = nextIndex;
            writeQuote(quoteIndex);
          }, 0.38)
          .set(".quote-text, .quote-attribution-inner, .quote-cover-copy", { y: direction > 0 ? 34 : -34 }, 0.4)
          .to(".quote-text, .quote-attribution-inner, .quote-cover-copy", {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.045,
            ease: "power4.out",
          }, 0.42);
      })();
    };

    const revealPanelImmediately = (id: PanelId) => {
      const target = page.querySelector<HTMLElement>(`[data-panel="${id}"]`);
      if (!target || !homeScreen) return;
      gsap.set(homeScreen, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(target, { autoAlpha: 1, pointerEvents: "auto" });
      target.setAttribute("aria-hidden", "false");
      target.removeAttribute("inert");
      activePanel = id;
    };

    openPanelRef.current = (id: PanelId) => {
      if (activePanel || panelIsTransitioning) return;
      const target = page.querySelector<HTMLElement>(`[data-panel="${id}"]`);
      const sourceButton = page.querySelector<HTMLElement>(`[data-portal="${id}"]`);
      if (!target || !homeScreen || !transition || !transitionLabel) return;

      quoteProgress?.pause();
      transitionLabel.textContent = panelTitles[id];

      if (reducedMotion) {
        revealPanelImmediately(id);
        target.querySelector<HTMLButtonElement>("[data-panel-close]")?.focus();
        return;
      }

      panelIsTransitioning = true;
      const color = getComputedStyle(sourceButton ?? target).getPropertyValue("--portal-color").trim() || "#263229";
      const bounds = sourceButton?.getBoundingClientRect();
      const originX = bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2;
      const originY = bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2;
      transition.style.setProperty("--transition-color", color);
      transition.style.setProperty("--origin-x", `${originX}px`);
      transition.style.setProperty("--origin-y", `${originY}px`);

      panelTimeline = gsap
        .timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            panelIsTransitioning = false;
            target.querySelector<HTMLButtonElement>("[data-panel-close]")?.focus();
          },
        })
        .set(transition, { autoAlpha: 1, pointerEvents: "auto" })
        .set(".page-transition-canopy", { clipPath: `circle(0% at ${originX}px ${originY}px)` })
        .set(".transition-branch", { scaleX: 0, transformOrigin: "left center" })
        .set(".branch-leaf", { scale: 0, autoAlpha: 0 })
        .set(".transition-leaf", { scale: 0, rotate: -55, autoAlpha: 0 })
        .to(".transition-branch", { scaleX: 1, duration: 0.72, stagger: 0.035, ease: "power3.out" }, 0)
        .to(".branch-leaf", { scale: 1, autoAlpha: 1, duration: 0.42, stagger: 0.018, ease: "back.out(1.5)" }, 0.18)
        .to(".transition-leaf", { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.48, stagger: 0.025, ease: "back.out(1.7)" }, 0.16)
        .to(".page-transition-canopy", { clipPath: `circle(155% at ${originX}px ${originY}px)`, duration: 0.94 }, 0.08)
        .fromTo(transitionLabel, { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.72 }, 0.34)
        .add(() => {
          gsap.set(homeScreen, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(target, { autoAlpha: 1, pointerEvents: "auto" });
          target.setAttribute("aria-hidden", "false");
          target.removeAttribute("inert");
          activePanel = id;
        }, 0.88)
        .to(transitionLabel, { yPercent: -120, duration: 0.42 }, 0.92)
        .to(".transition-leaf", { y: -26, rotate: 28, autoAlpha: 0, duration: 0.52, stagger: 0.018 }, 0.94)
        .to(".transition-branch", { scaleX: 0, transformOrigin: "left center", duration: 0.54, stagger: 0.018 }, 0.98)
        .to(".page-transition-canopy", { clipPath: "circle(0% at 50% 0%)", duration: 0.86 }, 1.02)
        .fromTo(target.querySelectorAll("[data-panel-reveal]"), { y: 42, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.06, ease: "power3.out" }, 1.08)
        .set(transition, { autoAlpha: 0, pointerEvents: "none" });
    };

    closePanelRef.current = () => {
      if (!activePanel || panelIsTransitioning || !homeScreen || !transition || !transitionLabel) return;
      const closingId = activePanel;
      const target = page.querySelector<HTMLElement>(`[data-panel="${closingId}"]`);
      if (!target) return;

      if (closingId === "favorites") {
        if (favoriteEnterTimerRef.current) window.clearTimeout(favoriteEnterTimerRef.current);
        favoriteEnterTimerRef.current = null;
        setFavoriteView(null);
        setActiveFavorite(null);
      }

      if (reducedMotion) {
        gsap.set(target, { autoAlpha: 0, pointerEvents: "none" });
        target.setAttribute("aria-hidden", "true");
        target.setAttribute("inert", "");
        gsap.set(homeScreen, { autoAlpha: 1, pointerEvents: "auto" });
        activePanel = null;
        scheduleQuote();
        page.querySelector<HTMLButtonElement>(`[data-portal="${closingId}"]`)?.focus();
        return;
      }

      panelIsTransitioning = true;
      transitionLabel.textContent = "MORTEN—LIU";
      const color = getComputedStyle(target).getPropertyValue("--portal-color").trim() || "#263229";
      const closeButton = target.querySelector<HTMLElement>("[data-panel-close]");
      const closeBounds = closeButton?.getBoundingClientRect();
      const originX = closeBounds ? closeBounds.left + closeBounds.width / 2 : window.innerWidth - 60;
      const originY = closeBounds ? closeBounds.top + closeBounds.height / 2 : 50;
      transition.style.setProperty("--transition-color", color);
      transition.style.setProperty("--origin-x", `${originX}px`);
      transition.style.setProperty("--origin-y", `${originY}px`);

      panelTimeline = gsap
        .timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            panelIsTransitioning = false;
            scheduleQuote();
            page.querySelector<HTMLButtonElement>(`[data-portal="${closingId}"]`)?.focus();
          },
        })
        .set(transition, { autoAlpha: 1, pointerEvents: "auto" })
        .set(".page-transition-canopy", { clipPath: `circle(0% at ${originX}px ${originY}px)` })
        .set(".transition-branch", { scaleX: 0, transformOrigin: "left center" })
        .set(".branch-leaf", { scale: 0, autoAlpha: 0 })
        .set(".transition-leaf", { scale: 0, rotate: 48, autoAlpha: 0, y: 0 })
        .to(".transition-branch", { scaleX: 1, duration: 0.66, stagger: 0.03, ease: "power3.out" })
        .to(".branch-leaf", { scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.016, ease: "back.out(1.45)" }, 0.16)
        .to(".transition-leaf", { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.45, stagger: 0.022, ease: "back.out(1.6)" }, 0.12)
        .to(".page-transition-canopy", { clipPath: `circle(155% at ${originX}px ${originY}px)`, duration: 0.88 }, 0.06)
        .fromTo(transitionLabel, { yPercent: 120 }, { yPercent: 0, duration: 0.6 }, 0.3)
        .add(() => {
          gsap.set(target, { autoAlpha: 0, pointerEvents: "none" });
          target.setAttribute("aria-hidden", "true");
          target.setAttribute("inert", "");
          gsap.set(homeScreen, { autoAlpha: 1, pointerEvents: "auto" });
          activePanel = null;
        }, 0.84)
        .to(transitionLabel, { yPercent: -120, duration: 0.4 }, 0.88)
        .to(".transition-leaf", { y: 30, rotate: -28, autoAlpha: 0, duration: 0.48, stagger: 0.016 }, 0.9)
        .to(".transition-branch", { scaleX: 0, transformOrigin: "left center", duration: 0.5, stagger: 0.016 }, 0.94)
        .to(".page-transition-canopy", { clipPath: "circle(0% at 50% 100%)", duration: 0.82 }, 0.98)
        .fromTo("[data-home-return]", { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.045, ease: "power3.out" }, 1.02)
        .set(transition, { autoAlpha: 0, pointerEvents: "none" });
    };

    const releaseIntro = () => {
      document.body.classList.remove("intro-lock");
      if (intro) gsap.set(intro, { autoAlpha: 0, pointerEvents: "none" });
      scheduleQuote();
    };

    writeQuote(quoteIndex);

    if (reducedMotion) {
      releaseIntro();
      gsap.set("[data-home-reveal]", { yPercent: 0, autoAlpha: 1 });
    } else {
      document.body.classList.add("intro-lock");

      const exitIntro = () => {
        if (introIsExiting) return;
        introIsExiting = true;
        introTimeline?.kill();
        introExitTimeline = gsap
          .timeline({ defaults: { ease: "power3.inOut" }, onComplete: releaseIntro })
          .set(".intro-wind-leaf", { x: -window.innerWidth * 0.18, autoAlpha: 0 })
          .to(".intro-wind-leaf", { autoAlpha: 1, duration: 0.12, stagger: 0.02 }, 0)
          .to(".intro-wind-leaf", {
            x: window.innerWidth * 1.28,
            y: () => gsap.utils.random(-48, 72),
            rotate: () => gsap.utils.random(260, 680),
            duration: 1.3,
            stagger: 0.035,
            ease: "power1.inOut",
          }, 0)
          .to(".intro-content", { x: 48, filter: "blur(4px)", autoAlpha: 0, duration: 0.58, ease: "power2.in" }, 0.4)
          .to(".intro-skip, .intro-halo", { x: 26, autoAlpha: 0, duration: 0.48 }, 0.26)
          .to(".intro-tree", {
            x: `+=${window.innerWidth * 0.68}`,
            y: -34,
            rotate: 11,
            skewX: -2.5,
            autoAlpha: 0,
            duration: 1.15,
            ease: "power2.in",
          }, 0.2)
          .to(".intro-leaf", {
            x: () => gsap.utils.random(90, 280),
            y: () => gsap.utils.random(-70, 64),
            rotate: () => gsap.utils.random(120, 360),
            autoAlpha: 0,
            duration: 0.95,
            stagger: 0.022,
            ease: "power2.in",
          }, 0.3)
          .fromTo("[data-home-reveal]", { yPercent: 82, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.88, stagger: 0.05 }, 0.78)
          .to(".intro-wind-leaf", { autoAlpha: 0, duration: 0.25, stagger: 0.02 }, 1.3)
          .to(intro, { autoAlpha: 0, duration: 0.65, ease: "sine.inOut" }, 1.22);
      };

      introTimeline = gsap
        .timeline({ defaults: { ease: "power4.out" }, onComplete: exitIntro })
        .set(intro, { autoAlpha: 1, animation: "none" })
        .fromTo(".intro-halo-ring", { scale: 0.18, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1, stagger: 0.08 }, 0.08)
        .fromTo(".intro-signal-dot", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.52 }, 0.18)
        .fromTo(".intro-trunk", { scaleY: 0 }, { scaleY: 1, duration: 0.82, ease: "power3.inOut" }, 0.08)
        .fromTo(".intro-branch", { scaleX: 0 }, { scaleX: 1, duration: 0.62, stagger: 0.055, ease: "power3.out" }, 0.34)
        .fromTo(".intro-leaf", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.48, stagger: 0.028, ease: "back.out(1.8)" }, 0.54)
        .fromTo(".intro-letter", { yPercent: 145, rotateZ: 8 }, { yPercent: 0, rotateZ: 0, duration: 0.88, stagger: 0.045 }, 0.3)
        .fromTo(".intro-subline-inner", { yPercent: 120 }, { yPercent: 0, duration: 0.7 }, 0.76)
        .fromTo(".intro-skip", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42 }, 0.78);

      skipIntroRef.current = exitIntro;
    }

    const pauseOnHover = () => quoteProgress?.pause();
    const resumeAfterHover = () => {
      if (!activePanel) quoteProgress?.resume();
    };
    quoteStage?.addEventListener("pointerenter", pauseOnHover);
    quoteStage?.addEventListener("pointerleave", resumeAfterHover);

    const onKeydown = (event: KeyboardEvent) => {
      const introVisible = intro && gsap.getProperty(intro, "visibility") !== "hidden";
      if (event.key === "Escape") {
        if (introVisible) skipIntroRef.current();
        else if (activePanel === "favorites" && favoriteViewRef.current) {
          setFavoriteView(null);
          setActiveFavorite(null);
        } else if (activePanel) closePanelRef.current();
      }
      if (!introVisible && !activePanel) {
        if (event.key === "ArrowLeft") changeQuoteRef.current(-1);
        if (event.key === "ArrowRight") changeQuoteRef.current(1);
      }
    };
    document.addEventListener("keydown", onKeydown);

    const cleanups: Array<() => void> = [];
    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
      const cursor = page.querySelector<HTMLElement>(".motion-cursor");
      if (cursor) {
        const moveX = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3.out" });
        const moveY = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          moveX(event.clientX);
          moveY(event.clientY);
        };
        window.addEventListener("pointermove", move);
        cleanups.push(() => window.removeEventListener("pointermove", move));

        page.querySelectorAll<HTMLElement>("button, a").forEach((target) => {
          const enter = () => cursor.classList.add("is-active");
          const leave = () => cursor.classList.remove("is-active");
          target.addEventListener("pointerenter", enter);
          target.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            target.removeEventListener("pointerenter", enter);
            target.removeEventListener("pointerleave", leave);
          });
        });
      }
    }

    return () => {
      disposed = true;
      if (favoriteEnterTimerRef.current) window.clearTimeout(favoriteEnterTimerRef.current);
      introTimeline?.kill();
      introExitTimeline?.kill();
      quoteTimeline?.kill();
      quoteProgress?.kill();
      panelTimeline?.kill();
      quoteStage?.removeEventListener("pointerenter", pauseOnHover);
      quoteStage?.removeEventListener("pointerleave", resumeAfterHover);
      document.removeEventListener("keydown", onKeydown);
      cleanups.forEach((cleanup) => cleanup());
      document.body.classList.remove("intro-lock", "experience-lock");
    };
  }, []);

  const filteredScreenFavorites = screenFavorites.filter((item) => item.kind === screenKind);

  return (
    <main ref={pageRef} className="site-shell">
      <div className="intro-splash" data-intro>
        <div className="intro-halo" aria-hidden="true">
          <i className="intro-halo-ring" /><i className="intro-halo-ring" /><i className="intro-halo-ring" />
          <span className="intro-signal-dot" />
        </div>
        <div className="intro-tree" aria-hidden="true">
          <span className="intro-trunk" />
          <span className="intro-branch intro-branch--1" /><span className="intro-branch intro-branch--2" />
          <span className="intro-branch intro-branch--3" /><span className="intro-branch intro-branch--4" />
          <span className="intro-branch intro-branch--5" /><span className="intro-branch intro-branch--6" />
          <div className="intro-leaves">
            {Array.from({ length: 18 }, (_, index) => <i className="intro-leaf" key={index} />)}
          </div>
        </div>
        <div className="intro-wind" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => <i className="intro-wind-leaf" key={index} />)}
        </div>
        <div className="intro-content">
          <div className="intro-word-wrap" aria-label="Morten Liu">
            <div className="intro-word">
              {"MORTEN—LIU".split("").map((letter, index) => (
                <span className="intro-letter-mask" key={`${letter}-${index}`}><span className="intro-letter">{letter}</span></span>
              ))}
            </div>
          </div>
          <div className="intro-subline"><span className="intro-subline-inner">PERSONAL ARCHIVE · EST. MMXXVI</span></div>
        </div>
        <button className="intro-skip" type="button" onClick={() => skipIntroRef.current()}>SKIP INTRO <span aria-hidden="true">↘</span></button>
      </div>

      <div className="motion-cursor" aria-hidden="true"><span /></div>

      <div className="tree-frame" aria-hidden="true">
        <span className="frame-branch frame-branch--1" /><span className="frame-branch frame-branch--2" />
        <span className="frame-branch frame-branch--3" /><span className="frame-branch frame-branch--4" />
        {Array.from({ length: 12 }, (_, index) => <i className="frame-leaf" key={index} />)}
      </div>

      <div className="page-transition" data-page-transition aria-hidden="true">
        <div className="page-transition-canopy" />
        <div className="transition-tree" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`transition-branch transition-branch--${index + 1}`} key={`branch-${index}`}>
              <i className="branch-leaf branch-leaf--a" /><i className="branch-leaf branch-leaf--b" />
            </span>
          ))}
          {Array.from({ length: 14 }, (_, index) => <i className="transition-leaf" key={index} />)}
        </div>
        <div className="transition-label-mask"><span data-transition-label>STORY</span></div>
      </div>

      <div className="home-screen" data-home-screen>
        <header className="topbar" data-home-return>
          <a className="monogram" href="#home" aria-label="回到主页">
            <span className="monogram-mark"><img src="/avatar.jpg" alt="" /></span>
            <span className="monogram-name">Morten Liu</span>
          </a>
          <p>PERSONAL ARCHIVE · VOL. 03</p>
          <span className="topbar-status"><i /> ONLINE / 2026</span>
        </header>

        <section
          className="quote-hero"
          id="home"
          aria-label="Morten 喜欢的句子"
          data-quote-theme={featuredQuotes[0].theme}
          data-quote-length={featuredQuotes[0].text.length > 30 ? "long" : "standard"}
        >
          <div className="quote-backdrop" aria-hidden="true">
            <img className="quote-backdrop-image" data-quote-backdrop-image data-media-slot="0" src={featuredQuotes[0].backdropImage} alt="" />
            <img className="quote-backdrop-image" data-quote-backdrop-image data-media-slot="1" src={featuredQuotes[1].backdropImage} alt="" />
          </div>
          <div className="quote-heading clip-line"><p data-home-reveal><i /> WORDS I KEEP CLOSE</p><span data-home-reveal>SELECTED / 001—004</span></div>

          <div className="quote-main">
            <div className="quote-left">
              <div className="quote-stage" data-quote-stage>
                <blockquote lang={featuredQuotes[0].lang}>
                  <div className="quote-text-mask clip-line"><p className="quote-text" data-home-reveal data-quote-text>{featuredQuotes[0].text}</p></div>
                  <footer className="quote-attribution-mask clip-line">
                    <span className="quote-attribution-inner" data-home-reveal>
                      — <span data-quote-source>{[featuredQuotes[0].source, featuredQuotes[0].author].filter(Boolean).join(" · ")}</span>
                      <small data-quote-citation>{featuredQuotes[0].citation}</small>
                    </span>
                  </footer>
                </blockquote>
              </div>

              <div className="quote-tools clip-line">
                <div data-home-reveal data-home-return>
                  <button type="button" aria-label="上一句话" onClick={() => changeQuoteRef.current(-1)}>←</button>
                  <button type="button" aria-label="下一句话" onClick={() => changeQuoteRef.current(1)}>→</button>
                  <span data-quote-counter>01 / 03</span>
                </div>
              </div>
            </div>

            <figure className="quote-cover clip-line">
              <div className="quote-cover-art" data-home-reveal data-home-return>
                <img className="quote-cover-image" data-cover-image data-media-slot="0" src={featuredQuotes[0].image} alt={featuredQuotes[0].imageAlt} />
                <img className="quote-cover-image" data-cover-image data-media-slot="1" src={featuredQuotes[1].image} alt={featuredQuotes[1].imageAlt} />
                <div className="quote-cover-copy">
                  <span className="quote-cover-medium" data-cover-medium>{featuredQuotes[0].medium}</span>
                  <span className="quote-cover-index" data-cover-index>M—L / 001</span>
                  <strong data-cover-title>{featuredQuotes[0].coverTitle}</strong>
                  <span className="quote-cover-meta" data-cover-meta>{featuredQuotes[0].coverMeta}</span>
                </div>
              </div>
              <figcaption className="quote-cover-caption" data-home-reveal>source object · cover archive</figcaption>
            </figure>
          </div>

          <nav className="portal-nav" aria-label="浏览个人档案">
            {portals.map((portal) => (
              <button
                className={`portal portal--${portal.id}`}
                data-home-reveal
                data-home-return
                data-portal={portal.id}
                key={portal.id}
                type="button"
                onClick={() => openPanelRef.current(portal.id)}
              >
                <span>{portal.index}</span>
                <span><strong>{portal.title}</strong><small>{portal.subtitle}</small></span>
                <i className="portal-leaf" aria-hidden="true"><b /></i>
              </button>
            ))}
          </nav>
        </section>
      </div>

      <section className="experience-panel panel-story" data-panel="story" aria-hidden="true">
        <PanelHeader index="01" title="STORY" onClose={() => closePanelRef.current()} />
        <div className="panel-body story-body">
          <aside data-panel-reveal><span>01 / 04</span><p>LIFE NOTES<br />IN CHRONOLOGICAL ORDER</p></aside>
          <div className="story-content">
            <p className="panel-kicker" data-panel-reveal>PERSONAL HISTORY / UNWRITTEN</p>
            <h2 data-panel-reveal>Story</h2>
            <div className="story-placeholder" data-panel-reveal>
              <span>CHAPTER 00</span><i /><p>人生经历将在这里按时间展开。</p><small>CONTENT TO BE WRITTEN</small>
            </div>
          </div>
        </div>
      </section>

      <section className="experience-panel panel-favorites" data-panel="favorites" aria-hidden="true">
        <PanelHeader index="02" title="FAVORITES" onClose={() => closePanelRef.current()} />
        <div className="panel-body favorites-body">
          <div className="favorites-content" data-favorite-view={favoriteView ?? "index"}>
            <div
              className="favorite-index-view"
              data-visible={!favoriteView}
              aria-hidden={Boolean(favoriteView)}
            >
              <div className="favorite-categories" data-has-active={Boolean(activeFavorite)} aria-label="喜欢的内容分类">
              {favoriteSections.map((section) => (
                <button
                  className={`favorite-column favorite-column--${section.id}`}
                  data-active={activeFavorite === section.id}
                  data-favorite-column={section.id}
                  data-panel-reveal
                  key={section.id}
                  type="button"
                  aria-pressed={activeFavorite === section.id}
                  onClick={() => enterFavoriteSection(section.id)}
                >
                  <span className="favorite-column-index">{section.index} / 03</span>
                  <span className="favorite-column-tree" aria-hidden="true">
                    <i /><i /><i /><b /><b /><b /><b />
                  </span>
                  <span className="favorite-column-title">
                    <small>{section.chineseTitle}</small>
                    <strong>{section.title}</strong>
                  </span>
                  <span className="favorite-column-detail">
                    <small>{section.categories}</small>
                    <span>{section.note}</span>
                  </span>
                  <span className="favorite-column-action">展开预览 <i>↗</i></span>
                </button>
              ))}
              </div>
            </div>

            <div className="favorite-detail-view" data-visible={Boolean(favoriteView)} aria-hidden={!favoriteView}>
              {favoriteView === "music" && (
                <MusicArchive activeIndex={musicSelection} onBack={leaveFavoriteSection} onSelect={setMusicSelection} />
              )}
              {favoriteView === "screen" && (
                <ScreenArchive
                  activeIndex={screenSelection}
                  items={filteredScreenFavorites}
                  kind={screenKind}
                  onBack={leaveFavoriteSection}
                  onKindChange={(kind) => { setScreenKind(kind); setScreenSelection(0); }}
                  onSelect={setScreenSelection}
                />
              )}
              {favoriteView === "books" && (
                <BookArchive activeIndex={bookSelection} onBack={leaveFavoriteSection} onSelect={setBookSelection} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="experience-panel panel-pictures" data-panel="pictures" aria-hidden="true">
        <PanelHeader index="03" title="PICTURES" onClose={() => closePanelRef.current()} />
        <div className="panel-body pictures-body">
          <aside data-panel-reveal><span>03 / 04</span><p>FRAMES SAVED<br />WITHOUT EXPLANATION</p></aside>
          <div className="pictures-content">
            <p className="panel-kicker" data-panel-reveal>VISUAL ARCHIVE / EMPTY</p>
            <h2 data-panel-reveal>Pictures</h2>
            <div className="picture-grid" aria-label="未来的图片位置">
              {["001", "002", "003", "004", "005", "006"].map((index) => (
                <div data-panel-reveal key={index}><span>{index}</span><i /></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="experience-panel panel-thinking" data-panel="thinking" aria-hidden="true">
        <PanelHeader index="04" title="THINKING" onClose={() => closePanelRef.current()} />
        <div className="panel-body thinking-body">
          <aside data-panel-reveal><span>04 / 04</span><p>NOTES THAT MAY<br />CHANGE LATER</p></aside>
          <div className="thinking-content">
            <p className="panel-kicker" data-panel-reveal>NOTES IN PROGRESS / 2026</p>
            <h2 data-panel-reveal>Thinking</h2>
            <div className="thought-grid">
              <article data-panel-reveal><span>001</span><h3>关于观察</h3><p>先记录发生过什么，再决定如何理解它。</p></article>
              <article data-panel-reveal><span>002</span><h3>下一篇</h3><p>尚未写下。</p></article>
              <article data-panel-reveal><span>003</span><h3>下一篇</h3><p>尚未写下。</p></article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MusicArchive({
  activeIndex,
  onBack,
  onSelect,
}: {
  activeIndex: number;
  onBack: () => void;
  onSelect: (index: number) => void;
}) {
  const activeItem = musicFavorites[activeIndex] ?? musicFavorites[0];

  return (
    <section className="favorite-archive music-archive" aria-label="音乐收藏">
      <img className="music-ambient" key={activeItem.image} src={activeItem.image} alt="" aria-hidden="true" />
      <ArchiveHeader index="01" label="MUSIC / LISTENING ROOM" onBack={onBack} />
      <div className="music-room">
        <div className="music-art-stage">
          <span className="music-vinyl" aria-hidden="true"><i /></span>
          <img key={activeItem.image} src={activeItem.image} alt={`${activeItem.title}封面`} />
          <small>ASEN / PERSONAL ROTATION</small>
        </div>

        <div className="music-information">
          <p>NOW SELECTED / {String(activeIndex + 1).padStart(2, "0")}</p>
          <h3>{activeItem.title}</h3>
          <span>{activeItem.artist}</span>
          <AnnotationPlaceholder prompt="在这里写下它为什么会被你反复播放，或某一句留下来的歌词。" />
        </div>

        <ol className="music-track-list" aria-label="Asen 歌曲列表">
          {musicFavorites.map((item, index) => (
            <li key={item.title}>
              <button type="button" data-selected={index === activeIndex} onClick={() => onSelect(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <small>{index === activeIndex ? "SELECTED" : "PLAY NOTE"}</small>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ScreenArchive({
  activeIndex,
  items,
  kind,
  onBack,
  onKindChange,
  onSelect,
}: {
  activeIndex: number;
  items: Array<{ title: string; kind: ScreenKind; image: string }>;
  kind: ScreenKind;
  onBack: () => void;
  onKindChange: (kind: ScreenKind) => void;
  onSelect: (index: number) => void;
}) {
  const activeItem = items[activeIndex] ?? items[0];
  const globalIndex = screenFavorites.findIndex((item) => item.title === activeItem.title);

  return (
    <section className="favorite-archive screen-archive" aria-label="影视收藏">
      <img className="screen-backdrop" key={activeItem.image} src={activeItem.image} alt="" aria-hidden="true" />
      <span className="screen-shade" aria-hidden="true" />
      <ArchiveHeader index="02" label="SCREEN / PRIVATE CINEMA" onBack={onBack} />

      <div className="screen-stage">
        <nav className="screen-kinds" aria-label="影视类型">
          {(["电影", "电视剧", "动漫"] as ScreenKind[]).map((option) => (
            <button key={option} type="button" data-selected={option === kind} onClick={() => onKindChange(option)}>{option}</button>
          ))}
        </nav>

        <div className="screen-title-block">
          <span>{String(globalIndex + 1).padStart(2, "0")} / {String(screenFavorites.length).padStart(2, "0")} · {activeItem.kind}</span>
          <h3>{activeItem.title}</h3>
          <AnnotationPlaceholder prompt="这里留给你的短评、喜欢的角色，或看完之后仍然没有散去的感受。" />
        </div>

        <div className="screen-poster-rail" aria-label={`${kind}海报列表`}>
          {items.map((item, index) => (
            <button type="button" data-selected={index === activeIndex} key={item.title} onClick={() => onSelect(index)}>
              <img src={item.image} alt={`${item.title}海报`} />
              <span><small>{String(index + 1).padStart(2, "0")}</small><strong>{item.title}</strong></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookArchive({
  activeIndex,
  onBack,
  onSelect,
}: {
  activeIndex: number;
  onBack: () => void;
  onSelect: (index: number) => void;
}) {
  const activeItem = bookFavorites[activeIndex] ?? bookFavorites[0];

  return (
    <section className="favorite-archive book-archive" aria-label="书籍收藏">
      <ArchiveHeader index="03" label="BOOKS / READING FILE" onBack={onBack} />
      <div className="book-desk">
        <nav className="book-index" aria-label="书籍目录">
          <p>READING INDEX / 003</p>
          {bookFavorites.map((item, index) => (
            <button type="button" data-selected={index === activeIndex} key={item.title} onClick={() => onSelect(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <small>{item.type}</small>
            </button>
          ))}
        </nav>

        <div className="book-cover-stage">
          <span aria-hidden="true" />
          <img key={activeItem.image} src={activeItem.image} alt={`${activeItem.title}封面`} />
          <small>PRIVATE COPY / {String(activeIndex + 1).padStart(3, "0")}</small>
        </div>

        <article className="book-reading-note">
          <p>{activeItem.type} / SELECTED BOOK</p>
          <h3>{activeItem.title}</h3>
          <span>{activeItem.author}</span>
          <AnnotationPlaceholder prompt="在这里整理你的批注：喜欢的段落、读完后的判断，以及未来重读时想重新确认的问题。" />
        </article>
      </div>
    </section>
  );
}

function ArchiveHeader({ index, label, onBack }: { index: string; label: string; onBack: () => void }) {
  return (
    <header className="favorite-archive-header">
      <button type="button" data-favorite-back onClick={onBack}><span>←</span> FAVORITES</button>
      <p>{index} / 03 · {label}</p>
      <span>PERSONAL SELECTION</span>
    </header>
  );
}

function AnnotationPlaceholder({ prompt }: { prompt: string }) {
  return (
    <div className="annotation-placeholder">
      <span>MY NOTE / 待填写</span>
      <p>{prompt}</p>
      <i aria-hidden="true" />
    </div>
  );
}

function PanelHeader({ index, title, onClose }: { index: string; title: string; onClose: () => void }) {
  return (
    <header className="panel-header">
      <a href="#home" aria-label="Morten Liu 主页" onClick={(event) => { event.preventDefault(); onClose(); }}>
        <span className="panel-monogram">M</span><span>MORTEN—LIU</span>
      </a>
      <p>{index} / 04 · {title}</p>
      <button type="button" data-panel-close onClick={onClose}>关闭 <span aria-hidden="true">×</span></button>
    </header>
  );
}
