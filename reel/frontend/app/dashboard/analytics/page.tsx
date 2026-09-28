"use client";
import { useEffect, useState, useCallback } from "react";
import { analyticsApi } from "@/lib/api";

interface Analytics {
    total_reels: number;
    avg_engagement_rate: number;
    best_format: string | null;
    ideal_length: number | null;
    pattern_status: string;
    confidence: number;
    format_breakdown: { format: string; avg_engagement: number; reel_count: number }[];
    top_topic: string | null;
    recent_trend: string | null;
}

const FORMAT_COLORS = [
    "#6c47ff", "#00d4aa", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316",
];

const PATTERN_INFO: Record<string, { label: string; color: string; description: string }> = {
    pattern_detected: {
        label: "Pattern Detected",
        color: "var(--color-success)",
        description:
            "Your data shows a statistically significant pattern. One format consistently outperforms others — this is your edge.",
    },
    no_clear_pattern: {
        label: "No Clear Pattern Yet",
        color: "var(--color-warning)",
        description:
            "Formats are performing similarly. Keep experimenting with different formats and topics to find your winner.",
    },
    insufficient_data: {
        label: "Building Intelligence Base",
        color: "var(--color-text-muted)",
        description:
            "Add at least 3 more reels to unlock pattern detection. Every reel you log makes the AI smarter about your content.",
    },
};

const TREND_MAP: Record<string, { icon: string; color: string; label: string }> = {
    improving: { icon: "↑", color: "var(--color-success)", label: "Improving" },
    declining: { icon: "↓", color: "var(--color-danger)", label: "Declining" },
    stable: { icon: "→", color: "var(--color-warning)", label: "Stable" },
};

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await analyticsApi.get();
            setAnalytics(res.data);
        } catch {
            // handled by interceptor
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <>
                <div className="page-header">
                    <h1 className="page-header-title">Analytics Engine</h1>
                </div>
                <div className="page-body">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    const patternInfo =
        PATTERN_INFO[analytics?.pattern_status || "insufficient_data"];
    const trend = analytics?.recent_trend
        ? TREND_MAP[analytics.recent_trend]
        : null;

    const maxEngagement =
        analytics?.format_breakdown.reduce(
            (m, f) => Math.max(m, f.avg_engagement),
            0.001
        ) || 0.001;

    return (
        <>
            <div className="page-header">
                <h1 className="page-header-title">Analytics Engine</h1>
                <p className="page-header-subtitle">
                    Performance intelligence derived from your reel data
                </p>
            </div>

            <div className="page-body">
                {/* Pattern Status Banner */}
                <div
                    style={{
                        background: `linear-gradient(135deg, ${patternInfo.color}15, ${patternInfo.color}08)`,
                        border: `1px solid ${patternInfo.color}33`,
                        borderRadius: "var(--radius-lg)",
                        padding: "24px",
                        marginBottom: 24,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `${patternInfo.color}20`,
                            border: `1px solid ${patternInfo.color}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            flexShrink: 0,
                        }}
                    >
                        {analytics?.pattern_status === "pattern_detected"
                            ? "🎯"
                            : analytics?.pattern_status === "no_clear_pattern"
                                ? "🔬"
                                : "📊"}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: patternInfo.color,
                                }}
                            >
                                {patternInfo.label}
                            </div>
                            {analytics && analytics.confidence > 0 && (
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        padding: "2px 8px",
                                        borderRadius: 100,
                                        background: `${patternInfo.color}20`,
                                        color: patternInfo.color,
                                    }}
                                >
                                    {analytics.confidence}% confidence
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
                            {patternInfo.description}
                        </div>
                    </div>
                    {analytics && analytics.confidence > 0 && (
                        <div style={{ flexShrink: 0, minWidth: 120 }}>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--color-text-subtle)",
                                    marginBottom: 6,
                                    textAlign: "right",
                                }}
                            >
                                Pattern Strength
                            </div>
                            <div className="confidence-bar">
                                <div
                                    className="confidence-fill"
                                    style={{
                                        width: `${analytics.confidence}%`,
                                        background: `linear-gradient(90deg, ${patternInfo.color}, ${patternInfo.color}cc)`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    {/* Key Metrics */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Performance Summary</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                {
                                    label: "Total Reels Analyzed",
                                    value: analytics?.total_reels?.toString() || "0",
                                    color: "var(--color-primary-light)",
                                },
                                {
                                    label: "Average Engagement Rate",
                                    value: `${analytics?.avg_engagement_rate?.toFixed(2) || "0.00"}%`,
                                    color: "var(--color-accent)",
                                },
                                {
                                    label: "Best Performing Format",
                                    value: analytics?.best_format?.replace(/_/g, " ") || "—",
                                    color: "var(--color-warning)",
                                },
                                {
                                    label: "Ideal Reel Length",
                                    value: analytics?.ideal_length ? `${analytics.ideal_length}s` : "—",
                                    color: "var(--color-success)",
                                },
                                {
                                    label: "Top Topic Cluster",
                                    value: analytics?.top_topic || "—",
                                    color: "var(--color-text)",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 0",
                                        borderBottom: "1px solid var(--color-border)",
                                    }}
                                >
                                    <div
                                        style={{ fontSize: 13, color: "var(--color-text-muted)" }}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 700,
                                            color: item.color,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            ))}

                            {/* Trend */}
                            {trend && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 0",
                                    }}
                                >
                                    <div
                                        style={{ fontSize: 13, color: "var(--color-text-muted)" }}
                                    >
                                        Recent Trend (last 6 reels)
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: trend.color,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}
                                    >
                                        <span style={{ fontSize: 18 }}>{trend.icon}</span>
                                        {trend.label}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Format Breakdown */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Format Performance Ranking</div>
                            <div className="card-subtitle">
                                Sorted by avg. engagement rate
                            </div>
                        </div>

                        {analytics?.format_breakdown &&
                            analytics.format_breakdown.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {analytics.format_breakdown.map((f, i) => (
                                    <div key={f.format}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: 6,
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: FORMAT_COLORS[i % FORMAT_COLORS.length],
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        color: "var(--color-text)",
                                                        textTransform: "capitalize",
                                                        fontWeight: i === 0 ? 700 : 400,
                                                    }}
                                                >
                                                    {f.format.replace(/_/g, " ")}
                                                </span>
                                                {i === 0 && (
                                                    <span style={{ fontSize: 10, color: FORMAT_COLORS[0], fontWeight: 700 }}>
                                                        BEST
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 11, color: "var(--color-text-subtle)" }}>
                                                    {f.reel_count} reel{f.reel_count !== 1 ? "s" : ""}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: FORMAT_COLORS[i % FORMAT_COLORS.length],
                                                    }}
                                                >
                                                    {f.avg_engagement.toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="format-bar-track">
                                            <div
                                                className="format-bar-fill"
                                                style={{
                                                    width: `${(f.avg_engagement / maxEngagement) * 100}%`,
                                                    background: FORMAT_COLORS[i % FORMAT_COLORS.length],
                                                    opacity: i === 0 ? 1 : 0.6,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state" style={{ padding: 32 }}>
                                <div className="empty-state-icon">📊</div>
                                <div className="empty-state-title">No format data yet</div>
                                <div className="empty-state-text">
                                    Add reels to see which format works best for you
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Strategy Recommendations */}
                {analytics && analytics.pattern_status === "pattern_detected" && (
                    <div className="card card-accent">
                        <div className="card-header">
                            <div className="card-title">🎯 Data-Backed Strategy Recommendations</div>
                            <span className="badge badge-accent">AI Generated</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                            {[
                                {
                                    title: "Double Down on Best Format",
                                    text: `${analytics.best_format?.replace(/_/g, " ")} is outperforming your other formats. Make it 60-70% of your content mix.`,
                                    icon: "🏆",
                                },
                                {
                                    title: `Optimize to ${analytics.ideal_length}s`,
                                    text: `Your top-performing format thrives at ~${analytics.ideal_length}s. Trim or expand other reels to match this length.`,
                                    icon: "⏱️",
                                },
                                {
                                    title: "Revisit Top Topics",
                                    text: analytics.top_topic
                                        ? `"${analytics.top_topic}" is your most-used topic cluster. Explore adjacent angles and subtopics.`
                                        : "Cluster your topics to find which themes your audience responds to most.",
                                    icon: "💡",
                                },
                            ].map((rec) => (
                                <div
                                    key={rec.title}
                                    style={{
                                        padding: 16,
                                        background: "var(--color-surface-2)",
                                        borderRadius: "var(--radius-md)",
                                        border: "1px solid var(--color-border)",
                                    }}
                                >
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{rec.icon}</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", marginBottom: 6 }}>
                                        {rec.title}
                                    </div>
                                    <div style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                                        {rec.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
