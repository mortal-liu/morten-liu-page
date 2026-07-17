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
  {
    number: "A",
    title: "凌晨两点",
    style: "Ambient · Piano",
    note: "适合走得很慢的夜路",
  },
  {
    number: "B",
    title: "雨落以前",
    style: "Jazz · Voice",
    note: "窗边、咖啡与没写完的信",
  },
  {
    number: "C",
    title: "没有歌词",
    style: "Post-rock · Instrumental",
    note: "让声音替情绪把话说完",
  },
];

const filmNotes = [
  {
    number: "01",
    title: "漫长的停顿",
    note: "镜头不急着解释，人物也不急着回答。",
  },
  {
    number: "02",
    title: "被光记住的城市",
    note: "街道、车窗、黄昏和一场迟迟不停的雨。",
  },
  {
    number: "03",
    title: "关系里的留白",
    note: "比告别更难的，是始终没有说出的那部分。",
  },
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
  return (
    <main>
      <header className="topbar" aria-label="主导航">
        <a className="monogram" href="#home" aria-label="回到主页顶部">
          <span className="monogram-mark">M</span>
          <span className="monogram-name">Morten Liu</span>
        </a>
        <p className="edition">Personal Notes · Vol. 01</p>
        <nav>
          <a href="#about">关于</a>
          <a href="#collections">收藏</a>
          <a href="#thoughts">札记</a>
        </nav>
      </header>

      <section className="hero" id="home" aria-labelledby="page-title">
        <div className="hero-intro" id="about">
          <p className="eyebrow">A quiet introduction</p>
          <h1 id="page-title">
            Morten
            <span>— Liu</span>
          </h1>
          <div className="intro-copy">
            <p className="intro-lead">慢一点，认识我。</p>
            <p>
              这里收着我反复听的声音、喜欢的光影、舍不得忘记的句子，
              以及还没长成结论的想法。
            </p>
          </div>
        </div>

        <figure className="portrait-frame">
          <div className="portrait-corners" aria-hidden="true" />
          <img src="/avatar.jpg" alt="Morten-Liu 的树形水彩头像" />
          <figcaption>A small tree, still growing</figcaption>
        </figure>

        <aside className="hero-note" aria-label="个人寄语">
          <p className="vertical-title">日常审美与私人片段</p>
          <span className="seal" aria-hidden="true">
            木<br />心
          </span>
          <blockquote>
            我喜欢那些不急着抵达，
            <br />却能留下余温的东西。
          </blockquote>
          <p className="signature">— Morten, lately</p>
        </aside>
      </section>

      <section className="collection-index" id="collections" aria-labelledby="collections-title">
        <div className="section-heading index-heading">
          <p className="section-number">I</p>
          <div>
            <p className="section-kicker">A personal cabinet</p>
            <h2 id="collections-title">四份私人收藏</h2>
          </div>
          <p className="heading-note">它们不是标签，只是认识一个人的几条小路。</p>
        </div>

        <div className="collection-grid">
          {collections.map((item) => (
            <a className="collection-card" href={`#${item.id}`} key={item.id}>
              <span className="card-index">{item.index} / 04</span>
              <span className="card-arrow" aria-hidden="true">↗</span>
              <h3>{item.title}</h3>
              <span className="card-en">{item.en}</span>
              <p>{item.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="chapter music-chapter" id="music" aria-labelledby="music-title">
        <div className="chapter-intro">
          <p className="section-number">II</p>
          <p className="section-kicker">Sounds I return to</p>
          <h2 id="music-title">耳边的风景</h2>
          <p className="chapter-description">
            我不太按流派整理音乐，更愿意记住它出现时的天气、时间，
            以及那一刻的自己。
          </p>
        </div>

        <div className="sound-list" aria-label="三个音乐气氛片段">
          {soundscapes.map((item) => (
            <article className="sound-row" key={item.number}>
              <span className="sound-number">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.style}</p>
              </div>
              <p className="sound-note">{item.note}</p>
              <span className="play-mark" aria-hidden="true">●</span>
            </article>
          ))}
        </div>
      </section>

      <section className="chapter film-chapter" id="films" aria-labelledby="films-title">
        <div className="section-heading">
          <p className="section-number">III</p>
          <div>
            <p className="section-kicker">Frames worth keeping</p>
            <h2 id="films-title">我会停下来的画面</h2>
          </div>
          <p className="heading-note">比情节更难忘的，常常是某个沉默的瞬间。</p>
        </div>

        <div className="film-grid">
          {filmNotes.map((film) => (
            <article className="film-card" key={film.number}>
              <div className="film-window" aria-hidden="true">
                <span>{film.number}</span>
              </div>
              <p className="film-number">Frame {film.number}</p>
              <h3>{film.title}</h3>
              <p>{film.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="chapter words-chapter" id="words" aria-labelledby="words-title">
        <div className="words-aside">
          <p className="section-number">IV</p>
          <p className="section-kicker">Words with an afterglow</p>
          <h2 id="words-title">舍不得忘记的文字</h2>
          <p>先收好，不急着解释。也许某一天，它会替当时的我说话。</p>
        </div>

        <div className="quote-stack">
          {quotes.map((quote, index) => (
            <blockquote key={quote}>
              <span className="quote-mark" aria-hidden="true">“</span>
              <p>{quote}</p>
              <span className="quote-index">0{index + 1}</span>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="chapter thoughts-chapter" id="thoughts" aria-labelledby="thoughts-title">
        <div className="section-heading">
          <p className="section-number">V</p>
          <div>
            <p className="section-kicker">Notes in progress</p>
            <h2 id="thoughts-title">还在生长的想法</h2>
          </div>
          <p className="heading-note">不是观点的展柜，只是一册允许反复修改的札记。</p>
        </div>

        <div className="notes-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.number}>
              <div className="note-meta">
                <span>Note {note.number}</span>
                <span>2026.07</span>
              </div>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <a className="footer-mark" href="#home" aria-label="回到顶部">M</a>
        <p>© 2026 Morten-Liu</p>
        <p>Collected slowly, kept with care.</p>
        <a href="#home">回到页首 ↑</a>
      </footer>
    </main>
  );
}
