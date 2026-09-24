import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CHAT_MODEL = "gpt-4o";
const EMBEDDING_MODEL = "text-embedding-3-small";
const PINECONE_INDEX_NAME =
  process.env.PINECONE_INDEX_NAME || "potent-website";
const PINECONE_INDEX_HOST =
  process.env.PINECONE_INDEX_HOST ||
  "https://potent-website-n1ew62b.svc.aped-4627-b74a.pinecone.io";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type WebsiteVectorMetadata = {
  url?: string;
  chunkIndex?: number;
  text?: string;
};

type ChatSource = {
  url: string;
  label: string;
  type: "product" | "page";
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (message): message is ChatMessage =>
        message &&
        typeof message === "object" &&
        "role" in message &&
        "content" in message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: cleanText(message.content, 800),
    }))
    .filter((message) => message.content);
}

function formatContext(matches: WebsiteVectorMetadata[]) {
  return matches
    .map((metadata, index) => {
      const sourceUrl = metadata.url || "Potent Hygiene website";

      return `Source ${index + 1}: ${sourceUrl}\n${metadata.text}`;
    })
    .join("\n\n---\n\n");
}

function getSourceLabel(url: string) {
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    const slug = segments[segments.length - 1];

    if (!slug) {
      return "Visit Potent Hygiene";
    }

    const readableName = slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return parsedUrl.pathname.includes("/product-detail/")
      ? `Buy ${readableName}`
      : `Read ${readableName}`;
  } catch {
    return "Open link";
  }
}

function getSources(matches: WebsiteVectorMetadata[]): ChatSource[] {
  const urls = Array.from(
    new Set(
      matches
        .map((metadata) => metadata.url)
        .filter((url): url is string => Boolean(url)),
    ),
  );

  const productUrls = urls.filter((url) => url.includes("/product-detail/"));
  const selectedUrls = productUrls.length ? productUrls : urls;

  return selectedUrls.slice(0, 3).map((url) => ({
    url,
    label: getSourceLabel(url),
    type: url.includes("/product-detail/") ? "product" : "page",
  }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = cleanText(body?.message, 1200);
    const history = normalizeMessages(body?.messages);

    if (!question) {
      return NextResponse.json(
        { error: "Please send a question." },
        { status: 400 },
      );
    }

    const openai = new OpenAI({
      apiKey: getRequiredEnv("OPENAI_API_KEY"),
    });

    const pinecone = new Pinecone({
      apiKey: getRequiredEnv("PINECONE_API_KEY"),
    });

    const embedding = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: question,
    });

    const index = pinecone.index({
      name: PINECONE_INDEX_NAME,
      host: PINECONE_INDEX_HOST,
    });

    const namespace = process.env.PINECONE_NAMESPACE;
    const target = namespace ? index.namespace(namespace) : index;
    const queryResult = await target.query({
      vector: embedding.data[0].embedding,
      topK: 6,
      includeMetadata: true,
    });

    const matches = (queryResult.matches || [])
      .map((match) => match.metadata as WebsiteVectorMetadata | undefined)
      .filter(
        (metadata): metadata is WebsiteVectorMetadata =>
          Boolean(metadata?.text),
      )
      .slice(0, 5);

    if (!matches.length) {
      return NextResponse.json({
        answer:
          "I could not find that in the Potent Hygiene knowledge base yet. Please try asking about products, FAQs, policies, or period care information from the website.",
        sources: [],
      });
    }

    const context = formatContext(matches);
    const conversation = history
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      max_tokens: 550,
      messages: [
        {
          role: "developer",
          content:
            "You are Potent Hygiene's helpful website assistant. Answer questions using only the provided retrieved website context. Be warm, concise, and clear. If the context does not contain the answer, say you do not have that information on the website yet. Do not invent product claims, prices, medical advice, shipping promises, or policy details. For health-related questions, keep the answer educational and suggest consulting a qualified professional for personal medical concerns. When you suggest a Potent Hygiene product, mention that the user can buy or view it from the relevant source URL in the retrieved context.",
        },
        {
          role: "user",
          content: `Conversation so far:\n${conversation || "No prior conversation."}\n\nRetrieved website context:\n${context}\n\nUser question:\n${question}`,
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      "I am sorry, I could not generate an answer right now.";

    const sources = getSources(matches);

    return NextResponse.json({ answer, sources });
  } catch (error) {
    console.error("Chatbot API error:", error);

    return NextResponse.json(
      { error: "The assistant is unavailable right now." },
      { status: 500 },
    );
  }
}
