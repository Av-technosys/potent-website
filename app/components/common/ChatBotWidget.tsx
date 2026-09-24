"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Bot,
  ExternalLink,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

type ChatSource = {
  url: string;
  label: string;
  type: "product" | "page";
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I am Potent Assistant. Ask me about our products, FAQs, policies, or period care.",
};

const suggestedQuestions = [
  "Which product is best for heavy flow?",
  "Suggest a product for travel hygiene",
  "What is the Ovy Cup used for?",
  "What are your shipping details?",
  "How do I choose the right pad size?",
];

const hiddenPathPrefixes = [
  "/admin",
  "/dashboard",
  "/login",
  "/signup",
  "/reset-password",
  "/email-verification",
];

function createMessage(
  role: ChatMessage["role"],
  content: string,
  sources?: ChatSource[],
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    sources,
  };
}

function isValidSource(value: unknown): value is ChatSource {
  return (
    value !== null &&
    typeof value === "object" &&
    "url" in value &&
    "label" in value &&
    "type" in value &&
    typeof value.url === "string" &&
    typeof value.label === "string" &&
    (value.type === "product" || value.type === "page")
  );
}

function normalizeSources(value: unknown): ChatSource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isValidSource).slice(0, 3);
}

function renderLinkedText(content: string) {
  const urlPattern = /(https?:\/\/[^\s)]+)/g;
  const exactUrlPattern = /^https?:\/\/[^\s)]+$/;
  const parts = content.split(urlPattern);

  return parts.map((part, index) => {
    if (!exactUrlPattern.test(part)) {
      return part;
    }

    return (
      <a
        key={`${part}-${index}`}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="break-words font-medium text-[#8f4e85] underline underline-offset-2"
      >
        {part}
      </a>
    );
  });
}

export function ChatBotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHidden = hiddenPathPrefixes.some((prefix) =>
    pathname?.startsWith(prefix),
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    inputRef.current?.focus();
  }, [isOpen, messages, isLoading]);

  if (isHidden) {
    return null;
  }

  async function sendQuestion(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    const userMessage = createMessage("user", trimmedQuestion);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedQuestion,
          messages: messages
            .filter((message) => message.id !== welcomeMessage.id)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to get an answer.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          data?.answer || "I could not find an answer for that right now.",
          normalizeSources(data?.sources),
        ),
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          error instanceof Error
            ? error.message
            : "The assistant is unavailable right now.",
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendQuestion(input);
  }

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:right-6">
      {isOpen ? (
        <section
          className="flex h-[min(620px,calc(100vh-120px))] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-lg border border-[#efd8e5] bg-white shadow-[0_20px_60px_rgba(63,39,56,0.22)]"
          aria-label="Potent Assistant chat"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[#f2dfea] bg-[#fff7fb] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#AF71A7] text-white">
                <Bot size={18} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-[#31222d]">
                  Potent Assistant
                </h2>
                <p className="truncate text-xs text-[#7d6575]">
                  Answers from the website
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#6f5368] transition hover:bg-[#f4e4ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7]"
              aria-label="Close chat"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[#fffbfd] px-4 py-4"
          >
            {messages.length === 1 ? (
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendQuestion(question)}
                    disabled={isLoading}
                    className="rounded-md border border-[#ead6e2] bg-white px-3 py-2 text-left text-xs font-medium leading-5 text-[#6f5368] transition hover:border-[#AF71A7] hover:bg-[#fff7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {question}
                  </button>
                ))}
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-lg px-3 py-2 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-[#AF71A7] text-white"
                      : "border border-[#f0dce8] bg-white text-[#382d36]"
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {renderLinkedText(message.content)}
                  </div>
                  {message.role === "assistant" && message.sources?.length ? (
                    <div className="mt-3 flex flex-col gap-2">
                      {message.sources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-[#e8cfe0] bg-[#fff7fb] px-3 py-2 text-center text-xs font-semibold text-[#8f4e85] transition hover:border-[#AF71A7] hover:bg-[#f7e8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7]"
                        >
                          <span>{source.label}</span>
                          <ExternalLink
                            className="h-3.5 w-3.5 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-lg border border-[#f0dce8] bg-white px-3 py-2 text-sm text-[#6f5368]">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Thinking
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[#f2dfea] bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question"
              className="h-10 min-w-0 flex-1 rounded-md border border-[#ead6e2] bg-white px-3 text-sm text-[#31222d] outline-none transition placeholder:text-[#a88fa0] focus:border-[#AF71A7] focus:ring-2 focus:ring-[#AF71A7]/20"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#AF71A7] text-white transition hover:bg-[#9d5f95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#AF71A7] text-white shadow-[0_12px_34px_rgba(175,113,167,0.42)] transition hover:scale-105 hover:bg-[#9d5f95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7] focus-visible:ring-offset-2 active:scale-95"
        aria-label={isOpen ? "Close Potent Assistant" : "Open Potent Assistant"}
      >
        {isOpen ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <MessageCircle size={25} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
