"use client";
import { useState, useRef, useEffect } from "react";
import { chatApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const SUGGESTED_QUESTIONS = [
    "What should I post next based on my data?",
    "Why might my reels be underperforming?",
    "How can I improve my hook strategy?",
    "What's the ideal posting frequency for growth?",
    "How do I find my best topic niche?",
    "Suggest experiments to boost engagement",
];

function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "user";

    // Format assistant messages with basic markdown-like rendering
    const formatContent = (text: string) => {
        return text.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
                return (
                    <div key={i} style={{ fontWeight: 700, marginTop: i > 0 ? 8 : 0, color: "var(--color-text)" }}>
                        {line.slice(2, -2)}
                    </div>
                );
            }
            if (line.startsWith("• ") || line.startsWith("- ")) {
                return (
                    <div key={i} style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <span style={{ color: "var(--color-primary-light)", flexShrink: 0 }}>•</span>
                        <span>{line.slice(2)}</span>
                    </div>
                );
            }
            if (line === "") return <div key={i} style={{ height: 6 }} />;
            return <div key={i}>{line}</div>;
        });
    };

    return (
        <div className={`chat-message ${isUser ? "user" : ""}`}>
            <div className={`chat-avatar ${isUser ? "user" : "ai"}`}>
                {isUser ? "U" : "AI"}
            </div>
            <div className={`chat-bubble ${isUser ? "user" : "ai"}`}>
                {isUser ? message.content : formatContent(message.content)}
            </div>
        </div>
    );
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;

        const userMessage: Message = { role: "user", content: msg };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await chatApi.send(msg, messages);
            const assistantMessage: Message = {
                role: "assistant",
                content: res.data.reply,
            };
            setMessages([...newMessages, assistantMessage]);
        } catch {
            toast.error("Failed to get response. Check your API configuration.");
            setMessages(messages); // Revert
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearHistory = () => {
        setMessages([]);
        toast.success("Conversation cleared");
    };

    return (
        <>
            <div className="page-header">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h1 className="page-header-title">Growth Assistant</h1>
                        <p className="page-header-subtitle">
                            Context-aware AI assistant — your analytics are always injected
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 12px",
                                background: "rgba(16, 185, 129, 0.12)",
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                borderRadius: 100,
                                fontSize: 12,
                                color: "var(--color-success)",
                                fontWeight: 600,
                            }}
                        >
                            <div
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "var(--color-success)",
                                    animation: "pulse 2s infinite",
                                }}
                            />
                            Analytics Injected
                        </div>
                        {messages.length > 0 && (
                            <button
                                id="clear-chat-btn"
                                className="btn btn-ghost btn-sm"
                                onClick={clearHistory}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ height: "calc(100vh - 90px)", display: "flex", flexDirection: "column" }}>
                {/* Messages Area */}
                <div
                    id="chat-messages"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "24px 40px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    {messages.length === 0 ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            {/* Welcome */}
                            <div
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 28,
                                    marginBottom: 20,
                                    boxShadow: "var(--shadow-primary)",
                                }}
                            >
                                AI
                            </div>
                            <h2
                                style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: "var(--color-text)",
                                    marginBottom: 8,
                                    textAlign: "center",
                                }}
                            >
                                Your Data-Driven Growth Assistant
                            </h2>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: "var(--color-text-muted)",
                                    textAlign: "center",
                                    maxWidth: 440,
                                    marginBottom: 32,
                                    lineHeight: 1.6,
                                }}
                            >
                                Ask me anything about your content strategy. I have access to your reel analytics and give recommendations based on YOUR data — not generic advice.
                            </p>

                            {/* Suggested Questions */}
                            <div style={{ width: "100%", maxWidth: 600 }}>
                                <div
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: "var(--color-text-subtle)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        marginBottom: 12,
                                        textAlign: "center",
                                    }}
                                >
                                    Try asking
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 8,
                                    }}
                                >
                                    {SUGGESTED_QUESTIONS.map((q, i) => (
                                        <button
                                            key={i}
                                            id={`suggested-${i}`}
                                            onClick={() => sendMessage(q)}
                                            style={{
                                                padding: "10px 14px",
                                                background: "var(--color-surface)",
                                                border: "1px solid var(--color-border)",
                                                borderRadius: "var(--radius-sm)",
                                                color: "var(--color-text-muted)",
                                                fontSize: 13,
                                                cursor: "pointer",
                                                textAlign: "left",
                                                transition: "var(--transition)",
                                                fontFamily: "inherit",
                                                lineHeight: 1.4,
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.target as HTMLButtonElement).style.borderColor =
                                                    "var(--color-primary)";
                                                (e.target as HTMLButtonElement).style.color =
                                                    "var(--color-text)";
                                                (e.target as HTMLButtonElement).style.background =
                                                    "var(--color-primary-glow)";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.target as HTMLButtonElement).style.borderColor =
                                                    "var(--color-border)";
                                                (e.target as HTMLButtonElement).style.color =
                                                    "var(--color-text-muted)";
                                                (e.target as HTMLButtonElement).style.background =
                                                    "var(--color-surface)";
                                            }}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => (
                                <MessageBubble key={i} message={msg} />
                            ))}
                            {loading && (
                                <div className="chat-message">
                                    <div className="chat-avatar ai">AI</div>
                                    <div className="chat-bubble ai">
                                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: "50%",
                                                        background: "var(--color-primary-light)",
                                                        animation: `pulse 1.2s ${i * 0.2}s infinite`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div
                    style={{
                        padding: "16px 40px",
                        borderTop: "1px solid var(--color-border)",
                        background: "var(--color-surface)",
                    }}
                >
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                        <textarea
                            ref={inputRef}
                            id="chat-input"
                            className="chat-input"
                            placeholder="Ask about your strategy, hooks, why a reel flopped, what to post next..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            style={{
                                resize: "none",
                                overflow: "hidden",
                                minHeight: 44,
                            }}
                            onInput={(e) => {
                                const el = e.target as HTMLTextAreaElement;
                                el.style.height = "auto";
                                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                            }}
                        />
                        <button
                            id="send-message-btn"
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            className="btn btn-primary"
                            style={{ height: 44, flexShrink: 0 }}
                        >
                            {loading ? (
                                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: "white" }} />
                            ) : (
                                "Send ↑"
                            )}
                        </button>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-subtle)", marginTop: 8 }}>
                        Press Enter to send · Shift+Enter for new line · Your analytics are always in context
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </>
    );
}
