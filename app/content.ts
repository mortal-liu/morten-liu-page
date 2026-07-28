export type PanelId = "story" | "favorites" | "pictures" | "thinking";
export type FavoriteId = "music" | "screen" | "books";
export type ScreenKind = "电影" | "电视剧" | "动漫";

export type ReviewNote = {
  paragraphs: string[];
  prompt: string;
};

export type StoryArticleContent = {
  index: string;
  title: string;
  label: string;
  note: string;
  deck: string;
  paragraphs: string[];
  sectionBreaks?: number[];
  emphasis?: number[];
};

export type ThinkingEntry = {
  index: string;
  title: string;
  label: string;
  summary: string;
  paragraphs: string[];
};

export const featuredQuotes = [
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
    image: "/quotes/after-rain.webp",
    backdropImage: "/quotes/after-rain.webp",
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
    image: "/quotes/jung-letters-vol-1.webp",
    backdropImage: "/quotes/jung-letters-vol-1.webp",
    imageAlt: "C. G. Jung Letters, Volume 1 书封",
    imageOpacity: 0.34,
    theme: "ink",
  },
];

export const portals: Array<{ id: PanelId; index: string; title: string; subtitle: string }> = [
  { id: "story", index: "01", title: "STORY", subtitle: "人生经历" },
  { id: "favorites", index: "02", title: "FAVORITES", subtitle: "音乐 · 影视 · 书" },
  { id: "pictures", index: "03", title: "PICTURES", subtitle: "影像与瞬间" },
  { id: "thinking", index: "04", title: "THINKING", subtitle: "一些想法" },
];

export const panelTitles: Record<PanelId, string> = {
  story: "STORY",
  favorites: "FAVORITES",
  pictures: "PICTURES",
  thinking: "THINKING",
};

export const favoriteSections: Array<{
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

const trackNotePrompt = "在这里写下它为什么会被你反复播放，或某一句留下来的歌词。";
const albumNotePrompt = "在这里写下这张专辑的整体气质、它最打动你的部分，以及你最推荐的三首歌。";

const musicTracks = [
  {
    title: "焦虑",
    artist: "艾志恒Asen · Maikon Flocka Flame",
    image: "/favorites/music/anxiety.jpg",
    note: { paragraphs: [], prompt: trackNotePrompt },
  },
  {
    title: "小镇的孩子",
    artist: "艾志恒Asen",
    image: "/favorites/music/small-town-child.jpg",
    note: { paragraphs: [], prompt: trackNotePrompt },
  },
  {
    title: "你给的恨",
    artist: "艾志恒Asen · Maikon Flocka Flame",
    image: "/favorites/music/the-hate-you-gave.jpg",
    note: { paragraphs: [], prompt: trackNotePrompt },
  },
];

const musicAlbums = [
  {
    title: "在雨后醒来",
    artist: "艾志恒Asen",
    image: "/quotes/after-rain.webp",
    meta: "ALBUM / PERSONAL SELECTION",
    note: { paragraphs: [], prompt: albumNotePrompt },
  },
  {
    title: "Life After Small Town",
    artist: "艾志恒Asen",
    image: "/favorites/music/small-town-child.jpg",
    meta: "ALBUM / PERSONAL SELECTION",
    note: { paragraphs: [], prompt: albumNotePrompt },
  },
];

export const musicArtists = [
  {
    index: "01",
    name: "ASEN",
    chineseName: "艾志恒",
    image: "/favorites/music/artists/asen-portrait.webp",
    tracks: musicTracks,
    albums: musicAlbums,
  },
  {
    index: "02",
    name: "J. COLE",
    chineseName: "J. Cole",
    image: "/favorites/music/artists/j-cole.jpg",
    tracks: [],
    albums: [],
  },
  {
    index: "03",
    name: "KANYE WEST",
    chineseName: "Kanye West",
    image: "/favorites/music/artists/kanye-west.jpg",
    tracks: [],
    albums: [],
  },
  {
    index: "04",
    name: "KENDRICK LAMAR",
    chineseName: "Kendrick Lamar",
    image: "/favorites/music/artists/kendrick-lamar.jpg",
    tracks: [],
    albums: [],
  },
];

export const pictureRolls = [
  {
    index: "01",
    title: "起始帧",
    label: "THE FIRST ROLL",
    frames: [
      {
        index: "001",
        image: "/avatar.jpg",
        alt: "Morten-Liu 的圣诞树头像",
        title: "从一棵树开始",
        date: "UNDATED",
        place: "PERSONAL ARCHIVE",
        caption: "这是暗房里的第一张影像。更多时刻会在以后慢慢显影。",
      },
    ],
  },
];

const screenNotePrompt = "这里留给你的短评、喜欢的角色，或看完之后仍然没有散去的感受。";

export const screenFavorites: Array<{
  title: string;
  kind: ScreenKind;
  image: string;
  note: ReviewNote;
}> = [
  { title: "搏击俱乐部", kind: "电影", image: "/favorites/screen/fight-club.jpg", note: { paragraphs: [], prompt: screenNotePrompt } },
  { title: "帕特森", kind: "电影", image: "/favorites/screen/paterson.jpg", note: { paragraphs: [], prompt: screenNotePrompt } },
  { title: "苦尽柑来遇见你", kind: "电视剧", image: "/favorites/screen/tangerines.jpg", note: { paragraphs: [], prompt: screenNotePrompt } },
  { title: "绝命毒师", kind: "电视剧", image: "/favorites/screen/breaking-bad.jpg", note: { paragraphs: [], prompt: screenNotePrompt } },
  { title: "风骚律师", kind: "电视剧", image: "/favorites/screen/better-call-saul.jpg", note: { paragraphs: [], prompt: screenNotePrompt } },
  { title: "进击的巨人", kind: "动漫", image: "/favorites/screen/attack-on-titan.jpg", note: { paragraphs: [], prompt: screenNotePrompt } },
  { title: "我的青春恋爱物语果然有问题", kind: "动漫", image: "/favorites/screen/oregairu.jpg", note: { paragraphs: [], prompt: screenNotePrompt } },
];

const bookNotePrompt = "在这里整理你的批注：喜欢的段落、读完后的判断，以及未来重读时想重新确认的问题。";

export const bookFavorites = [
  {
    title: "活着",
    author: "余华",
    type: "小说",
    image: "/favorites/books/to-live.jpg",
    note: { paragraphs: [], prompt: bookNotePrompt },
  },
  {
    title: "被讨厌的勇气",
    author: "岸见一郎 · 古贺史健",
    type: "心理 / 哲学",
    image: "/favorites/books/courage-to-be-disliked.jpg",
    note: { paragraphs: [], prompt: bookNotePrompt },
  },
  {
    title: "小岛经济学",
    author: "彼得·希夫 · 安德鲁·希夫",
    type: "经济学",
    image: "/favorites/books/island-economics.jpg",
    note: { paragraphs: [], prompt: bookNotePrompt },
  },
];

export const storyArticles: StoryArticleContent[] = [
  {
    index: "00",
    title: "序章",
    label: "PROLOGUE",
    note: "关于记忆、性格，以及为什么要回头理解自己。",
    deck: "我只是不想让所有过程都慢慢消失，最后只剩下几个关于“我是谁”的结论。",
    sectionBreaks: [8, 12, 18],
    emphasis: [6],
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
  },
];

export const thinkingEntries: ThinkingEntry[] = [
  {
    index: "001",
    title: "关于观察",
    label: "NOTE IN PROGRESS",
    summary: "先记录发生过什么，再决定如何理解它。",
    paragraphs: ["先记录发生过什么，再决定如何理解它。"],
  },
  {
    index: "002",
    title: "下一篇",
    label: "NOT WRITTEN YET",
    summary: "尚未写下。",
    paragraphs: [],
  },
  {
    index: "003",
    title: "下一篇",
    label: "NOT WRITTEN YET",
    summary: "尚未写下。",
    paragraphs: [],
  },
];
