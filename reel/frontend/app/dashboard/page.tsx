"use client";
import { useEffect, useState, useCallback } from "react";
import { analyticsApi, reelsApi, scriptsApi } from "@/lib/api";
import Link from "next/link";

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

interface Reel {
    id: string;
    topic: string;
    format: string;
    views: number;
    engagement_rate: number;
    created_at: string;
}

const FORMAT_COLORS = [
    "#6c47ff", "#00d4aa", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
];

const TREND_ICON: Record<string, string> = {
    improving: "↑",
    declining: "↓",
    stable: "→",
};

const PATTERN_LABELS: Record<string, string> = {
    pattern_detected: "Pattern Detected",
    no_clear_pattern: "No Clear Pattern",
    insufficient_data: "Building Data",
};

export default function DashboardPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [reels, setReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [analyticsRes, reelsRes] = await Promise.all([
                analyticsApi.get(),
                reelsApi.list(5),
            ]);
            setAnalytics(analyticsRes.data);
            setReels(reelsRes.data);
        } catch {
            // handled by interceptor
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const maxEngagement =
        analytics?.format_breakdown.reduce(
            (m, f) => Math.max(m, f.avg_engagement),
            0
        ) || 1;

    return (
        <>
            <div className="page-header">
                <h1 className="page-header-title">Growth Dashboard</h1>
                <p className="page-header-subtitle">
                    Your performance intelligence overview
                </p>
            </div>

            <div className="page-body">
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="stat-grid" style={{ marginBottom: 24 }}>
                            <div className="stat-card">
                                <div className="stat-label">Total Reels</div>
                                <div className="stat-value primary">{analytics?.total_reels || 0}</div>
                                <div className="stat-change">
                                    {analytics?.total_reels === 0
                                        ? "Add your first reel →"
                                        : `Last analyzed`}
                                </div>
                                <div className="stat-icon" style={{ background: "rgba(108, 71, 255, 0.15)" }}>
                                    ⊡
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-label">Avg Engagement</div>
                                <div className="stat-value accent">
                                    {analytics?.avg_engagement_rate?.toFixed(2) || "0.00"}%
                                </div>
                                <div className={`stat-change ${analytics?.recent_trend === "improving" ? "up" : analytics?.recent_trend === "declining" ? "down" : ""}`}>
                                    {analytics?.recent_trend
                                        ? `${TREND_ICON[analytics.recent_trend] || ""} ${analytics.recent_trend}`
                                        : "No trend data yet"}
                                </div>
                                <div className="stat-icon" style={{ background: "rgba(0, 212, 170, 0.12)" }}>
                                    ⌖
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-label">Best Format</div>
                                <div
                                    className="stat-value"
                                    style={{
                                        fontSize: analytics?.best_format ? 18 : 14,
                                        color: "var(--color-warning)",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {analytics?.best_format?.replace(/_/g, " ") || "—"}
                                </div>
                                <div className="stat-change">
                                    {analytics?.confidence && analytics.confidence > 0
                                        ? `${analytics.confidence}% confidence`
                                        : "Keep adding reels"}
                                </div>
                                <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.12)" }}>
                                    ✦
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-label">Ideal Length</div>
                                <div className="stat-value success">
                                    {analytics?.ideal_length ? `${analytics.ideal_length}s` : "—"}
                                </div>
                                <div className="stat-change">
                                    Based on top format
                                </div>
                                <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                                    ◎
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            {/* Pattern Status + Format Breakdown */}
                            <div className="card">
                                <div className="card-header">
                                    <div>
                                        <div className="card-title">Growth Pattern</div>
                                        <div className="card-subtitle">AI pattern classification</div>
                                    </div>
                                    <div className={`pattern-badge ${analytics?.pattern_status || "insufficient_data"}`}>
                                        <span>●</span>
                                        {PATTERN_LABELS[analytics?.pattern_status || "insufficient_data"]}
                                    </div>
                                </div>

                                {/* Confidence */}
                                {analytics && analytics.confidence > 0 && (
                                    <div style={{ marginBottom: 20 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 12,
                                                color: "var(--color-text-muted)",
                                                marginBottom: 6,
                                            }}
                                        >
                                            <span>Pattern Confidence</span>
                                            <span style={{ fontWeight: 700, color: "var(--color-primary-light)" }}>
                                                {analytics.confidence}%
                                            </span>
                                        </div>
                                        <div className="confidence-bar">
                                            <div
                                                className="confidence-fill"
                                                style={{ width: `${analytics.confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Format bars */}
                                {analytics?.format_breakdown &&
                                    analytics.format_breakdown.length > 0 ? (
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: "var(--color-text-subtle)",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                marginBottom: 12,
                                            }}
                                        >
                                            Format Performance
                                        </div>
                                        {analytics.format_breakdown.map((f, i) => (
                                            <div key={f.format} className="format-bar-item">
                                                <div className="format-bar-label" style={{ fontSize: 12 }}>
                                                    {f.format.replace(/_/g, " ")}
                                                </div>
                                                <div className="format-bar-track">
                                                    <div
                                                        className="format-bar-fill"
                                                        style={{
                                                            width: `${(f.avg_engagement / maxEngagement) * 100}%`,
                                                            background: FORMAT_COLORS[i % FORMAT_COLORS.length],
                                                        }}
                                                    />
                                                </div>
                                                <div className="format-bar-value">
                                                    {f.avg_engagement.toFixed(2)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state" style={{ padding: 24 }}>
                                        <div className="empty-state-icon">📊</div>
                                        <div className="empty-state-title">No format data yet</div>
                                        <div className="empty-state-text">
                                            Add reels to see performance by format
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recent Reels */}
                            <div className="card">
                                <div className="card-header">
                                    <div>
                                        <div className="card-title">Recent Reels</div>
                                        <div className="card-subtitle">Last 5 entries</div>
                                    </div>
                                    <Link href="/dashboard/reels" className="btn btn-ghost btn-sm">
                                        View all →
                                    </Link>
                                </div>

                                {reels.length > 0 ? (
                                    <div>
                                        {reels.map((reel) => (
                                            <div
                                                key={reel.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    padding: "10px 0",
                                                    borderBottom: "1px solid var(--color-border)",
                                                }}
                                            >
                                                <div style={{ minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            color: "var(--color-text)",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {reel.topic}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 12,
                                                            color: "var(--color-text-muted)",
                                                            textTransform: "capitalize",
                                                            marginTop: 2,
                                                        }}
                                                    >
                                                        {reel.format.replace(/_/g, " ")} ·{" "}
                                                        {reel.views.toLocaleString()} views
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color:
                                                            reel.engagement_rate > 5
                                                                ? "var(--color-success)"
                                                                : reel.engagement_rate > 2
                                                                    ? "var(--color-warning)"
                                                                    : "var(--color-text-muted)",
                                                        flexShrink: 0,
                                                        marginLeft: 12,
                                                    }}
                                                >
                                                    {reel.engagement_rate.toFixed(2)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state" style={{ padding: 24 }}>
                                        <div className="empty-state-icon">📹</div>
                                        <div className="empty-state-title">No reels yet</div>
                                        <div className="empty-state-text">
                                            Log your first reel to start tracking performance
                                        </div>
                                        <Link
                                            href="/dashboard/reels"
                                            className="btn btn-primary btn-sm"
                                            style={{ marginTop: 12 }}
                                        >
                                            Add Reel →
                                        </Link>
                                    </div>
                                )}

                                {/* Quick Generate */}
                                {reels.length > 0 && (
                                    <div style={{ marginTop: 16 }}>
                                        <Link
                                            href="/dashboard/generate"
                                            id="quick-generate-btn"
                                            className="btn btn-primary btn-full"
                                        >
                                            ✦ Generate Optimized Script
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Insight Banner */}
                        {analytics &&
                            analytics.pattern_status === "insufficient_data" && (
                                <div
                                    style={{
                                        marginTop: 20,
                                        padding: "16px 24px",
                                        background:
                                            "linear-gradient(135deg, rgba(108,71,255,0.1), rgba(0,212,170,0.08))",
                                        border: "1px solid rgba(108, 71, 255, 0.25)",
                                        borderRadius: "var(--radius-md)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                    }}
                                >
                                    <div style={{ fontSize: 24 }}>💡</div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: "var(--color-primary-light)",
                                                marginBottom: 4,
                                            }}
                                        >
                                            Build Your Intelligence Base
                                        </div>
                                        <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                                            Add at least 3 reels to unlock pattern detection and
                                            get AI recommendations based on YOUR data — not generic
                                            advice.
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard/reels"
                                        className="btn btn-primary btn-sm"
                                        style={{ flexShrink: 0 }}
                                    >
                                        Add Reels
                                    </Link>
                                </div>
                            )}
                    </>
                )}
            </div>
        </>
    );
}
