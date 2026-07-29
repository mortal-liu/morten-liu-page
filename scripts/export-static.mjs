import { access, copyFile, cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const serverEntry = resolve(projectRoot, "dist", "server", "index.js");
const clientDirectory = resolve(projectRoot, "dist", "client");
const outputDirectory = resolve(projectRoot, process.env.STATIC_OUTPUT_DIR ?? "dist-static");
const defaultSiteUrl = "https://morten-liu-notes.mortal060316.chatgpt.site/";
const siteUrl = new URL(process.env.STATIC_SITE_URL ?? defaultSiteUrl);

function assertSafeOutputDirectory() {
  const relativeOutput = relative(projectRoot, outputDirectory);
  if (!relativeOutput || relativeOutput.startsWith(`..${sep}`) || relativeOutput === "..") {
    throw new Error("STATIC_OUTPUT_DIR must stay inside the project directory.");
  }
}

async function assertBuildExists() {
  await Promise.all([access(serverEntry), access(clientDirectory)]).catch(() => {
    throw new Error("Vinext build output is missing. Run `npm run build` before exporting.");
  });
}

async function renderHomePage() {
  const workerUrl = pathToFileURL(serverEntry);
  workerUrl.searchParams.set("static-export", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(siteUrl, { headers: { accept: "text/html" } }),
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

  if (!response.ok) {
    throw new Error(`Static render failed with HTTP ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("text/html")) {
    throw new Error(`Static render returned ${contentType || "an unknown content type"}.`);
  }

  const html = await response.text();
  if (!html.includes('<main class="site-shell"') || !html.includes("Morten-Liu")) {
    throw new Error("Static render did not contain the expected homepage shell.");
  }

  return html;
}

async function validateLocalReferences(html) {
  const references = Array.from(html.matchAll(/(?:src|href)="(\/[^"]+)"/g), (match) => match[1]);
  const missing = [];

  for (const reference of new Set(references)) {
    const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    if (pathname === "/") continue;

    const candidate = resolve(outputDirectory, pathname.slice(1));
    const relativeCandidate = relative(outputDirectory, candidate);
    if (relativeCandidate.startsWith(`..${sep}`) || relativeCandidate === "..") {
      missing.push(reference);
      continue;
    }

    try {
      const details = await stat(candidate);
      if (!details.isFile()) missing.push(reference);
    } catch {
      missing.push(reference);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Static export is missing referenced files:\n${missing.join("\n")}`);
  }
}

assertSafeOutputDirectory();
await assertBuildExists();

const html = await renderHomePage();

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });
await writeFile(resolve(outputDirectory, "index.html"), html, "utf8");
await copyFile(resolve(outputDirectory, "index.html"), resolve(outputDirectory, "404.html"));
await writeFile(resolve(outputDirectory, ".nojekyll"), "", "utf8");

await validateLocalReferences(html);

const outputHtml = await readFile(resolve(outputDirectory, "index.html"), "utf8");
const byteSize = Buffer.byteLength(outputHtml);
console.log(`Static site exported to ${relative(projectRoot, outputDirectory)} (${byteSize} byte HTML shell).`);
