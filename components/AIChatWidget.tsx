"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  Loader2,
  RefreshCw,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_STORAGE_KEY = "william_dentist_chat_conversation_id";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: "welcome-msg",
  role: "assistant",
  content: "Hello! Welcome to William Dentist. I'm your AI concierge. How can I assist you with your dental care today?",
};

const QUICK_SUGGESTIONS = [
  "Do you offer Invisalign?",
  "Teeth whitening pricing",
  "Book an appointment",
  "What are your hours?",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Scroll to bottom when messages or loading state change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Load existing conversation on mount if available
  useEffect(() => {
    const initChat = async () => {
      try {
        const storedId = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (storedId) {
          setConversationId(storedId);
          const res = await fetch(`/api/ai/chat?conversationId=${encodeURIComponent(storedId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
              setMessages(data.messages);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to load existing chat session:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    initChat();
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessageId = crypto.randomUUID();
    const userMsg: Message = {
      id: userMessageId,
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: messageText,
          currentPage: pathname || (typeof window !== "undefined" ? window.location.pathname : "/"),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
        sessionStorage.setItem(SESSION_STORAGE_KEY, data.conversationId);
      }

      const assistantMsg: Message = {
        id: data.messageId || crypto.randomUUID(),
        role: "assistant",
        content: data.reply || data.answer || "Thank you! Let me know if you need anything else.",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I ran into a technical glitch. Please try again or call our clinic directly at +1 (555) 123-4567.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetConversation = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setConversationId(null);
    setMessages([DEFAULT_WELCOME_MESSAGE]);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-center gap-2 rounded-full p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-300",
          isOpen
            ? "bg-slate-900 hover:bg-slate-800"
            : "bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:to-teal-500"
        )}
        aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6" />
            <span className="hidden sm:inline-block font-medium text-sm pr-1">
              AI Chat
            </span>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-white"></span>
            </span>
          </>
        )}
      </button>

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[390px] h-[540px] max-h-[calc(100vh-7rem)] rounded-2xl border border-slate-200/90 bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-white shadow-inner">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm leading-none text-slate-100">
                    William Dentist AI
                  </h3>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300 border border-cyan-400/30">
                    <Sparkles className="h-2.5 w-2.5" /> Concierge
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Online • Instant Answers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetConversation}
                title="New Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 text-sm max-w-[86%]",
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {!isUser && (
                    <div className="h-7 w-7 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl shadow-xs whitespace-pre-wrap leading-relaxed",
                      isUser
                        ? "bg-cyan-600 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2 text-sm mr-auto max-w-[86%] items-center">
                <div className="h-7 w-7 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  className="whitespace-nowrap text-xs bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200/80 rounded-full px-3 py-1 font-medium transition-colors shadow-2xs flex-shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Dr. William's AI..."
              disabled={isLoading}
              className="flex-1 bg-slate-100/80 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white transition-all disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-700 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-cyan-600 flex-shrink-0 shadow-xs"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
