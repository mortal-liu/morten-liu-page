import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Morten-Liu archive shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Morten-Liu/);
  assert.match(html, /<main[^>]*class="site-shell"/);
  assert.match(html, /圣诞树无论是位于地下室房间里/);
  assert.match(html, />STORY</);
  assert.match(html, />FAVORITES</);
  assert.match(html, />PICTURES</);
  assert.match(html, />THINKING</);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps expanding content in the central content registry", async () => {
  const [page, content, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /from "\.\/content"/);
  assert.match(page, /storyArticles\.map/);
  assert.match(page, /pictureRolls\.flatMap/);
  assert.match(page, /className="picture-gallery"/);
  assert.match(page, /className="picture-gallery-roll-menu"/);
  assert.match(page, /window\.setInterval/);
  assert.match(page, /className="picture-gallery-thumbnails"/);
  assert.doesNotMatch(page, /picture-frame-meta|picture-film-footer|picture-roll-drawer/);
  assert.match(page, /thinkingEntries\.map/);
  assert.match(page, /loading="lazy"/);
  assert.doesNotMatch(page, /const storyPrologue|const storyIndexEntries/);

  for (const registry of [
    "featuredQuotes",
    "musicArtists",
    "pictureRolls",
    "screenFavorites",
    "bookFavorites",
    "storyArticles",
    "thinkingEntries",
  ]) {
    assert.match(content, new RegExp(`export const ${registry}`));
  }

  assert.match(content, /title: "Better Call Saul"/);
  assert.match(content, /title: "Breaking Bad"/);
  assert.doesNotMatch(content, /从一棵树开始|image: "\/avatar\.jpg"/);

  assert.match(layout, /title:\s*"Morten-Liu/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
