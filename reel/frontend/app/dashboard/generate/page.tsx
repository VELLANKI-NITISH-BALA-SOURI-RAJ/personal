"use client";
import { useState } from "react";
import { scriptsApi } from "@/lib/api";
import toast from "react-hot-toast";

const FORMATS = [
    { value: "", label: "Auto-detect from analytics" },
    { value: "talking_head", label: "Talking Head" },
    { value: "voiceover", label: "Voiceover + B-roll" },
    { value: "text_overlay", label: "Text Overlay" },
    { value: "trending_audio", label: "Trending Audio" },
    { value: "tutorial", label: "Tutorial / How-to" },
    { value: "day_in_life", label: "Day in the Life" },
    { value: "listicle", label: "Listicle" },
    { value: "storytime", label: "Storytime" },
];

const HOOK_TYPE_COLORS: Record<string, string> = {
    curiosity: "#6c47ff",
    contrast: "#00d4aa",
    pain_point: "#ef4444",
    bold_claim: "#f59e0b",
    social_proof: "#8b5cf6",
};

interface Hook {
    hook_text: string;
    hook_type: string;
    why_it_works: string;
}

interface ScriptSection {
    label: string;
    content: string;
}

interface ScriptResult {
    hooks?: Hook[];
    script?: {
        format?: string;
        estimated_length_seconds?: number;
        sections?: ScriptSection[];
        full_script?: string;
    };
    cta?: {
        primary_cta?: string;
        engagement_trigger?: string;
        save_hook?: string;
    };
    execution_notes?: {
        opening_visual?: string;
        pacing_recommendation?: string;
        audio_strategy?: string;
        text_overlay_tips?: string;
    };
    retention_strategy?: {
        pattern_interrupt_at?: string;
        loop_mechanism?: string;
        rewatch_trigger?: string;
    };
    performance_prediction?: {
        confidence_based_on?: string;
        expected_engagement_vs_your_avg?: string;
        key_risk?: string;
    };
}

function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
}

export default function GeneratePage() {
    const [topic, setTopic] = useState("");
    const [format, setFormat] = useState("");
    const [targetLength, setTargetLength] = useState("");
    const [additionalContext, setAdditionalContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScriptResult | null>(null);
    const [selectedHook, setSelectedHook] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<"hooks" | "script" | "strategy" | "execution">("hooks");

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return toast.error("Please enter a topic");

        setLoading(true);
        setResult(null);
        try {
            const res = await scriptsApi.generate({
                topic,
                format: format || undefined,
                target_length: targetLength ? parseInt(targetLength) : undefined,
                additional_context: additionalContext || undefined,
            });
            setResult(res.data.script_json);
            setActiveTab("hooks");
            setSelectedHook(0);
            toast.success("Script generated!");
        } catch {
            toast.error("Generation failed. Check your API key and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-header-title">Generate Script</h1>
                <p className="page-header-subtitle">
                    Performance-informed script generation — powered by YOUR analytics
                </p>
            </div>

            <div className="page-body">
                <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>
                    {/* Input Panel */}
                    <div className="card card-glow" style={{ position: "sticky", top: 88 }}>
                        <div className="card-header">
                            <div className="card-title">✦ Script Generator</div>
                            <span className="badge badge-primary">AI</span>
                        </div>

                        {/* Analytics context note */}
                        <div style={{
                            padding: "10px 14px",
                            background: "rgba(0, 212, 170, 0.08)",
                            border: "1px solid rgba(0, 212, 170, 0.2)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: 12,
                            color: "var(--color-accent)",
                            marginBottom: 20,
                            lineHeight: 1.5,
                        }}>
                            🧠 Your reel analytics are automatically injected into every generation. The AI knows your best formats, ideal length, and engagement patterns.
                        </div>

                        <form onSubmit={handleGenerate}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="script-topic">Topic *</label>
                                <input
                                    id="script-topic"
                                    className="form-input"
                                    placeholder="e.g. 5 habits that doubled my productivity"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    required
                                />
                                <div className="form-hint">
                                    Be specific — better input = better output
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="script-format">Override Format</label>
                                <select
                                    id="script-format"
                                    className="form-select"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    {FORMATS.map((f) => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="script-length">Override Length (seconds)</label>
                                <input
                                    id="script-length"
                                    type="number"
                                    className="form-input"
                                    placeholder="Leave blank to use your analytics ideal"
                                    value={targetLength}
                                    onChange={(e) => setTargetLength(e.target.value)}
                                    min={5}
                                    max={600}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="script-context">Additional Context</label>
                                <textarea
                                    id="script-context"
                                    className="form-textarea"
                                    placeholder="e.g. My audience is early-stage founders. Keep it tactical, no fluff."
                                    value={additionalContext}
                                    onChange={(e) => setAdditionalContext(e.target.value)}
                                    style={{ minHeight: 80 }}
                                />
                            </div>

                            <button
                                id="generate-script-btn"
                                type="submit"
                                className="btn btn-primary btn-full btn-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: 16, height: 16, borderTopColor: "white" }} />
                                        Analyzing & Generating...
                                    </>
                                ) : (
                                    "✦ Generate Optimized Script"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Output Panel */}
                    <div>
                        {!result && !loading && (
                            <div
                                style={{
                                    border: "2px dashed var(--color-border)",
                                    borderRadius: "var(--radius-xl)",
                                    padding: "80px 40px",
                                    textAlign: "center",
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>✦</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)", marginBottom: 8 }}>
                                    Your script will appear here
                                </div>
                                <div style={{ fontSize: 14 }}>
                                    Enter a topic and click generate. The AI uses your reel analytics to create data-informed hooks, scripts, and strategy notes.
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div
                                style={{
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-xl)",
                                    padding: "80px 40px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    className="spinner"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        margin: "0 auto 24px",
                                        borderWidth: 3,
                                        borderTopColor: "var(--color-primary)",
                                    }}
                                />
                                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", marginBottom: 8 }}>
                                    Analyzing your performance data...
                                </div>
                                <div style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
                                    Injecting your analytics • Calibrating format • Writing hooks
                                </div>
                            </div>
                        )}

                        {result && (
                            <div style={{ animation: "messageIn 0.3s ease-out" }}>
                                {/* Tabs */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 4,
                                        marginBottom: 20,
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--radius-md)",
                                        padding: 4,
                                    }}
                                >
                                    {(["hooks", "script", "strategy", "execution"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            id={`tab-${tab}`}
                                            onClick={() => setActiveTab(tab)}
                                            className="btn"
                                            style={{
                                                flex: 1,
                                                background:
                                                    activeTab === tab
                                                        ? "var(--color-primary)"
                                                        : "transparent",
                                                color:
                                                    activeTab === tab
                                                        ? "white"
                                                        : "var(--color-text-muted)",
                                                padding: "8px 12px",
                                                fontSize: 13,
                                                textTransform: "capitalize",
                                                boxShadow: activeTab === tab ? "0 2px 8px rgba(108,71,255,0.4)" : "none",
                                            }}
                                        >
                                            {tab === "hooks"
                                                ? "🎣 Hooks"
                                                : tab === "script"
                                                    ? "📝 Script"
                                                    : tab === "strategy"
                                                        ? "🎯 Strategy"
                                                        : "⚡ Execution"}
                                        </button>
                                    ))}
                                </div>

                                {/* Hooks Tab */}
                                {activeTab === "hooks" && result.hooks && (
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                                                3 hooks generated — click to select, then copy
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            {result.hooks.map((hook, i) => (
                                                <div
                                                    key={i}
                                                    id={`hook-${i}`}
                                                    className={`script-hook-card ${selectedHook === i ? "selected" : ""}`}
                                                    onClick={() => setSelectedHook(i)}
                                                >
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                        <div
                                                            className="hook-type-badge"
                                                            style={{
                                                                background: `${HOOK_TYPE_COLORS[hook.hook_type] || "#6c47ff"}22`,
                                                                color: HOOK_TYPE_COLORS[hook.hook_type] || "#6c47ff",
                                                                border: `1px solid ${HOOK_TYPE_COLORS[hook.hook_type] || "#6c47ff"}44`,
                                                            }}
                                                        >
                                                            Hook {i + 1} · {hook.hook_type}
                                                        </div>
                                                        <button
                                                            className="copy-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyText(hook.hook_text);
                                                            }}
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                    <div className="hook-text">{hook.hook_text}</div>
                                                    <div className="hook-why">💡 {hook.why_it_works}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Script Tab */}
                                {activeTab === "script" && result.script && (
                                    <div className="card">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: "var(--color-text)" }}>
                                                    Full Script
                                                </div>
                                                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                                                    {result.script.format?.replace(/_/g, " ")} ·{" "}
                                                    ~{result.script.estimated_length_seconds}s
                                                </div>
                                            </div>
                                            <button
                                                className="copy-btn"
                                                onClick={() =>
                                                    copyText(result.script!.full_script || "")
                                                }
                                                style={{ padding: "6px 14px" }}
                                            >
                                                Copy Full Script
                                            </button>
                                        </div>

                                        {result.script.sections?.map((section) => (
                                            <div key={section.label} className="script-section">
                                                <div className="script-section-label">{section.label}</div>
                                                <div className="script-section-content">
                                                    {section.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* CTA + Strategy Tab */}
                                {activeTab === "strategy" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {/* CTA */}
                                        {result.cta && (
                                            <div className="card">
                                                <div className="card-title" style={{ marginBottom: 14 }}>
                                                    🎬 Call-to-Action
                                                </div>
                                                {Object.entries(result.cta).map(([key, val]) => (
                                                    <div
                                                        key={key}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "flex-start",
                                                            gap: 12,
                                                            padding: "10px 0",
                                                            borderBottom: "1px solid var(--color-border)",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "var(--color-text-muted)",
                                                                textTransform: "capitalize",
                                                                minWidth: 120,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {key.replace(/_/g, " ")}
                                                        </div>
                                                        <div style={{ fontSize: 13, color: "var(--color-text)", flex: 1 }}>
                                                            {val as string}
                                                        </div>
                                                        <button
                                                            className="copy-btn"
                                                            onClick={() => copyText(val as string)}
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Retention */}
                                        {result.retention_strategy && (
                                            <div className="card">
                                                <div className="card-title" style={{ marginBottom: 14 }}>
                                                    🔄 Retention Strategy
                                                </div>
                                                {Object.entries(result.retention_strategy).map(([key, val]) => (
                                                    <div
                                                        key={key}
                                                        style={{
                                                            marginBottom: 12,
                                                            padding: "12px 16px",
                                                            background: "var(--color-surface-2)",
                                                            borderRadius: "var(--radius-sm)",
                                                            borderLeft: "3px solid var(--color-accent)",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                color: "var(--color-accent)",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.08em",
                                                                marginBottom: 4,
                                                            }}
                                                        >
                                                            {key.replace(/_/g, " ")}
                                                        </div>
                                                        <div style={{ fontSize: 13, color: "var(--color-text)" }}>
                                                            {val as string}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Performance Prediction */}
                                        {result.performance_prediction && (
                                            <div
                                                className="card"
                                                style={{
                                                    background: "rgba(108, 71, 255, 0.06)",
                                                    borderColor: "rgba(108, 71, 255, 0.2)",
                                                }}
                                            >
                                                <div className="card-title" style={{ marginBottom: 14 }}>
                                                    📈 Performance Prediction
                                                </div>
                                                {Object.entries(result.performance_prediction).map(([key, val]) => (
                                                    <div
                                                        key={key}
                                                        style={{
                                                            display: "flex",
                                                            gap: 12,
                                                            marginBottom: 10,
                                                            alignItems: "flex-start",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                color: "var(--color-primary-light)",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.06em",
                                                                minWidth: 140,
                                                                paddingTop: 1,
                                                            }}
                                                        >
                                                            {key.replace(/_/g, " ")}
                                                        </div>
                                                        <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                                                            {val as string}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Execution Notes Tab */}
                                {activeTab === "execution" && result.execution_notes && (
                                    <div className="card">
                                        <div className="card-title" style={{ marginBottom: 16 }}>
                                            ⚡ Execution Notes
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                            {Object.entries(result.execution_notes).map(([key, val]) => (
                                                <div
                                                    key={key}
                                                    style={{
                                                        padding: 16,
                                                        background: "var(--color-surface-2)",
                                                        borderRadius: "var(--radius-md)",
                                                        border: "1px solid var(--color-border)",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            color: "var(--color-primary-light)",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.08em",
                                                            marginBottom: 6,
                                                        }}
                                                    >
                                                        {key.replace(/_/g, " ")}
                                                    </div>
                                                    <div style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.6 }}>
                                                        {val as string}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
