"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type PanelId = "story" | "favorites" | "pictures" | "thinking";
type FavoriteId = "music" | "screen" | "books";
type StoryView = "cover" | "archive" | "article";

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

const musicArtists = [
  {
    index: "01",
    name: "ASEN",
    chineseName: "艾志恒",
    image: "/favorites/music/artists/asen-portrait.png",
    tracks: musicFavorites,
  },
  {
    index: "02",
    name: "J. COLE",
    chineseName: "J. Cole",
    image: "/favorites/music/artists/j-cole.jpg",
    tracks: [],
  },
  {
    index: "03",
    name: "KANYE WEST",
    chineseName: "Kanye West",
    image: "/favorites/music/artists/kanye-west.jpg",
    tracks: [],
  },
  {
    index: "04",
    name: "KENDRICK LAMAR",
    chineseName: "Kendrick Lamar",
    image: "/favorites/music/artists/kendrick-lamar.jpg",
    tracks: [],
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

const storyPrologue = {
  index: "00",
  title: "序章",
  label: "PROLOGUE",
  paragraphs: [
    "记得初中有一次周末补课，我和一个好朋友似乎在拿语文老师说过的一句话开玩笑，我们俩当时本来都已经笑得不行了，结果那个老师上课的时候又重复了一遍又一遍，那时候我们笑得肚子都痛，怎么也停不下来。",
    "现在我只记得这些。那句话究竟是什么，我们为什么觉得好笑，当时还有哪些细节，我已经一点也想不起来了。这件事最后只剩下一个结论：那天我们笑得很开心。",
    "我觉得人的性格可能也是这样。小时候发生过许多不起眼的事情，它们一点点塑造了我们。等到很多年以后，我们已经习惯用“我就是这样的人”来概括自己，却很难再说清这个结论是怎么形成的。",
    "比如我一直觉得自己很善于思考，有时甚至觉得这是天生的。但现在回头看，也可能没有这么简单。",
    "小学上数学课时，我很喜欢寻找一些和别人不同的解题方法。想出方法这件事本身就让我高兴，再加上数学老师很会鼓励人，被看见和被肯定，也让我愿意继续把时间花在这上面。这种习惯后来一直保留了下来。",
    "它究竟有多少来自天生，有多少来自一次次正反馈，我不知道。思考本身带来的快乐和被人认可的虚荣心，大概从一开始就混在一起。具体的事情已经模糊，“我是一个善于思考的人”这个结论却留了下来。",
    "克尔凯郭尔有一句话常被转述为：“人生只能向后理解，却必须向前生活。”人当然只能向前活，但我不想因此放弃向后理解。",
    "有些人确实只能向前活，生活没有给他们留下回头看的余力。还有些人已经有了余力，却不知道应该从哪里开始。我以前也经常冒出许多问题，只是不知道该问谁，不知道去哪里寻找答案，甚至连应该看什么书都不知道。",
    "后来有了 AI。对于像我这样喜欢思考、又没什么资源的年轻人，它确实提供了一个很方便的入口。AI 先给出一个笼统的答案，我觉得太浅，就继续追问，再让它推荐相关的书。慢慢地，我开始沿着这些问题读书。",
    "AI 可以很快给出答案，书却让我真正经历了思考的过程。后来，无论是读哲学、健身，还是和一个比较熟悉历史的室友聊天，我都开始发现，许多原本分散的问题其实可以联系起来。我没有因此想明白所有事情，只是比以前更知道应该怎样寻找答案。",
    "在思想方面，我是一个实用主义者。思想必须对现实生活有用：要么让我活得更自洽一些，要么帮助我管理情绪，要么让我更好地理解世界和他人。我愿意借助哲学、精神分析或者其他知识回看自己，但不想用其中任何一种解释限制自己。知道一种性格可能从哪里来，不代表以后只能继续这样生活。",
    "有人会把这种回看称为“无病呻吟”。我觉得这个名字没有那么重要。一个问题既然会反复带来内耗和痛苦，它就已经进入了现实生活。反思也不代表一个人比其他人更高级。每个人都有自己的环境和限制，也有一些暂时无法面对的问题。我只是不想在有余力的时候，依然不去追问自己为什么会变成现在这样。",
    "这也是我决定开设这个 Story 板块的原因。",
    "我以前很少在网上分享自己的想法，最多和身边的人聊一聊。主动谈论这些事情，总让我觉得自己有点装。即使嘴上说着“只是写给自己”，只要知道有人会读，写作就一定会受到观众影响。",
    "个人网站让我稍微自在一些。会点进这里的人，大概已经对我这个人有了一点兴趣。我不需要考虑能不能得到很多转发，也不用急着让所有人理解。",
    "我写这篇序章，最初确实带着一点自证的意思。好像必须先向读者和自己解释清楚，我不是来装逼的，才有资格继续写下去。但现在想想，没有这个必要。",
    "我当然希望有人看见我的思考，这会满足我的虚荣心。如果读者又能从中得到一点东西，那就是一个双赢的局面。大大方方承认这一点没什么不好。真正需要注意的是，我不能站在一个自以为更清醒的位置上审视别人，也不能把没有反思习惯的人写成一群傻子。这里记录的是我的经历和理解，不是我给所有人准备的答案。",
    "这个板块一半写给愿意了解我的人，一半写给我自己。",
    "我不准备严格按照时间顺序，从出生、童年、初中一路写到现在。第一次让我明确意识到这种写法，是读余华的《在细雨中呼喊》。对我来说，重要的是它让我意识到，记忆本来就不会按照年份整齐地回来。",
    "所以以后想起哪件事，我就写哪件事。记得多少写多少，无法确定的地方就保留它的不确定。那些已经忘掉的部分，也同样属于我的故事。",
    "我写这些，不是为了给现在的自己找出一个完整、唯一的解释。我只是不想让所有过程都慢慢消失，最后只剩下几个关于“我是谁”的结论。",
    "生活还要继续向前。这个板块让我在向前走的时候，也能偶尔回头看看。",
  ],
};

const storyIndexEntries = [
  {
    index: "00",
    title: storyPrologue.title,
    label: storyPrologue.label,
    note: "关于记忆、性格，以及为什么要回头理解自己。",
    deck: "我只是不想让所有过程都慢慢消失，最后只剩下几个关于“我是谁”的结论。",
  },
];

export default function Home() {
  const [storyView, setStoryView] = useState<StoryView>("cover");
  const [activeFavorite, setActiveFavorite] = useState<FavoriteId | null>(null);
  const [favoriteView, setFavoriteView] = useState<FavoriteId | null>(null);
  const [favoriteIsLeaving, setFavoriteIsLeaving] = useState(false);
  const [musicSelection, setMusicSelection] = useState(0);
  const [musicArtistSelection, setMusicArtistSelection] = useState<number | null>(null);
  const [screenKind, setScreenKind] = useState<ScreenKind>("电影");
  const [screenSelection, setScreenSelection] = useState(0);
  const [bookSelection, setBookSelection] = useState(0);
  const pageRef = useRef<HTMLElement>(null);
  const preloadedFavoriteImagesRef = useRef<HTMLImageElement[]>([]);
  const favoriteEnterTimerRef = useRef<number | null>(null);
  const favoriteLeaveTimerRef = useRef<number | null>(null);
  const favoriteViewRef = useRef<FavoriteId | null>(null);
  const musicArtistSelectionRef = useRef<number | null>(null);
  const storyViewRef = useRef<StoryView>("cover");
  const storyArticleReturnRef = useRef<"cover" | "archive">("cover");
  const leaveStoryRef = useRef<() => void>(() => undefined);
  const leaveFavoriteSectionRef = useRef<() => void>(() => undefined);
  const skipIntroRef = useRef<() => void>(() => undefined);
  const changeQuoteRef = useRef<(direction: number) => void>(() => undefined);
  const openPanelRef = useRef<(panel: PanelId) => void>(() => undefined);
  const closePanelRef = useRef<() => void>(() => undefined);

  useLayoutEffect(() => {
    favoriteViewRef.current = favoriteView;
  }, [favoriteView]);

  useLayoutEffect(() => {
    musicArtistSelectionRef.current = musicArtistSelection;
  }, [musicArtistSelection]);

  useLayoutEffect(() => {
    storyViewRef.current = storyView;
  }, [storyView]);

  const openStory = (returnTo: "cover" | "archive") => {
    storyArticleReturnRef.current = returnTo;
    setStoryView("article");
    window.setTimeout(() => {
      pageRef.current?.querySelector<HTMLElement>("[data-story-detail-root]")?.focus({ preventScroll: true });
    }, 40);
  };

  const openStoryArchive = () => {
    setStoryView("archive");
    window.setTimeout(() => {
      pageRef.current?.querySelector<HTMLElement>("[data-story-archive-root]")?.focus({ preventScroll: true });
    }, 40);
  };

  const leaveStory = () => {
    const currentView = storyViewRef.current;
    const nextView = currentView === "article" ? storyArticleReturnRef.current : "cover";
    setStoryView(nextView);
    window.setTimeout(() => {
      const focusTarget = nextView === "archive"
        ? "[data-story-archive-root]"
        : currentView === "archive"
          ? "[data-story-archive-gate]"
          : "[data-story-entry]";
      pageRef.current?.querySelector<HTMLElement>(focusTarget)?.focus({ preventScroll: true });
    }, 40);
  };

  useLayoutEffect(() => {
    leaveStoryRef.current = leaveStory;
  });

  useEffect(() => {
    const preloadImages = (sources: string[], priority: "high" | "low") => (
      sources.map((source) => {
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = priority;
        image.src = source;
        void image.decode().catch(() => undefined);
        return image;
      })
    );

    const priorityFavoriteSources = [
      ...screenFavorites.slice(0, 2).map((item) => item.image),
      ...musicArtists.map((artist) => artist.image),
    ];
    preloadedFavoriteImagesRef.current = preloadImages(priorityFavoriteSources, "high");

    const preloadTimer = window.setTimeout(() => {
      const deferredSources = [
        ...screenFavorites.slice(2),
        ...musicFavorites,
        ...bookFavorites,
      ].map((item) => item.image);
      preloadedFavoriteImagesRef.current.push(...preloadImages(deferredSources, "low"));
    }, 900);

    return () => {
      window.clearTimeout(preloadTimer);
      preloadedFavoriteImagesRef.current = [];
    };
  }, []);

  const enterFavoriteSection = (id: FavoriteId) => {
    if (favoriteEnterTimerRef.current || favoriteLeaveTimerRef.current) return;
    if (id === "music") {
      musicArtistSelectionRef.current = null;
      setMusicArtistSelection(null);
    }
    setActiveFavorite(id);
    favoriteEnterTimerRef.current = window.setTimeout(() => {
      setFavoriteView(id);
      favoriteEnterTimerRef.current = null;
      window.setTimeout(() => {
        pageRef.current?.querySelector<HTMLElement>("[data-favorite-detail-root]")?.focus({ preventScroll: true });
      }, 40);
    }, 520);
  };

  const leaveFavoriteSection = () => {
    const previousView = favoriteViewRef.current;
    if (!previousView || favoriteLeaveTimerRef.current) return;

    if (previousView === "music" && musicArtistSelectionRef.current !== null) {
      musicArtistSelectionRef.current = null;
      setMusicArtistSelection(null);
      window.setTimeout(() => {
        pageRef.current?.querySelector<HTMLButtonElement>("[data-music-artist-card]")?.focus({ preventScroll: true });
      }, 40);
      return;
    }

    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360;
    setFavoriteIsLeaving(true);
    favoriteLeaveTimerRef.current = window.setTimeout(() => {
      setFavoriteView(null);
      setActiveFavorite(null);
      setFavoriteIsLeaving(false);
      favoriteLeaveTimerRef.current = null;
      window.setTimeout(() => {
        pageRef.current?.querySelector<HTMLButtonElement>(`[data-favorite-column="${previousView}"]`)?.focus({ preventScroll: true });
      }, 40);
    }, exitDuration);
  };

  useLayoutEffect(() => {
    leaveFavoriteSectionRef.current = leaveFavoriteSection;
  });

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
    const quoteCycleMs = 6000;
    const quoteSessionKey = "morten-liu:quote-timeline";

    let introTimeline: gsap.core.Timeline | null = null;
    let introExitTimeline: gsap.core.Timeline | null = null;
    let quoteTimeline: gsap.core.Timeline | null = null;
    let quoteProgress: gsap.core.Tween | null = null;
    let panelTimeline: gsap.core.Timeline | null = null;
    let quoteIndex = 0;
    let initialQuoteDelay = quoteCycleMs / 1000;
    let activePanel: PanelId | null = null;
    let introIsExiting = false;
    let panelIsTransitioning = false;
    let quoteIsTransitioning = false;
    let mediaSlot = 0;
    let disposed = false;

    document.body.classList.add("experience-lock");
    page.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => panel.setAttribute("inert", ""));

    const persistQuotePosition = (index: number, changedAt = Date.now()) => {
      try {
        window.sessionStorage.setItem(quoteSessionKey, JSON.stringify({ index, changedAt }));
      } catch {
        // The carousel remains functional when browser storage is unavailable.
      }
    };

    try {
      const storedValue = window.sessionStorage.getItem(quoteSessionKey);
      const stored = storedValue ? JSON.parse(storedValue) as { index?: number; changedAt?: number } : null;
      const storedIndex = stored?.index;
      const storedChangedAt = stored?.changedAt;
      if (
        typeof storedIndex === "number"
        && Number.isInteger(storedIndex)
        && storedIndex >= 0
        && storedIndex < featuredQuotes.length
        && typeof storedChangedAt === "number"
      ) {
        const now = Date.now();
        const normalizedChangedAt = Math.min(storedChangedAt, now);
        const elapsed = Math.max(0, now - normalizedChangedAt);
        const elapsedSteps = Math.floor(elapsed / quoteCycleMs);
        quoteIndex = (storedIndex + elapsedSteps) % featuredQuotes.length;
        const lastChangeAt = normalizedChangedAt + elapsedSteps * quoteCycleMs;
        initialQuoteDelay = Math.max(0.1, (quoteCycleMs - (now - lastChangeAt)) / 1000);
        persistQuotePosition(quoteIndex, lastChangeAt);
      } else {
        persistQuotePosition(quoteIndex);
      }
    } catch {
      persistQuotePosition(quoteIndex);
    }

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

    const initializeQuoteMedia = () => {
      const quote = featuredQuotes[quoteIndex];
      const activeCover = coverImages[mediaSlot];
      const activeBackdrop = backdropImages[mediaSlot];
      if (activeCover) {
        activeCover.src = quote.image;
        activeCover.alt = quote.imageAlt;
      }
      if (activeBackdrop) activeBackdrop.src = quote.backdropImage;
      gsap.set([activeCover, activeBackdrop].filter(Boolean), { autoAlpha: 1, scale: 1 });
      gsap.set([coverImages[1], backdropImages[1]].filter(Boolean), { autoAlpha: 0 });
    };

    const scheduleQuote = (delay = quoteCycleMs / 1000) => {
      quoteProgress?.kill();
      if (disposed) return;
      quoteProgress = gsap.delayedCall(delay, () => changeQuoteRef.current(1));
    };

    changeQuoteRef.current = (direction: number) => {
      void (async () => {
        if (quoteTimeline?.isActive() || quoteIsTransitioning) return;
        quoteIsTransitioning = true;

        const nextIndex = (quoteIndex + direction + featuredQuotes.length) % featuredQuotes.length;
        const nextSlot = mediaSlot === 0 ? 1 : 0;
        quoteProgress?.kill();
        await prepareQuoteMedia(nextIndex, nextSlot);

        if (disposed) {
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
          persistQuotePosition(quoteIndex);
          scheduleQuote();
          return;
        }

        quoteTimeline = gsap
          .timeline({
            defaults: { ease: "sine.inOut" },
            onComplete: () => {
              mediaSlot = nextSlot;
              quoteIsTransitioning = false;
              persistQuotePosition(quoteIndex);
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
        if (favoriteLeaveTimerRef.current) window.clearTimeout(favoriteLeaveTimerRef.current);
        favoriteEnterTimerRef.current = null;
        favoriteLeaveTimerRef.current = null;
        setFavoriteView(null);
        setActiveFavorite(null);
        setFavoriteIsLeaving(false);
      }
      if (closingId === "story") setStoryView("cover");

      if (reducedMotion) {
        gsap.set(target, { autoAlpha: 0, pointerEvents: "none" });
        target.setAttribute("aria-hidden", "true");
        target.setAttribute("inert", "");
        gsap.set(homeScreen, { autoAlpha: 1, pointerEvents: "auto" });
        activePanel = null;
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
    };

    initializeQuoteMedia();
    writeQuote(quoteIndex);
    scheduleQuote(initialQuoteDelay);

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

    const onKeydown = (event: KeyboardEvent) => {
      const introVisible = intro && gsap.getProperty(intro, "visibility") !== "hidden";
      if (event.key === "Escape") {
        if (introVisible) skipIntroRef.current();
        else if (activePanel === "story" && storyViewRef.current !== "cover") {
          leaveStoryRef.current();
        } else if (activePanel === "favorites" && favoriteViewRef.current) {
          leaveFavoriteSectionRef.current();
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
      if (favoriteLeaveTimerRef.current) window.clearTimeout(favoriteLeaveTimerRef.current);
      introTimeline?.kill();
      introExitTimeline?.kill();
      quoteTimeline?.kill();
      quoteProgress?.kill();
      panelTimeline?.kill();
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

      <section
        className="experience-panel panel-story"
        data-detail={storyView !== "cover"}
        data-panel="story"
        aria-hidden="true"
      >
        <PanelHeader index="01" title="STORY" onClose={() => closePanelRef.current()} />
        <div className="panel-body story-body">
          <aside data-panel-reveal><span>01 / 04</span><p>LIFE NOTES<br />WITHOUT A TIMELINE</p></aside>
          <div className="story-content" data-story-view={storyView}>
            <div className="story-index-view" data-visible={storyView === "cover"} aria-hidden={storyView !== "cover"}>
              <div className="story-index-intro" data-panel-reveal>
                <p className="panel-kicker">PERSONAL HISTORY / 001—∞</p>
                <h2>Story</h2>
                <p className="story-index-thesis">向前生活，向后理解。</p>
                <p className="story-index-description">
                  记忆不按年份回来。这里收留那些仍然清晰、已经模糊，以及尚未来得及写下的部分。
                </p>
                <div className="story-index-status" aria-label="Story 写作进度">
                  <span><strong>01</strong> WRITTEN</span>
                  <i aria-hidden="true" />
                  <span><strong>∞</strong> GROWING</span>
                </div>
              </div>
              <div className="story-canopy" data-panel-reveal>
                <div className="story-canopy-branch" aria-hidden="true">
                  <i /><i /><i /><i />
                </div>
                <button
                  className="story-feature-entry"
                  data-story-entry
                  type="button"
                  onClick={() => openStory("cover")}
                >
                  <span className="story-feature-index">FEATURED MEMORY / {storyIndexEntries[0].index}</span>
                  <span className="story-feature-copy">
                    <small>{storyIndexEntries[0].label}</small>
                    <strong>{storyIndexEntries[0].title}</strong>
                    <p>{storyIndexEntries[0].deck}</p>
                  </span>
                  <span className="story-feature-action">阅读全文 <i aria-hidden="true">↗</i></span>
                </button>
                <button
                  className="story-archive-gate"
                  data-story-archive-gate
                  type="button"
                  onClick={openStoryArchive}
                >
                  <span>ALL STORIES / 年轮档案</span>
                  <strong>进入年轮</strong>
                  <small>01 篇已写下 · 档案会随文字继续生长</small>
                  <i aria-hidden="true">↓</i>
                </button>
              </div>
            </div>

            <div className="story-archive-view" data-visible={storyView === "archive"} aria-hidden={storyView !== "archive"}>
              {storyView === "archive" && (
                <section className="story-archive" data-story-archive-root tabIndex={-1}>
                  <header className="story-immersive-header story-archive-header">
                    <p><span>01 / 04</span> · STORY / ALL STORIES</p>
                    <button type="button" aria-label="返回 Story 封面" onClick={leaveStory}>
                      返回 <strong>STORY</strong><span aria-hidden="true">←</span>
                    </button>
                  </header>
                  <div className="story-archive-scroll">
                    <div className="story-archive-intro">
                      <p>THE GROWING ARCHIVE / 001—∞</p>
                      <h2>年轮</h2>
                      <div>
                        <strong>写下的顺序，<br />不是人生的顺序。</strong>
                        <span>每一篇文章留下一圈纹理。它们不必完整，也不必按照年份整齐地回来。</span>
                      </div>
                    </div>
                    <div className="story-tree-index" aria-label="Story 全部篇目">
                      <i className="story-tree-trunk" aria-hidden="true" />
                      {storyIndexEntries.map((entry, index) => (
                        <button
                          className="story-branch-entry"
                          data-side={index % 2 === 0 ? "left" : "right"}
                          key={entry.index}
                          type="button"
                          onClick={() => openStory("archive")}
                        >
                          <span>{entry.index}</span>
                          <div>
                            <small>{entry.label} · CHAPTER {entry.index}</small>
                            <strong>{entry.title}</strong>
                            <p>{entry.note}</p>
                          </div>
                          <i aria-hidden="true">↗</i>
                        </button>
                      ))}
                      <div className="story-growth-marker">
                        <i aria-hidden="true" />
                        <span>NEXT RING</span>
                        <p>等待下一篇被写下。</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="story-detail-view" data-visible={storyView === "article"} aria-hidden={storyView !== "article"}>
              {storyView === "article" && (
                <StoryArticle
                  article={storyPrologue}
                  backLabel={storyArticleReturnRef.current === "archive" ? "年轮" : "STORY"}
                  onBack={leaveStory}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="experience-panel panel-favorites"
        data-detail={Boolean(favoriteView)}
        data-panel="favorites"
        aria-hidden="true"
      >
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

            <div
              className="favorite-detail-view"
              data-leaving={favoriteIsLeaving}
              data-visible={Boolean(favoriteView)}
              aria-hidden={!favoriteView}
            >
              {favoriteView && (
                <FavoriteImmersiveHeader
                  title={favoriteView.toUpperCase()}
                  tone={favoriteView === "books" ? "dark" : "light"}
                  isTransitioning={favoriteIsLeaving}
                  backTarget={favoriteView === "music" && musicArtistSelection !== null ? "ARTISTS" : "FAVORITES"}
                  onBack={leaveFavoriteSection}
                />
              )}
              {favoriteView === "music" && (
                <MusicArchive
                  activeIndex={musicSelection}
                  activeArtistIndex={musicArtistSelection}
                  onArtistSelect={setMusicArtistSelection}
                  onSelect={setMusicSelection}
                />
              )}
              {favoriteView === "screen" && (
                <ScreenArchive
                  activeIndex={screenSelection}
                  items={filteredScreenFavorites}
                  kind={screenKind}
                  onKindChange={(kind) => { setScreenKind(kind); setScreenSelection(0); }}
                  onSelect={setScreenSelection}
                />
              )}
              {favoriteView === "books" && (
                <BookArchive activeIndex={bookSelection} onSelect={setBookSelection} />
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
  activeArtistIndex,
  onArtistSelect,
  onSelect,
}: {
  activeIndex: number;
  activeArtistIndex: number | null;
  onArtistSelect: (index: number | null) => void;
  onSelect: (index: number) => void;
}) {
  const activeArtist = musicArtists[activeArtistIndex ?? 0];
  const activeItem = activeArtist.tracks[activeIndex] ?? null;

  return (
    <section
      className="favorite-archive music-archive"
      data-favorite-detail-root
      data-stage={activeArtistIndex === null ? "artists" : "tracks"}
      tabIndex={-1}
      aria-label="音乐收藏"
    >
      {activeArtistIndex === null ? (
        <div className="music-artist-lobby">
          <header className="music-lobby-heading">
            <p>ARTIST INDEX / PERSONAL LISTENING ARCHIVE</p>
            <h3>Artists</h3>
            <span>选择一位歌手，沿着他的声音继续向里走。</span>
          </header>

          <div className="music-artist-board" aria-label="歌手索引">
            {musicArtists.map((artist, index) => (
              <button
                className="music-artist-card"
                data-music-artist-card
                key={artist.name}
                type="button"
                onClick={() => onArtistSelect(index)}
                aria-label={`打开歌手 ${artist.chineseName} ${artist.name} 的歌曲档案`}
              >
                <span className="music-artist-card-frame">
                  <img src={artist.image} alt="" aria-hidden="true" fetchPriority="high" />
                  <i aria-hidden="true" />
                  <b aria-hidden="true">{artist.index}</b>
                </span>
                <span className="music-artist-card-copy">
                  <small>ARTIST {artist.index}</small>
                  <strong>{artist.name}</strong>
                  <span>{artist.chineseName} · {String(artist.tracks.length).padStart(2, "0")} TRACKS</span>
                </span>
                <span className="music-artist-card-action">ENTER ARCHIVE <i aria-hidden="true">↗</i></span>
              </button>
            ))}
          </div>

          <footer className="music-lobby-footer">
            <span>{String(musicArtists.length).padStart(2, "0")} ARTISTS IN ARCHIVE</span>
            <span>MOVE / HOVER / ENTER</span>
          </footer>
        </div>
      ) : (
        <>
          <div className="music-ambient-stack" aria-hidden="true">
            {activeArtist.tracks.length > 0 ? (
              activeArtist.tracks.map((item, index) => (
                <img key={item.title} data-active={index === activeIndex} src={item.image} alt="" decoding="async" />
              ))
            ) : (
              <img data-active="true" src={activeArtist.image} alt="" decoding="async" />
            )}
          </div>

          <div className="music-room">
            <button className="music-back-to-artists" type="button" onClick={() => onArtistSelect(null)}>
              <span aria-hidden="true">←</span> ARTIST INDEX
            </button>

            <aside className="music-artist-panel" aria-label={`歌手 ${activeArtist.chineseName} ${activeArtist.name}`}>
              <div className="music-artist-frame">
                <img src={activeArtist.image} alt={`${activeArtist.chineseName} ${activeArtist.name} 黑白肖像`} fetchPriority="high" />
                <span aria-hidden="true">{activeArtist.index}</span>
              </div>
              <p><span>ARTIST {activeArtist.index}</span><small>PORTRAIT ARCHIVE</small></p>
            </aside>

            {activeItem ? (
              <div className="music-artist-profile">
                <div className="music-artist-heading">
                  <p>{activeArtist.name} / SELECTED TRACK</p>
                  <h3>{activeItem.title}</h3>
                  <span>{activeItem.artist}</span>
                </div>

                <div className="music-selected-track">
                  <div className="music-selected-cover">
                    {activeArtist.tracks.map((item, index) => (
                      <img
                        key={item.title}
                        data-active={index === activeIndex}
                        src={item.image}
                        alt={index === activeIndex ? `${item.title}封面` : ""}
                        aria-hidden={index !== activeIndex}
                        decoding="async"
                      />
                    ))}
                  </div>
                  <div className="music-selected-index">
                    <p>TRACK {String(activeIndex + 1).padStart(2, "0")} / {String(activeArtist.tracks.length).padStart(2, "0")}</p>
                    <span>{activeArtist.chineseName} · {activeArtist.name}</span>
                  </div>
                </div>

                <AnnotationPlaceholder prompt="在这里写下它为什么会被你反复播放，或某一句留下来的歌词。" />
              </div>
            ) : (
              <div className="music-empty-profile">
                <p>ARTIST ARCHIVE / CONTENT PENDING</p>
                <h3>{activeArtist.name}</h3>
                <span>{activeArtist.chineseName}</span>
                <div>
                  <small>00 / TRACKS</small>
                  <strong>内容待补充</strong>
                  <p>这里以后会放入你选择的歌曲、介绍与自己的注解。</p>
                </div>
              </div>
            )}

            {activeArtist.tracks.length > 0 ? (
              <ol className="music-track-list" aria-label={`${activeArtist.chineseName} ${activeArtist.name} 歌曲列表`}>
                {activeArtist.tracks.map((item, index) => (
                  <li key={item.title}>
                    <button type="button" data-selected={index === activeIndex} onClick={() => onSelect(index)}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="music-track-copy"><strong>{item.title}</strong><small>{item.artist}</small></span>
                      <small>{index === activeIndex ? "PLAYING" : "SELECT"}</small>
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <aside className="music-empty-track-list" aria-label={`${activeArtist.name} 暂无歌曲`}>
                <span>TRACK INDEX</span>
                <strong>00</strong>
                <p>SONGS WILL<br />BE ADDED LATER</p>
              </aside>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function ScreenArchive({
  activeIndex,
  items,
  kind,
  onKindChange,
  onSelect,
}: {
  activeIndex: number;
  items: Array<{ title: string; kind: ScreenKind; image: string }>;
  kind: ScreenKind;
  onKindChange: (kind: ScreenKind) => void;
  onSelect: (index: number) => void;
}) {
  const activeItem = items[activeIndex] ?? items[0];
  const globalIndex = screenFavorites.findIndex((item) => item.title === activeItem.title);
  const screenKinds: Array<{ id: ScreenKind; index: string; label: string; count: number }> = [
    { id: "电影", index: "01", label: "FILM", count: screenFavorites.filter((item) => item.kind === "电影").length },
    { id: "电视剧", index: "02", label: "SERIES", count: screenFavorites.filter((item) => item.kind === "电视剧").length },
    { id: "动漫", index: "03", label: "ANIMATION", count: screenFavorites.filter((item) => item.kind === "动漫").length },
  ];

  return (
    <section className="favorite-archive screen-archive" data-favorite-detail-root tabIndex={-1} aria-label="影视收藏">
      <img className="screen-backdrop" key={activeItem.image} src={activeItem.image} alt="" aria-hidden="true" />
      <span className="screen-shade" aria-hidden="true" />

      <div className="screen-stage">
        <nav className="screen-kinds" aria-label="影视类型" role="tablist">
          {screenKinds.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={option.id === kind}
              data-selected={option.id === kind}
              onClick={() => onKindChange(option.id)}
            >
              <span className="screen-kind-index">{option.index}</span>
              <span className="screen-kind-copy">
                <strong>{option.id}</strong>
                <small>{option.label} · {String(option.count).padStart(2, "0")}</small>
              </span>
              <i aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="screen-title-block" key={`title-${kind}`}>
          <span>{String(globalIndex + 1).padStart(2, "0")} / {String(screenFavorites.length).padStart(2, "0")} · {activeItem.kind}</span>
          <h3>{activeItem.title}</h3>
          <AnnotationPlaceholder prompt="这里留给你的短评、喜欢的角色，或看完之后仍然没有散去的感受。" />
        </div>

        <div className="screen-poster-rail" key={`rail-${kind}`} aria-label={`${kind}海报列表`}>
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
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const activeItem = bookFavorites[activeIndex] ?? bookFavorites[0];

  return (
    <section className="favorite-archive book-archive" data-favorite-detail-root tabIndex={-1} aria-label="书籍收藏">
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
          <div className="book-cover-stack">
            {bookFavorites.map((item, index) => (
              <img
                key={item.title}
                data-active={index === activeIndex}
                src={item.image}
                alt={index === activeIndex ? `${item.title}封面` : ""}
                aria-hidden={index !== activeIndex}
                decoding="async"
              />
            ))}
          </div>
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

function AnnotationPlaceholder({ prompt }: { prompt: string }) {
  return (
    <div className="annotation-placeholder">
      <span>MY NOTE / 待填写</span>
      <p>{prompt}</p>
      <i aria-hidden="true" />
    </div>
  );
}

function StoryArticle({
  article,
  backLabel,
  onBack,
}: {
  article: typeof storyPrologue;
  backLabel: string;
  onBack: () => void;
}) {
  const sectionBreaks = new Set([8, 12, 18]);

  return (
    <article className="story-article" data-story-detail-root tabIndex={-1}>
      <header className="story-immersive-header">
        <p><span>01 / 04</span> · STORY / {article.index}</p>
        <button type="button" aria-label={`返回 ${backLabel}`} onClick={onBack}>
          返回 <strong>{backLabel}</strong><span aria-hidden="true">←</span>
        </button>
      </header>

      <div className="story-article-layout">
        <aside className="story-article-masthead">
          <span>{article.label} / {article.index}</span>
          <h1><small>{article.index}</small>{article.title}</h1>
          <p>MORTEN—LIU<br />PERSONAL HISTORY</p>
          <i aria-hidden="true" />
        </aside>

        <div className="story-article-copy">
          <p className="story-article-deck">我只是不想让所有过程都慢慢消失，最后只剩下几个关于“我是谁”的结论。</p>
          {article.paragraphs.map((paragraph, index) => (
            <p
              className={sectionBreaks.has(index) ? "story-section-break" : undefined}
              data-emphasis={index === 6 || undefined}
              key={`${article.index}-${index}`}
            >
              {paragraph}
            </p>
          ))}
          <footer><span>{article.index} / END</span><i aria-hidden="true" /></footer>
        </div>
      </div>
    </article>
  );
}

function FavoriteImmersiveHeader({
  title,
  tone,
  isTransitioning,
  backTarget,
  onBack,
}: {
  title: string;
  tone: "light" | "dark";
  isTransitioning: boolean;
  backTarget: "ARTISTS" | "FAVORITES";
  onBack: () => void;
}) {
  return (
    <header className="favorite-immersive-header" data-tone={tone}>
      <p><span>02 / 04</span> · FAVORITES / {title}</p>
      <button type="button" disabled={isTransitioning} aria-label={`返回 ${backTarget}`} onClick={onBack}>
        返回 <strong>{backTarget}</strong><span aria-hidden="true">←</span>
      </button>
    </header>
  );
}

function PanelHeader({ index, title, onClose }: { index: string; title: string; onClose: () => void }) {
  return (
    <header className="panel-header">
      <a href="#home" aria-label="Morten Liu 主页" onClick={(event) => { event.preventDefault(); onClose(); }}>
        <span className="panel-monogram">M</span><span>MORTEN—LIU</span>
      </a>
      <p>{index} / 04 · {title}</p>
      <button type="button" data-panel-close aria-label="关闭并返回主页" onClick={onClose}>
        关闭 <span aria-hidden="true">×</span>
      </button>
    </header>
  );
}
