/**
 * scrape-embed-pinecone
 * ---------------------
 * Fetch local Next.js pages with Playwright,
 * extract readable content, create OpenAI embeddings,
 * and upsert vectors into Pinecone.
 */

require("dotenv").config();

const cheerio = require("cheerio");
const { OpenAI } = require("openai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { chromium } = require("playwright");

// ── Config ──────────────────────────────────────────────────────────────

const LOCAL_BASE_URL = "http://localhost:3000";
const PRODUCTION_BASE_URL = "https://potenthygiene.com";

const PAGES = [
  "/",
  "/product-detail/ovy-liners#p60",
  "/product-detail/ovy-teen#starter",
  "/product-detail/ovy-panty#lxl",
  "/product-detail/looway-pee-funnel",
  "/product-detail/looway-pee-puke",
  "/product-detail/looway-toilet-seat-covers",
  "/product-detail/ovy-cup#0",
  "/ovy",
  "/looway",
  "/quiz",
  "/period-log",
  "/terms-condition",
  "/refund-policy",
  "/shipping-policy",
  "/privacy-policy",
  "/faq",
  "/about",
];

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBED_BATCH_SIZE = 20;
const UPSERT_BATCH_SIZE = 100;

const REQUEST_DELAY_MS = 500;

const TAGS_TO_STRIP = [
  "script",
  "style",
  "noscript",
  "iframe",
  "svg",
  "header",
  "footer",
  "nav",
  "form",
  "button",
  "aside",
  "link",
  "meta",
];

const KEEP_ATTRS = {
  img: ["src", "alt"],
  video: ["src", "poster"],
  source: ["src"],
  a: ["href"],
};

const BLOCK_TAGS = new Set([
  "p",
  "div",
  "section",
  "article",
  "main",
  "header",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "table",
  "tr",
  "td",
  "th",
  "blockquote",
  "pre",
  "figure",
  "figcaption",
]);

// ── Clients ─────────────────────────────────────────────────────────────

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const openai = new OpenAI({
  apiKey: requireEnv("OPENAI_API_KEY"),
});

const pinecone = new Pinecone({
  apiKey: requireEnv("PINECONE_API_KEY"),
});

// ── Browser ─────────────────────────────────────────────────────────────

let browser;

async function fetchPage(url) {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
    });
  }

  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Allow Next.js / React client-side rendering to finish.
    await page.waitForTimeout(2000);

    return await page.content();
  } finally {
    await page.close();
  }
}

// ── URL helpers ─────────────────────────────────────────────────────────

function getProductionUrl(path) {
  // Remove hash because #p60/#starter are client-side fragments
  // and shouldn't be part of the canonical URL stored in Pinecone.
  const cleanPath = path.split("#")[0];

  return `${PRODUCTION_BASE_URL}${cleanPath}`;
}

function getLocalUrl(path) {
  return `${LOCAL_BASE_URL}${path}`;
}

function slugify(url) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

// ── Clean HTML ──────────────────────────────────────────────────────────

function resolveUrl(maybeRelativeUrl, baseUrl) {
  if (!maybeRelativeUrl) return "";

  try {
    return new URL(maybeRelativeUrl, baseUrl).href;
  } catch {
    return maybeRelativeUrl;
  }
}

function stripNoise($, baseUrl) {
  $(TAGS_TO_STRIP.join(",")).remove();

  $("*")
    .contents()
    .filter((_, node) => node.type === "comment")
    .remove();

  // Images
  $("img").each((_, el) => {
    const $el = $(el);

    const alt = ($el.attr("alt") || "").trim();
    const src = resolveUrl($el.attr("src"), baseUrl);

    $el.replaceWith(`\n[IMAGE${alt ? `: ${alt}` : ""} | src: ${src}]\n`);
  });

  // Videos
  $("video").each((_, el) => {
    const $el = $(el);

    const src =
      resolveUrl($el.attr("src"), baseUrl) ||
      resolveUrl($el.find("source").first().attr("src"), baseUrl);

    $el.replaceWith(`\n[VIDEO | src: ${src}]\n`);
  });

  $("br").each((_, el) => {
    $(el).replaceWith("\n");
  });

  // Remove unnecessary attributes.
  $("*").each((_, el) => {
    if (el.type !== "tag") return;

    const tag = el.tagName.toLowerCase();
    const keep = new Set(KEEP_ATTRS[tag] || []);

    for (const attr of Object.keys(el.attribs)) {
      if (!keep.has(attr)) {
        delete el.attribs[attr];
      }
    }
  });
}

function nodeToText($, el) {
  let out = "";

  $(el)
    .contents()
    .each((_, node) => {
      if (node.type === "text") {
        out += node.data;
      } else if (node.type === "tag") {
        const tag = node.tagName.toLowerCase();
        const inner = nodeToText($, node);

        out += BLOCK_TAGS.has(tag) ? `\n${inner}\n` : inner;
      }
    });

  return out;
}

function normalizeWhitespace(text) {
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

function extractContent(html, baseUrl) {
  const $ = cheerio.load(html);

  stripNoise($, baseUrl);

  const root = $("main").length
    ? $("main").first()
    : $("article").length
      ? $("article").first()
      : $("body");

  if (!root.length) {
    return "";
  }

  const rawText = nodeToText($, root.get(0));

  return normalizeWhitespace(rawText);
}

// ── Chunking ────────────────────────────────────────────────────────────

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];

  const len = text.length;
  let start = 0;

  while (start < len) {
    let end = Math.min(start + chunkSize, len);

    // Avoid cutting words.
    if (end < len) {
      const nextSpace = text.indexOf(" ", end);

      if (nextSpace !== -1 && nextSpace - end < 50) {
        end = nextSpace;
      }
    }

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= len) {
      break;
    }

    let nextStart = Math.max(end - overlap, start + 1);

    if (nextStart > 0 && text[nextStart - 1] !== " ") {
      const spaceAfter = text.indexOf(" ", nextStart);

      if (spaceAfter !== -1 && spaceAfter - nextStart < 30) {
        nextStart = spaceAfter + 1;
      }
    }

    start = nextStart;
  }

  return chunks;
}

// ── OpenAI Embeddings ───────────────────────────────────────────────────

async function embedBatch(texts) {
  if (!texts.length) {
    return [];
  }

  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return res.data.map((item) => item.embedding);
}

// ── Pinecone ────────────────────────────────────────────────────────────

async function upsertVectors(index, vectors, namespace) {
  if (!vectors.length) {
    console.log("  no vectors to upsert");
    return;
  }

  const target = namespace ? index.namespace(namespace) : index;

  for (let i = 0; i < vectors.length; i += UPSERT_BATCH_SIZE) {
    const batch = vectors.slice(i, i + UPSERT_BATCH_SIZE);

    if (!batch.length) {
      continue;
    }

    await target.upsert({
      records: batch,
    });

    console.log(`    Pinecone upserted ${batch.length} vectors`);
  }
}

// ── Process Page ────────────────────────────────────────────────────────

async function processPage(path, index, namespace) {
  const localUrl = getLocalUrl(path);
  const productionUrl = getProductionUrl(path);

  console.log(`\nFetching:   ${localUrl}`);
  console.log(`Storing as: ${productionUrl}`);

  const html = await fetchPage(localUrl);

  console.log(`  raw html length: ${html.length}`);

  const text = extractContent(html, localUrl);

  const chunks = chunkText(text);

  console.log(`  cleaned to ${text.length} chars -> ${chunks.length} chunks`);

  if (!chunks.length) {
    console.log("  skipped: no content found");
    return;
  }

  const vectors = [];

  for (let i = 0; i < chunks.length; i += EMBED_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBED_BATCH_SIZE);

    console.log(
      `  embedding chunks ${i + 1}-${Math.min(
        i + batch.length,
        chunks.length,
      )}/${chunks.length}`,
    );

    const embeddings = await embedBatch(batch);

    embeddings.forEach((values, j) => {
      const chunkIndex = i + j;

      vectors.push({
        id: `${slugify(productionUrl)}-chunk-${chunkIndex}`,

        values,

        metadata: {
          // IMPORTANT:
          // Production URL is stored in Pinecone.
          url: productionUrl,

          chunkIndex,

          text: chunks[chunkIndex].slice(0, 2000),
        },
      });
    });
  }

  await upsertVectors(index, vectors, namespace);

  console.log(`  upserted   ${vectors.length} vectors`);
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  const namespace = process.env.PINECONE_NAMESPACE || undefined;

  const index = pinecone.index({
    name: "potent-website",
    host: "https://potent-website-n1ew62b.svc.aped-4627-b74a.pinecone.io",
  });

  for (const path of PAGES) {
    try {
      await processPage(path, index, namespace);
    } catch (err) {
      console.error(`Failed for ${path}: ${err.message}\n`);
    }

    await sleep(REQUEST_DELAY_MS);
  }

  if (browser) {
    await browser.close();
  }

  console.log("\nDone.");
}

// ── Utility ─────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

main().catch(async (err) => {
  console.error(err);

  if (browser) {
    await browser.close();
  }

  process.exit(1);
});
