import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(projectRoot, "dist-static");

test("exports a self-contained static homepage", async () => {
  const [html, fallbackHtml] = await Promise.all([
    readFile(resolve(outputDirectory, "index.html"), "utf8"),
    readFile(resolve(outputDirectory, "404.html"), "utf8"),
    access(resolve(outputDirectory, ".nojekyll")),
  ]);

  assert.equal(fallbackHtml, html);
  assert.match(html, /<title>Morten-Liu/);
  assert.match(html, /<main[^>]*class="site-shell"/);
  assert.match(html, /圣诞树无论是位于地下室房间里/);
  assert.match(html, />STORY</);
  assert.match(html, />FAVORITES</);
  assert.match(html, />PICTURES</);
  assert.match(html, />THINKING</);
  assert.match(html, /<script[^>]+id="_R_"[^>]*>import\("\/assets\//);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);

  const references = Array.from(html.matchAll(/(?:src|href)="(\/[^"]+)"/g), (match) => match[1]);
  assert.ok(references.some((reference) => reference.startsWith("/assets/")));

  for (const reference of new Set(references)) {
    const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    if (pathname === "/") continue;

    const candidate = resolve(outputDirectory, pathname.slice(1));
    const relativeCandidate = relative(outputDirectory, candidate);
    assert.ok(
      relativeCandidate !== ".." && !relativeCandidate.startsWith(`..${sep}`),
      `${reference} escaped the static output directory`,
    );
    assert.ok((await stat(candidate)).isFile(), `${reference} was not exported`);
  }
});

test("keeps server-only output outside the static package", async () => {
  await assert.rejects(access(resolve(outputDirectory, "server")));
  await assert.rejects(access(resolve(outputDirectory, ".openai")));
});
