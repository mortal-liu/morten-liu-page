"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const introQuotes = [
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

const collections = [
  {
    index: "01",
    id: "music",
    title: "音乐",
    en: "Sounds I return to",
    description: "一些适合夜路、雨天和无人打扰的清晨的声音。",
  },
  {
    index: "02",
    id: "films",
    title: "电影",
    en: "Frames worth keeping",
    description: "偏爱含蓄的镜头、漫长的停顿，以及被光记住的瞬间。",
  },
  {
    index: "03",
    id: "words",
    title: "喜欢的文字",
    en: "Words with an afterglow",
    description: "收藏那些把复杂情绪说得很轻、却能停留很久的句子。",
  },
  {
    index: "04",
    id: "thoughts",
    title: "一些想法",
    en: "Notes in progress",
    description: "关于独处、城市、关系与成长——允许反复修改的私人札记。",
  },
];

const soundscapes = [
  { number: "A", title: "凌晨两点", style: "Ambient · Piano", note: "适合走得很慢的夜路" },
  { number: "B", title: "雨落以前", style: "Jazz · Voice", note: "窗边、咖啡与没写完的信" },
  { number: "C", title: "没有歌词", style: "Post-rock · Instrumental", note: "让声音替情绪把话说完" },
];

const filmNotes = [
  { number: "01", title: "漫长的停顿", note: "镜头不急着解释，人物也不急着回答。" },
  { number: "02", title: "被光记住的城市", note: "街道、车窗、黄昏和一场迟迟不停的雨。" },
  { number: "03", title: "关系里的留白", note: "比告别更难的，是始终没有说出的那部分。" },
];

const quotes = [
  "生活需要一点没有用处的时间。",
  "有些路并不通往答案，它只是把人慢慢带回自己。",
  "真正喜欢的东西，会在很久以后仍然替你发光。",
];

const notes = [
  {
    number: "001",
    title: "关于观察",
    body: "先记录发生过什么，再决定如何理解它。",
  },
  {
    number: "002",
    title: "关于喜欢",
    body: "喜欢一件事，不必急着让它变得有用。那些看似无用的投入，最后常常组成了一个人。",
  },
  {
    number: "003",
    title: "关于成长",
    body: "成长可能不是变得更确定，而是学会带着不确定继续生活，并保留一点柔软。",
  },
];

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const skipIntroRef = useRef<() => void>(() => undefined);
  const changeHeroQuoteRef = useRef<(direction: number) => void>(() => undefined);
  const toggleHeroAutoplayRef = useRef<() => void>(() => undefined);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const page = pageRef.current;
    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = page.querySelector<HTMLElement>("[data-intro]");
    const introCount = page.querySelector<HTMLElement>("[data-intro-count]");
    const quoteText = page.querySelector<HTMLElement>("[data-hero-quote-text]");
    const quoteSource = page.querySelector<HTMLElement>("[data-hero-quote-source]");
    const quoteCounter = page.querySelector<HTMLElement>("[data-hero-quote-counter]");
    const pauseButton = page.querySelector<HTMLButtonElement>("[data-hero-pause]");
    const quoteStage = page.querySelector<HTMLElement>("[data-hero-quote-stage]");
    const quoteHero = page.querySelector<HTMLElement>(".quote-hero");
    const coverTitle = page.querySelector<HTMLElement>("[data-cover-title]");
    const coverMedium = page.querySelector<HTMLElement>("[data-cover-medium]");
    const coverMeta = page.querySelector<HTMLElement>("[data-cover-meta]");
    let entranceTimeline: gsap.core.Timeline | null = null;
    let exitTimeline: gsap.core.Timeline | null = null;
    let quoteTimeline: gsap.core.Timeline | null = null;
    let progressTween: gsap.core.Tween | null = null;
    let quoteIndex = 0;
    let autoplayPaused = false;
    let isExiting = false;
    const counter = { value: 0 };

    const releasePage = () => {
      document.body.classList.remove("intro-lock");
      if (intro) gsap.set(intro, { autoAlpha: 0, pointerEvents: "none" });
      if (!reducedMotion) scheduleAutoplay();
      ScrollTrigger.refresh();
    };

    const writeQuote = (index: number) => {
      const quote = introQuotes[index];
      if (quoteText) {
        quoteText.textContent = quote.text;
        quoteText.closest("blockquote")?.setAttribute("lang", quote.lang);
      }
      if (quoteSource) {
        quoteSource.textContent = quote.source ? `${quote.source} · ${quote.author}` : quote.author;
      }
      if (coverTitle) coverTitle.textContent = quote.coverTitle;
      if (coverMedium) coverMedium.textContent = quote.medium;
      if (coverMeta) coverMeta.textContent = quote.coverMeta;
      quoteHero?.setAttribute("data-quote-theme", quote.theme);
      if (quoteCounter) quoteCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(introQuotes.length).padStart(2, "0")}`;
    };

    const scheduleAutoplay = () => {
      progressTween?.kill();
      gsap.set(".quote-hero-progress-fill", { scaleX: 0 });
      if (autoplayPaused) return;
      progressTween = gsap.to(".quote-hero-progress-fill", {
        scaleX: 1,
        duration: 5.8,
        ease: "none",
        onComplete: () => changeHeroQuoteRef.current(1),
      });
    };

    const setAutoplayButton = () => {
      if (!pauseButton) return;
      pauseButton.textContent = autoplayPaused ? "继续" : "暂停";
      pauseButton.setAttribute("aria-label", autoplayPaused ? "继续自动轮换句子" : "暂停自动轮换句子");
      pauseButton.setAttribute("aria-pressed", String(autoplayPaused));
    };

    changeHeroQuoteRef.current = (direction: number) => {
      if (quoteTimeline?.isActive()) return;
      progressTween?.kill();
      const nextIndex = (quoteIndex + direction + introQuotes.length) % introQuotes.length;

      if (reducedMotion) {
        quoteIndex = nextIndex;
        writeQuote(quoteIndex);
        return;
      }

      const leaveY = direction >= 0 ? -58 : 58;
      const enterY = direction >= 0 ? 72 : -72;
      quoteTimeline = gsap
        .timeline({ defaults: { ease: "power3.inOut" }, onComplete: scheduleAutoplay })
        .to(".quote-hero-text, .quote-hero-attribution-inner", {
          y: leaveY,
          autoAlpha: 0,
          duration: 0.46,
          stagger: 0.04,
        })
        .to(".quote-cover-art, .quote-cover-caption", {
          y: direction >= 0 ? -34 : 34,
          rotateZ: direction >= 0 ? -2.5 : 2.5,
          autoAlpha: 0,
          duration: 0.4,
        }, 0.04)
        .add(() => {
          quoteIndex = nextIndex;
          writeQuote(quoteIndex);
        })
        .set(".quote-hero-text, .quote-hero-attribution-inner", { y: enterY })
        .set(".quote-cover-art, .quote-cover-caption", { y: direction >= 0 ? 36 : -36, rotateZ: direction >= 0 ? 2.5 : -2.5 })
        .to(".quote-hero-text, .quote-hero-attribution-inner", {
          y: 0,
          autoAlpha: 1,
          duration: 0.82,
          stagger: 0.055,
          ease: "power4.out",
        })
        .to(".quote-cover-art, .quote-cover-caption", { y: 0, rotateZ: 0, autoAlpha: 1, duration: 0.72, ease: "power4.out" }, "<0.06");
    };

    toggleHeroAutoplayRef.current = () => {
      autoplayPaused = !autoplayPaused;
      setAutoplayButton();
      if (autoplayPaused) {
        progressTween?.pause();
      } else if (progressTween) {
        progressTween.resume();
      } else {
        scheduleAutoplay();
      }
    };

    writeQuote(quoteIndex);

    if (reducedMotion) {
      releasePage();
      gsap.set("[data-hero-reveal]", { yPercent: 0 });
    } else {
      document.body.classList.add("intro-lock");

      const exitIntro = () => {
        if (isExiting) return;
        isExiting = true;
        entranceTimeline?.kill();
        exitTimeline = gsap
          .timeline({ defaults: { ease: "power4.inOut" }, onComplete: releasePage })
          .to(".intro-word-wrap", { scale: 1.08, filter: "blur(10px)", autoAlpha: 0, duration: 0.46 }, 0)
          .to(".intro-tech, .intro-meta, .intro-skip", { autoAlpha: 0, duration: 0.25 }, 0)
          .fromTo(".intro-flash", { scaleX: 0 }, { scaleX: 1, duration: 0.38, ease: "power4.in" }, 0.16)
          .to(".intro-panel--top", { yPercent: -101, duration: 0.92 }, 0.42)
          .to(".intro-panel--bottom", { yPercent: 101, duration: 0.92 }, 0.42)
          .to(".intro-flash", { scaleX: 0, transformOrigin: "right", duration: 0.6 }, 0.45)
          .fromTo(".quote-hero [data-hero-reveal]", { yPercent: 118 }, { yPercent: 0, duration: 1.08, stagger: 0.075 }, 0.56)
          .fromTo(".topbar", { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.72);
      };

      entranceTimeline = gsap
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

    const onPageKeydown = (event: KeyboardEvent) => {
      const introVisible = intro && gsap.getProperty(intro, "visibility") !== "hidden";
      if (event.key === "Escape" && introVisible) skipIntroRef.current();
      if (event.key === "ArrowLeft" && !introVisible) changeHeroQuoteRef.current(-1);
      if (event.key === "ArrowRight" && !introVisible) changeHeroQuoteRef.current(1);
      if (event.key === " " && !introVisible) {
        event.preventDefault();
        toggleHeroAutoplayRef.current();
      }
    };
    document.addEventListener("keydown", onPageKeydown);

    const pauseOnHover = () => progressTween?.pause();
    const resumeAfterHover = () => {
      if (!autoplayPaused) progressTween?.resume();
    };
    quoteStage?.addEventListener("pointerenter", pauseOnHover);
    quoteStage?.addEventListener("pointerleave", resumeAfterHover);

    const motion = gsap.matchMedia(page);
    motion.add(
      {
        desktop: "(min-width: 861px)",
        mobile: "(max-width: 860px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduceMotion: shouldReduce } = context.conditions as {
          desktop: boolean;
          mobile: boolean;
          reduceMotion: boolean;
        };

        if (shouldReduce) {
          gsap.set("[data-reveal-item]", { autoAlpha: 1, y: 0 });
          return;
        }

        page.querySelectorAll<HTMLElement>("[data-reveal]").forEach((section) => {
          const items = section.querySelectorAll<HTMLElement>("[data-reveal-item]");
          if (!items.length) return;
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 58 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.05,
              stagger: 0.095,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 78%", once: true },
            },
          );
        });

        gsap.to(".scroll-progress-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: page, start: "top top", end: "bottom bottom", scrub: 0.18 },
        });

        gsap.to("[data-marquee-track]", {
          xPercent: desktop ? -22 : -10,
          ease: "none",
          scrollTrigger: { trigger: ".motion-marquee", start: "top bottom", end: "bottom top", scrub: 0.8 },
        });

        gsap.to(".words-chapter", {
          backgroundColor: "#263229",
          color: "#f3eee2",
          scrollTrigger: {
            trigger: ".words-chapter",
            start: "top 68%",
            end: "top 24%",
            scrub: 0.65,
          },
        });
      },
    );

    const cleanups: Array<() => void> = [];
    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
      const cursor = page.querySelector<HTMLElement>(".motion-cursor");
      if (cursor) {
        const cursorX = gsap.quickTo(cursor, "x", { duration: 0.32, ease: "power3.out" });
        const cursorY = gsap.quickTo(cursor, "y", { duration: 0.32, ease: "power3.out" });
        const moveCursor = (event: PointerEvent) => {
          cursorX(event.clientX);
          cursorY(event.clientY);
        };
        window.addEventListener("pointermove", moveCursor);
        cleanups.push(() => window.removeEventListener("pointermove", moveCursor));

        page.querySelectorAll<HTMLElement>("a, button, [data-tilt]").forEach((target) => {
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

      page.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((element) => {
        const moveX = gsap.quickTo(element, "x", { duration: 0.45, ease: "power3.out" });
        const moveY = gsap.quickTo(element, "y", { duration: 0.45, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const bounds = element.getBoundingClientRect();
          moveX((event.clientX - bounds.left - bounds.width / 2) * 0.16);
          moveY((event.clientY - bounds.top - bounds.height / 2) * 0.16);
        };
        const leave = () => {
          moveX(0);
          moveY(0);
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
        });
      });

      page.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.42, ease: "power3.out" });
        const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.42, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          rotateY(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
          rotateX(((event.clientY - bounds.top) / bounds.height - 0.5) * -7);
        };
        const leave = () => {
          rotateX(0);
          rotateY(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      entranceTimeline?.kill();
      exitTimeline?.kill();
      quoteTimeline?.kill();
      progressTween?.kill();
      motion.revert();
      cleanups.forEach((cleanup) => cleanup());
      document.removeEventListener("keydown", onPageKeydown);
      quoteStage?.removeEventListener("pointerenter", pauseOnHover);
      quoteStage?.removeEventListener("pointerleave", resumeAfterHover);
      document.body.classList.remove("intro-lock");
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
        <div className="intro-tech intro-tech--left" aria-hidden="true">
          <span>IDENTITY SIGNAL / 0316</span><span>31.2304° N · 121.4737° E</span>
        </div>
        <div className="intro-tech intro-tech--right" aria-hidden="true">
          <span>PERSONAL ARCHIVE</span><span>EST. MMXXVI</span>
        </div>
        <div className="intro-content intro-content--cinematic">
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
        <div className="intro-meta">
          <span data-intro-count>000</span>
          <div className="intro-rule"><span className="intro-rule-fill" /></div>
          <span>CALIBRATING PRIVATE FREQUENCY</span>
        </div>
        <button className="intro-skip" type="button" onClick={() => skipIntroRef.current()}>
          SKIP INTRO <span aria-hidden="true">↘</span>
        </button>
        <div className="intro-flash" aria-hidden="true" />
      </div>

      <div className="motion-cursor" aria-hidden="true"><span /></div>
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress-fill" /></div>

      <div className="page-frame">
        <header className="topbar" aria-label="主导航">
          <a className="monogram" data-magnetic href="#home" aria-label="回到主页顶部">
            <span className="monogram-mark"><img src="/avatar.jpg" alt="" /></span>
            <span className="monogram-name">Morten Liu</span>
          </a>
          <p className="edition">Personal Notes · Vol. 02</p>
          <nav>
            <a data-magnetic href="#home">句子</a>
            <a data-magnetic href="#collections">收藏</a>
            <a data-magnetic href="#thoughts">札记</a>
          </nav>
        </header>

        <section className="quote-hero" id="home" aria-label="Morten 喜欢的句子" data-quote-theme={introQuotes[0].theme}>
          <div className="quote-hero-grid" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <div className="quote-cover-backdrop" aria-hidden="true"><span /></div>

          <div className="quote-hero-heading hero-line">
            <p data-hero-reveal><span className="quote-hero-dot" />MORTEN—LIU · WORDS I KEEP CLOSE</p>
          </div>

          <div className="quote-hero-stage" data-hero-quote-stage>
            <blockquote lang={introQuotes[0].lang}>
              <div className="quote-hero-text-mask hero-line">
                <p className="quote-hero-text" data-hero-reveal data-hero-quote-text>{introQuotes[0].text}</p>
              </div>
              <footer className="quote-hero-attribution-mask hero-line">
                <span className="quote-hero-attribution-inner" data-hero-reveal>— <span data-hero-quote-source>{introQuotes[0].source} · {introQuotes[0].author}</span></span>
              </footer>
            </blockquote>
          </div>

          <figure className="quote-cover hero-line" aria-label="当前句子的来源封面位置">
            <div className="quote-cover-art" data-hero-reveal>
              <span className="quote-cover-medium" data-cover-medium>{introQuotes[0].medium}</span>
              <span className="quote-cover-index" aria-hidden="true">M—L / 001</span>
              <strong data-cover-title>{introQuotes[0].coverTitle}</strong>
              <span className="quote-cover-meta" data-cover-meta>{introQuotes[0].coverMeta}</span>
              <i aria-hidden="true" />
            </div>
            <figcaption className="quote-cover-caption" data-hero-reveal>source object · cover archive</figcaption>
          </figure>

          <div className="quote-hero-controls hero-line" aria-label="句子轮播控制">
            <div data-hero-reveal>
              <button type="button" aria-label="上一句话" onClick={() => changeHeroQuoteRef.current(-1)}>←</button>
              <button type="button" aria-label="下一句话" onClick={() => changeHeroQuoteRef.current(1)}>→</button>
              <button type="button" data-hero-pause aria-label="暂停自动轮换句子" aria-pressed="false" onClick={() => toggleHeroAutoplayRef.current()}>暂停</button>
            </div>
          </div>

          <div className="quote-hero-progress hero-line">
            <div data-hero-reveal>
              <span data-hero-quote-counter>01 / 03</span>
              <i><b className="quote-hero-progress-fill" /></i>
              <span>A SMALL INDEX OF BELIEF</span>
            </div>
          </div>

          <a className="quote-hero-scroll hero-line" data-magnetic href="#collections">
            <span data-hero-reveal>继续浏览 <i aria-hidden="true">↓</i></span>
          </a>
        </section>

        <section className="collection-index" id="collections" aria-labelledby="collections-title" data-reveal>
          <div className="section-heading index-heading">
            <p className="section-number" data-reveal-item>I</p>
            <div data-reveal-item>
              <p className="section-kicker">A personal cabinet</p>
              <h2 id="collections-title">四份私人收藏</h2>
            </div>
            <p className="heading-note" data-reveal-item>它们不是标签，只是认识一个人的几条小路。</p>
          </div>

          <div className="collection-grid">
            {collections.map((item) => (
              <a className="collection-card" data-magnetic data-reveal-item href={`#${item.id}`} key={item.id}>
                <span className="card-index">{item.index} / 04</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
                <h3>{item.title}</h3>
                <span className="card-en">{item.en}</span>
                <p>{item.description}</p>
                <span className="card-sweep" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="motion-marquee" aria-hidden="true">
        <div className="marquee-track" data-marquee-track>
          <span>MUSIC</span><i>✦</i><span>FILM</span><i>✦</i><span>WORDS</span><i>✦</i><span>NOTES</span><i>✦</i>
          <span>MUSIC</span><i>✦</i><span>FILM</span><i>✦</i><span>WORDS</span><i>✦</i><span>NOTES</span>
        </div>
      </div>

      <div className="page-frame">
        <section className="chapter music-chapter" id="music" aria-labelledby="music-title" data-reveal>
          <div className="chapter-intro">
            <p className="section-number" data-reveal-item>II</p>
            <p className="section-kicker" data-reveal-item>Sounds I return to</p>
            <h2 id="music-title" data-reveal-item>耳边的风景</h2>
            <p className="chapter-description" data-reveal-item>我不太按流派整理音乐，更愿意记住它出现时的天气、时间，以及那一刻的自己。</p>
          </div>

          <div className="sound-list" aria-label="三个音乐气氛片段">
            {soundscapes.map((item) => (
              <article className="sound-row" data-reveal-item key={item.number}>
                <span className="sound-number">{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.style}</p></div>
                <p className="sound-note">{item.note}</p>
                <span className="play-mark" aria-hidden="true"><i /></span>
              </article>
            ))}
          </div>
        </section>

        <section className="chapter film-chapter" id="films" aria-labelledby="films-title" data-reveal>
          <div className="section-heading">
            <p className="section-number" data-reveal-item>III</p>
            <div data-reveal-item><p className="section-kicker">Frames worth keeping</p><h2 id="films-title">我会停下来的画面</h2></div>
            <p className="heading-note" data-reveal-item>比情节更难忘的，常常是某个沉默的瞬间。</p>
          </div>

          <div className="film-grid">
            {filmNotes.map((film) => (
              <article className="film-card" data-tilt data-reveal-item key={film.number}>
                <div className={`film-window film-window--${film.number}`} aria-hidden="true">
                  <span>{film.number}</span><i />
                </div>
                <p className="film-number">Frame {film.number}</p>
                <h3>{film.title}</h3>
                <p>{film.note}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="chapter words-chapter" id="words" aria-labelledby="words-title" data-reveal>
        <div className="words-inner">
          <div className="words-aside">
            <p className="section-number" data-reveal-item>IV</p>
            <p className="section-kicker" data-reveal-item>Words with an afterglow</p>
            <h2 id="words-title" data-reveal-item>舍不得忘记的文字</h2>
            <p data-reveal-item>先收好，不急着解释。也许某一天，它会替当时的我说话。</p>
          </div>

          <div className="quote-stack">
            {quotes.map((quote, index) => (
              <blockquote data-reveal-item key={quote}>
                <span className="quote-mark" aria-hidden="true">“</span>
                <p>{quote}</p>
                <span className="quote-index">0{index + 1}</span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <div className="page-frame">
        <section className="chapter thoughts-chapter" id="thoughts" aria-labelledby="thoughts-title" data-reveal>
          <div className="section-heading">
            <p className="section-number" data-reveal-item>V</p>
            <div data-reveal-item><p className="section-kicker">Notes in progress</p><h2 id="thoughts-title">还在生长的想法</h2></div>
            <p className="heading-note" data-reveal-item>不是观点的展柜，只是一册允许反复修改的札记。</p>
          </div>

          <div className="notes-grid">
            {notes.map((note) => (
              <article className="note-card" data-tilt data-reveal-item key={note.number}>
                <div className="note-meta"><span>Note {note.number}</span><span>2026.07</span></div>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                <span className="note-orbit" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <footer>
          <a className="footer-mark" data-magnetic href="#home" aria-label="回到顶部">M</a>
          <p>© 2026 Morten-Liu</p>
          <p>Collected slowly, kept with care.</p>
          <a data-magnetic href="#home">回到页首 ↑</a>
        </footer>
      </div>
    </main>
  );
}
