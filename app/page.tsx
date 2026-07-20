"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    title: "关于慢",
    body: "不是所有事情都需要立刻给出结果。慢一点，有时只是为了看清自己究竟在寻找什么。",
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

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const page = pageRef.current;
    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = page.querySelector<HTMLElement>("[data-intro]");
    const count = page.querySelector<HTMLElement>("[data-intro-count]");
    const counter = { value: 0 };
    let introTimeline: gsap.core.Timeline | null = null;

    const releasePage = () => {
      document.body.classList.remove("intro-lock");
      if (intro) gsap.set(intro, { autoAlpha: 0, pointerEvents: "none" });
    };

    if (reducedMotion) {
      releasePage();
      gsap.set("[data-hero-reveal]", { yPercent: 0 });
    } else {
      document.body.classList.add("intro-lock");
      introTimeline = gsap
        .timeline({ defaults: { ease: "power4.inOut" }, onComplete: releasePage })
        .set(intro, { autoAlpha: 1, animation: "none" })
        .fromTo(".intro-rule-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.45, ease: "power2.inOut" }, 0)
        .to(
          counter,
          {
            value: 100,
            duration: 1.45,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count) count.textContent = String(Math.round(counter.value)).padStart(3, "0");
            },
          },
          0,
        )
        .fromTo(
          ".intro-letter",
          { yPercent: 125, rotateX: -45 },
          { yPercent: 0, rotateX: 0, duration: 0.85, stagger: 0.055 },
          0.12,
        )
        .fromTo(".intro-subline-inner", { yPercent: 110 }, { yPercent: 0, duration: 0.72 }, 0.48)
        .to(".intro-letter", { yPercent: -125, duration: 0.68, stagger: 0.025 }, 1.48)
        .to(".intro-subline-inner", { yPercent: -115, duration: 0.54 }, 1.49)
        .to(".intro-meta, .intro-skip", { autoAlpha: 0, duration: 0.35 }, 1.48)
        .to(".intro-panel--top", { yPercent: -101, duration: 0.95 }, 1.63)
        .to(".intro-panel--bottom", { yPercent: 101, duration: 0.95 }, 1.63)
        .fromTo(
          "[data-hero-reveal]",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.05, stagger: 0.075 },
          1.76,
        )
        .fromTo(
          ".portrait-frame",
          { clipPath: "inset(100% 0 0 0)", scale: 0.94 },
          { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.08 },
          1.82,
        )
        .fromTo(".topbar", { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 1.98)
        .fromTo(".hero-orbit", { scale: 0, rotate: -35 }, { scale: 1, rotate: 0, duration: 0.9 }, 2.05);

      skipIntroRef.current = () => introTimeline?.progress(1);
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") skipIntroRef.current();
    };
    document.addEventListener("keydown", onEscape);

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

        gsap.to("[data-parallax]", {
          yPercent: desktop ? 10 : 5,
          scale: 1.045,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
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
      introTimeline?.kill();
      motion.revert();
      cleanups.forEach((cleanup) => cleanup());
      document.removeEventListener("keydown", onEscape);
      document.body.classList.remove("intro-lock");
    };
  }, []);

  return (
    <main ref={pageRef} className="site-shell">
      <div className="intro-splash" data-intro>
        <div className="intro-panel intro-panel--top" />
        <div className="intro-panel intro-panel--bottom" />
        <div className="intro-content">
          <div className="intro-word" aria-label="Morten Liu">
            {"MORTEN".split("").map((letter, index) => (
              <span className="intro-letter-mask" key={`${letter}-${index}`}>
                <span className="intro-letter">{letter}</span>
              </span>
            ))}
          </div>
          <div className="intro-subline"><span className="intro-subline-inner">LIU · PERSONAL ARCHIVE</span></div>
        </div>
        <div className="intro-meta">
          <span data-intro-count>000</span>
          <div className="intro-rule"><span className="intro-rule-fill" /></div>
          <span>LOADING A QUIET WORLD</span>
        </div>
        <button className="intro-skip" type="button" onClick={() => skipIntroRef.current()}>
          跳过 / ESC
        </button>
      </div>

      <div className="motion-cursor" aria-hidden="true"><span /></div>
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress-fill" /></div>

      <div className="page-frame">
        <header className="topbar" aria-label="主导航">
          <a className="monogram" data-magnetic href="#home" aria-label="回到主页顶部">
            <span className="monogram-mark">M</span>
            <span className="monogram-name">Morten Liu</span>
          </a>
          <p className="edition">Personal Notes · Vol. 02</p>
          <nav>
            <a data-magnetic href="#about">关于</a>
            <a data-magnetic href="#collections">收藏</a>
            <a data-magnetic href="#thoughts">札记</a>
          </nav>
        </header>

        <section className="hero" id="home" aria-labelledby="page-title">
          <div className="hero-grid" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <div className="hero-orbit" aria-hidden="true"><span /></div>

          <div className="hero-intro" id="about">
            <p className="eyebrow"><span data-hero-reveal>A quiet introduction</span></p>
            <h1 id="page-title">
              <span className="hero-line"><span data-hero-reveal>Morten</span></span>
              <span className="hero-line hero-line--outline"><span data-hero-reveal>— Liu</span></span>
            </h1>
            <div className="intro-copy">
              <p className="intro-lead hero-line"><span data-hero-reveal>慢一点，认识我。</span></p>
              <p className="hero-line"><span data-hero-reveal>这里收着我反复听的声音、喜欢的光影、舍不得忘记的句子，以及还没长成结论的想法。</span></p>
            </div>
          </div>

          <figure className="portrait-frame" data-tilt>
            <div className="portrait-corners" aria-hidden="true" />
            <div className="portrait-image"><img data-parallax src="/avatar.jpg" alt="Morten-Liu 的树形水彩头像" /></div>
            <figcaption>A small tree, still growing</figcaption>
          </figure>

          <aside className="hero-note" aria-label="个人寄语">
            <p className="vertical-title">日常审美与私人片段</p>
            <span className="seal" aria-hidden="true">木<br />心</span>
            <blockquote>我喜欢那些不急着抵达，<br />却能留下余温的东西。</blockquote>
            <p className="signature">— Morten, lately</p>
          </aside>

          <a className="scroll-cue" data-magnetic href="#collections">
            <span>SCROLL TO ENTER</span><i aria-hidden="true">↓</i>
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
