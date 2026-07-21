"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type PanelId = "story" | "favorites" | "pictures" | "thinking";

const featuredQuotes = [
  {
    text: "如果你也来自小镇，成功从来不靠等待",
    source: "《你给的恨》",
    author: "Asen艾志恒",
    lang: "zh-CN",
    medium: "MUSIC / SINGLE",
    coverTitle: "你给的恨",
    coverMeta: "ASEN · 2025",
    theme: "clay",
  },
  {
    text: "从来如此，便对么？",
    source: "《狂人日记》",
    author: "鲁迅",
    lang: "zh-CN",
    medium: "BOOK / LITERATURE",
    coverTitle: "狂人日记",
    coverMeta: "鲁迅 · 1918",
    theme: "moss",
  },
  {
    text: "Who looks outside, dreams; who looks inside, awake.",
    source: "",
    author: "荣格",
    lang: "en",
    medium: "WORDS / PSYCHOLOGY",
    coverTitle: "LOOK WITHIN",
    coverMeta: "C. G. JUNG",
    theme: "ink",
  },
];

const portals: Array<{ id: PanelId; index: string; title: string; subtitle: string }> = [
  { id: "story", index: "01", title: "STORY", subtitle: "人生经历" },
  { id: "favorites", index: "02", title: "FAVORITES", subtitle: "音乐 · 电影 · 书" },
  { id: "pictures", index: "03", title: "PICTURES", subtitle: "影像与瞬间" },
  { id: "thinking", index: "04", title: "THINKING", subtitle: "一些想法" },
];

const panelTitles: Record<PanelId, string> = {
  story: "STORY",
  favorites: "FAVORITES",
  pictures: "PICTURES",
  thinking: "THINKING",
};

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const skipIntroRef = useRef<() => void>(() => undefined);
  const changeQuoteRef = useRef<(direction: number) => void>(() => undefined);
  const toggleAutoplayRef = useRef<() => void>(() => undefined);
  const openPanelRef = useRef<(panel: PanelId) => void>(() => undefined);
  const closePanelRef = useRef<() => void>(() => undefined);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = page.querySelector<HTMLElement>("[data-intro]");
    const introCount = page.querySelector<HTMLElement>("[data-intro-count]");
    const homeScreen = page.querySelector<HTMLElement>("[data-home-screen]");
    const transition = page.querySelector<HTMLElement>("[data-page-transition]");
    const transitionLabel = page.querySelector<HTMLElement>("[data-transition-label]");
    const quoteHero = page.querySelector<HTMLElement>(".quote-hero");
    const quoteText = page.querySelector<HTMLElement>("[data-quote-text]");
    const quoteSource = page.querySelector<HTMLElement>("[data-quote-source]");
    const quoteCounter = page.querySelector<HTMLElement>("[data-quote-counter]");
    const coverTitle = page.querySelector<HTMLElement>("[data-cover-title]");
    const coverMedium = page.querySelector<HTMLElement>("[data-cover-medium]");
    const coverMeta = page.querySelector<HTMLElement>("[data-cover-meta]");
    const pauseButton = page.querySelector<HTMLButtonElement>("[data-quote-pause]");
    const quoteStage = page.querySelector<HTMLElement>("[data-quote-stage]");

    let introTimeline: gsap.core.Timeline | null = null;
    let introExitTimeline: gsap.core.Timeline | null = null;
    let quoteTimeline: gsap.core.Timeline | null = null;
    let quoteProgress: gsap.core.Tween | null = null;
    let panelTimeline: gsap.core.Timeline | null = null;
    let quoteIndex = 0;
    let autoplayPaused = false;
    let activePanel: PanelId | null = null;
    let introIsExiting = false;
    let panelIsTransitioning = false;
    const counter = { value: 0 };

    document.body.classList.add("experience-lock");

    const writeQuote = (index: number) => {
      const quote = featuredQuotes[index];
      if (quoteText) {
        quoteText.textContent = quote.text;
        quoteText.closest("blockquote")?.setAttribute("lang", quote.lang);
      }
      if (quoteSource) quoteSource.textContent = quote.source ? `${quote.source} · ${quote.author}` : quote.author;
      if (quoteCounter) quoteCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(featuredQuotes.length).padStart(2, "0")}`;
      if (coverTitle) coverTitle.textContent = quote.coverTitle;
      if (coverMedium) coverMedium.textContent = quote.medium;
      if (coverMeta) coverMeta.textContent = quote.coverMeta;
      quoteHero?.setAttribute("data-quote-theme", quote.theme);
    };

    const scheduleQuote = () => {
      quoteProgress?.kill();
      gsap.set(".quote-progress-fill", { scaleX: 0 });
      if (autoplayPaused || activePanel || reducedMotion) return;
      quoteProgress = gsap.to(".quote-progress-fill", {
        scaleX: 1,
        duration: 6,
        ease: "none",
        onComplete: () => changeQuoteRef.current(1),
      });
    };

    changeQuoteRef.current = (direction: number) => {
      if (quoteTimeline?.isActive() || activePanel || panelIsTransitioning) return;
      const nextIndex = (quoteIndex + direction + featuredQuotes.length) % featuredQuotes.length;
      quoteProgress?.kill();

      if (reducedMotion) {
        quoteIndex = nextIndex;
        writeQuote(quoteIndex);
        return;
      }

      quoteTimeline = gsap
        .timeline({ defaults: { ease: "power3.inOut" }, onComplete: scheduleQuote })
        .to(".quote-text, .quote-attribution-inner", { y: direction > 0 ? -48 : 48, autoAlpha: 0, duration: 0.4, stagger: 0.035 })
        .to(".quote-cover-art, .quote-cover-caption", { y: direction > 0 ? -26 : 26, rotateZ: direction > 0 ? -2 : 2, autoAlpha: 0, duration: 0.36 }, 0.04)
        .add(() => {
          quoteIndex = nextIndex;
          writeQuote(quoteIndex);
        })
        .set(".quote-text, .quote-attribution-inner", { y: direction > 0 ? 54 : -54 })
        .set(".quote-cover-art, .quote-cover-caption", { y: direction > 0 ? 30 : -30, rotateZ: direction > 0 ? 2 : -2 })
        .to(".quote-text, .quote-attribution-inner", { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.045, ease: "power4.out" })
        .to(".quote-cover-art, .quote-cover-caption", { y: 0, rotateZ: 0, autoAlpha: 1, duration: 0.68, ease: "power4.out" }, "<0.04");
    };

    toggleAutoplayRef.current = () => {
      autoplayPaused = !autoplayPaused;
      if (pauseButton) {
        pauseButton.textContent = autoplayPaused ? "继续" : "暂停";
        pauseButton.setAttribute("aria-pressed", String(autoplayPaused));
        pauseButton.setAttribute("aria-label", autoplayPaused ? "继续自动轮换句子" : "暂停自动轮换句子");
      }
      if (autoplayPaused) quoteProgress?.pause();
      else if (quoteProgress) quoteProgress.resume();
      else scheduleQuote();
    };

    const revealPanelImmediately = (id: PanelId) => {
      const target = page.querySelector<HTMLElement>(`[data-panel="${id}"]`);
      if (!target || !homeScreen) return;
      gsap.set(homeScreen, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(target, { autoAlpha: 1, pointerEvents: "auto" });
      target.setAttribute("aria-hidden", "false");
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
      transition.style.setProperty("--transition-color", color);

      panelTimeline = gsap
        .timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            panelIsTransitioning = false;
            target.querySelector<HTMLButtonElement>("[data-panel-close]")?.focus();
          },
        })
        .set(transition, { autoAlpha: 1, pointerEvents: "auto" })
        .set(".page-transition-curtain", { transformOrigin: "bottom", scaleY: 0 })
        .fromTo(transitionLabel, { yPercent: 120, rotateX: -35 }, { yPercent: 0, rotateX: 0, duration: 0.72 }, 0.18)
        .to(".page-transition-curtain", { scaleY: 1, duration: 0.78 }, 0)
        .add(() => {
          gsap.set(homeScreen, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(target, { autoAlpha: 1, pointerEvents: "auto" });
          target.setAttribute("aria-hidden", "false");
          activePanel = id;
        }, 0.72)
        .set(".page-transition-curtain", { transformOrigin: "top" })
        .to(transitionLabel, { yPercent: -120, duration: 0.45 }, 0.76)
        .to(".page-transition-curtain", { scaleY: 0, duration: 0.78 }, 0.8)
        .fromTo(target.querySelectorAll("[data-panel-reveal]"), { y: 42, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.06, ease: "power3.out" }, 0.92)
        .set(transition, { autoAlpha: 0, pointerEvents: "none" });
    };

    closePanelRef.current = () => {
      if (!activePanel || panelIsTransitioning || !homeScreen || !transition || !transitionLabel) return;
      const closingId = activePanel;
      const target = page.querySelector<HTMLElement>(`[data-panel="${closingId}"]`);
      if (!target) return;

      if (reducedMotion) {
        gsap.set(target, { autoAlpha: 0, pointerEvents: "none" });
        target.setAttribute("aria-hidden", "true");
        gsap.set(homeScreen, { autoAlpha: 1, pointerEvents: "auto" });
        activePanel = null;
        scheduleQuote();
        page.querySelector<HTMLButtonElement>(`[data-portal="${closingId}"]`)?.focus();
        return;
      }

      panelIsTransitioning = true;
      transitionLabel.textContent = "MORTEN—LIU";
      const color = getComputedStyle(target).getPropertyValue("--portal-color").trim() || "#263229";
      transition.style.setProperty("--transition-color", color);

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
        .set(".page-transition-curtain", { transformOrigin: "top", scaleY: 0 })
        .to(".page-transition-curtain", { scaleY: 1, duration: 0.72 })
        .fromTo(transitionLabel, { yPercent: 120 }, { yPercent: 0, duration: 0.6 }, 0.16)
        .add(() => {
          gsap.set(target, { autoAlpha: 0, pointerEvents: "none" });
          target.setAttribute("aria-hidden", "true");
          gsap.set(homeScreen, { autoAlpha: 1, pointerEvents: "auto" });
          activePanel = null;
        }, 0.68)
        .set(".page-transition-curtain", { transformOrigin: "bottom" })
        .to(transitionLabel, { yPercent: -120, duration: 0.4 }, 0.72)
        .to(".page-transition-curtain", { scaleY: 0, duration: 0.72 }, 0.76)
        .fromTo("[data-home-return]", { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.045, ease: "power3.out" }, 0.84)
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
          .timeline({ defaults: { ease: "power4.inOut" }, onComplete: releaseIntro })
          .to(".intro-word-wrap", { scale: 1.08, filter: "blur(10px)", autoAlpha: 0, duration: 0.46 }, 0)
          .to(".intro-tech, .intro-meta, .intro-skip", { autoAlpha: 0, duration: 0.25 }, 0)
          .fromTo(".intro-flash", { scaleX: 0 }, { scaleX: 1, duration: 0.38, ease: "power4.in" }, 0.16)
          .to(".intro-panel--top", { yPercent: -101, duration: 0.92 }, 0.42)
          .to(".intro-panel--bottom", { yPercent: 101, duration: 0.92 }, 0.42)
          .to(".intro-flash", { scaleX: 0, transformOrigin: "right", duration: 0.6 }, 0.45)
          .fromTo("[data-home-reveal]", { yPercent: 112, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.92, stagger: 0.055 }, 0.58);
      };

      introTimeline = gsap
        .timeline({ defaults: { ease: "power4.out" }, onComplete: exitIntro })
        .set(intro, { autoAlpha: 1, animation: "none" })
        .fromTo(".intro-grid-line", { scaleX: 0 }, { scaleX: 1, duration: 0.95, stagger: 0.04 }, 0)
        .fromTo(".intro-halo-ring", { scale: 0.18, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1, stagger: 0.08 }, 0.08)
        .fromTo(".intro-signal-dot", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.52 }, 0.18)
        .fromTo(".intro-tech", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.18)
        .fromTo(".intro-letter", { yPercent: 145, rotateZ: 8 }, { yPercent: 0, rotateZ: 0, duration: 0.88, stagger: 0.045 }, 0.3)
        .fromTo(".intro-word-ghost--a", { xPercent: -18, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 0.28, duration: 0.72 }, 0.42)
        .fromTo(".intro-word-ghost--b", { xPercent: 18, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 0.18, duration: 0.72 }, 0.47)
        .fromTo(".intro-subline-inner", { yPercent: 120 }, { yPercent: 0, duration: 0.7 }, 0.76)
        .fromTo(".intro-meta, .intro-skip", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42 }, 0.78)
        .fromTo(".intro-rule-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.78, ease: "none" }, 0.2)
        .to(counter, {
          value: 100,
          duration: 1.78,
          ease: "power2.inOut",
          onUpdate: () => {
            if (introCount) introCount.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        }, 0.2)
        .to(".intro-word-ghost--a", { xPercent: 3, duration: 0.08, repeat: 3, yoyo: true, ease: "none" }, 1.5)
        .to(".intro-word-ghost--b", { xPercent: -2, duration: 0.06, repeat: 3, yoyo: true, ease: "none" }, 1.54)
        .to(".intro-halo", { rotate: 12, scale: 1.04, duration: 0.7, ease: "power2.inOut" }, 1.28);

      skipIntroRef.current = exitIntro;
    }

    const pauseOnHover = () => quoteProgress?.pause();
    const resumeAfterHover = () => {
      if (!autoplayPaused && !activePanel) quoteProgress?.resume();
    };
    quoteStage?.addEventListener("pointerenter", pauseOnHover);
    quoteStage?.addEventListener("pointerleave", resumeAfterHover);

    const onKeydown = (event: KeyboardEvent) => {
      const introVisible = intro && gsap.getProperty(intro, "visibility") !== "hidden";
      if (event.key === "Escape") {
        if (introVisible) skipIntroRef.current();
        else if (activePanel) closePanelRef.current();
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

  return (
    <main ref={pageRef} className="site-shell">
      <div className="intro-splash" data-intro>
        <div className="intro-panel intro-panel--top" />
        <div className="intro-panel intro-panel--bottom" />
        <div className="intro-grid" aria-hidden="true">
          <span className="intro-grid-line" /><span className="intro-grid-line" /><span className="intro-grid-line" />
          <span className="intro-grid-line" /><span className="intro-grid-line" /><span className="intro-grid-line" />
        </div>
        <div className="intro-halo" aria-hidden="true">
          <i className="intro-halo-ring" /><i className="intro-halo-ring" /><i className="intro-halo-ring" />
          <span className="intro-signal-dot" />
        </div>
        <div className="intro-tech intro-tech--left" aria-hidden="true"><span>IDENTITY SIGNAL / 0316</span><span>31.2304° N · 121.4737° E</span></div>
        <div className="intro-tech intro-tech--right" aria-hidden="true"><span>PERSONAL ARCHIVE</span><span>EST. MMXXVI</span></div>
        <div className="intro-content">
          <div className="intro-word-wrap" aria-label="Morten Liu">
            <div className="intro-word">
              {"MORTEN—LIU".split("").map((letter, index) => (
                <span className="intro-letter-mask" key={`${letter}-${index}`}><span className="intro-letter">{letter}</span></span>
              ))}
            </div>
            <span className="intro-word-ghost intro-word-ghost--a" aria-hidden="true">MORTEN—LIU</span>
            <span className="intro-word-ghost intro-word-ghost--b" aria-hidden="true">MORTEN—LIU</span>
          </div>
          <div className="intro-subline"><span className="intro-subline-inner">A QUIET WORLD · TRANSMITTED LOUDLY</span></div>
        </div>
        <div className="intro-meta"><span data-intro-count>000</span><div className="intro-rule"><span className="intro-rule-fill" /></div><span>CALIBRATING PRIVATE FREQUENCY</span></div>
        <button className="intro-skip" type="button" onClick={() => skipIntroRef.current()}>SKIP INTRO <span aria-hidden="true">↘</span></button>
        <div className="intro-flash" aria-hidden="true" />
      </div>

      <div className="motion-cursor" aria-hidden="true"><span /></div>

      <div className="page-transition" data-page-transition aria-hidden="true">
        <div className="page-transition-curtain" />
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

        <section className="quote-hero" id="home" aria-label="Morten 喜欢的句子" data-quote-theme={featuredQuotes[0].theme}>
          <div className="quote-backdrop" aria-hidden="true"><span /></div>
          <div className="quote-heading clip-line"><p data-home-reveal><i /> WORDS I KEEP CLOSE</p><span data-home-reveal>SELECTED / 001—003</span></div>

          <div className="quote-main">
            <div className="quote-left">
              <div className="quote-stage" data-quote-stage>
                <blockquote lang={featuredQuotes[0].lang}>
                  <div className="quote-text-mask clip-line"><p className="quote-text" data-home-reveal data-quote-text>{featuredQuotes[0].text}</p></div>
                  <footer className="quote-attribution-mask clip-line"><span className="quote-attribution-inner" data-home-reveal>— <span data-quote-source>{featuredQuotes[0].source} · {featuredQuotes[0].author}</span></span></footer>
                </blockquote>
              </div>

              <div className="quote-tools clip-line">
                <div data-home-reveal data-home-return>
                  <button type="button" aria-label="上一句话" onClick={() => changeQuoteRef.current(-1)}>←</button>
                  <button type="button" aria-label="下一句话" onClick={() => changeQuoteRef.current(1)}>→</button>
                  <button type="button" data-quote-pause aria-label="暂停自动轮换句子" aria-pressed="false" onClick={() => toggleAutoplayRef.current()}>暂停</button>
                  <span data-quote-counter>01 / 03</span>
                  <i className="quote-progress"><b className="quote-progress-fill" /></i>
                </div>
              </div>
            </div>

            <figure className="quote-cover clip-line">
              <div className="quote-cover-art" data-home-reveal data-home-return>
                <span className="quote-cover-medium" data-cover-medium>{featuredQuotes[0].medium}</span>
                <span className="quote-cover-index">M—L / 001</span>
                <strong data-cover-title>{featuredQuotes[0].coverTitle}</strong>
                <span className="quote-cover-meta" data-cover-meta>{featuredQuotes[0].coverMeta}</span>
                <i aria-hidden="true" />
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
                <i aria-hidden="true">↗</i>
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
          <aside data-panel-reveal><span>02 / 04</span><p>THINGS I RETURN TO<br />AGAIN AND AGAIN</p></aside>
          <div className="favorites-content">
            <p className="panel-kicker" data-panel-reveal>PERSONAL SELECTION / INDEX</p>
            <h2 data-panel-reveal>Favorites</h2>
            <div className="favorite-categories">
              {[
                ["01", "MUSIC", "歌曲与专辑"],
                ["02", "FILMS", "电影与镜头"],
                ["03", "BOOKS", "书籍与作者"],
              ].map(([index, title, subtitle]) => (
                <article data-panel-reveal key={title}>
                  <span>{index}</span><strong>{title}</strong><small>{subtitle}</small><i>↗</i>
                </article>
              ))}
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
