"use client";
import { useEffect, useState, useCallback } from "react";
import { reelsApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Reel {
    id: string;
    topic: string;
    format: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    length: number;
    engagement_rate: number;
    created_at: string;
}

const FORMATS = [
    { value: "talking_head", label: "Talking Head" },
    { value: "voiceover", label: "Voiceover + B-roll" },
    { value: "text_overlay", label: "Text Overlay" },
    { value: "trending_audio", label: "Trending Audio" },
    { value: "tutorial", label: "Tutorial / How-to" },
    { value: "day_in_life", label: "Day in the Life" },
    { value: "listicle", label: "Listicle" },
    { value: "reaction", label: "Reaction" },
    { value: "storytime", label: "Storytime" },
    { value: "other", label: "Other" },
];

const DEFAULT_FORM = {
    topic: "",
    format: "talking_head",
    views: "",
    likes: "",
    comments: "",
    shares: "",
    length: "",
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function EngagementBadge({ rate }: { rate: number }) {
    const color =
        rate > 8
            ? "var(--color-success)"
            : rate > 4
                ? "var(--color-accent)"
                : rate > 2
                    ? "var(--color-warning)"
                    : "var(--color-danger)";
    const label =
        rate > 8 ? "Viral" : rate > 4 ? "Strong" : rate > 2 ? "Average" : "Weak";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                borderRadius: 100,
                background: `${color}22`,
                color,
                border: `1px solid ${color}44`,
                fontSize: 11,
                fontWeight: 700,
            }}
        >
            {rate.toFixed(2)}% · {label}
        </span>
    );
}

export default function ReelsPage() {
    const [reels, setReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchReels = useCallback(async () => {
        setLoading(true);
        try {
            const res = await reelsApi.list(50);
            setReels(res.data);
        } catch {
            toast.error("Failed to load reels");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReels();
    }, [fetchReels]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { topic, format, views, likes, comments, shares, length } = form;
        if (!topic || !format || !views || !length) {
            return toast.error("Topic, format, views, and length are required");
        }

        setSubmitting(true);
        try {
            await reelsApi.create({
                topic,
                format,
                views: parseInt(views),
                likes: parseInt(likes) || 0,
                comments: parseInt(comments) || 0,
                shares: parseInt(shares) || 0,
                length: parseInt(length),
            });
            toast.success("Reel logged successfully!");
            setForm(DEFAULT_FORM);
            setShowForm(false);
            fetchReels();
        } catch {
            toast.error("Failed to save reel");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await reelsApi.delete(id);
            toast.success("Reel deleted");
            setReels((prev) => prev.filter((r) => r.id !== id));
        } catch {
            toast.error("Failed to delete");
        } finally {
            setDeletingId(null);
        }
    };

    const update = (field: string, val: string) =>
        setForm((prev) => ({ ...prev, [field]: val }));

    return (
        <>
            <div className="page-header">
                <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                    <div>
                        <h1 className="page-header-title">My Reels</h1>
                        <p className="page-header-subtitle">
                            {reels.length} reel{reels.length !== 1 ? "s" : ""} tracked ·
                            Log your metrics to build your intelligence base
                        </p>
                    </div>
                    <button
                        id="add-reel-btn"
                        className="btn btn-primary"
                        onClick={() => setShowForm((s) => !s)}
                    >
                        {showForm ? "✕ Cancel" : "+ Log Reel"}
                    </button>
                </div>
            </div>

            <div className="page-body">
                {/* Add Reel Form */}
                {showForm && (
                    <div
                        className="card card-glow"
                        style={{ marginBottom: 24, animation: "messageIn 0.2s ease-out" }}
                    >
                        <div className="card-header">
                            <div>
                                <div className="card-title">Log a New Reel</div>
                                <div className="card-subtitle">
                                    Engagement rate is auto-calculated
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-grid" style={{ marginBottom: 12 }}>
                                <div className="form-group" style={{ gridColumn: "1 / -1", marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="reel-topic">Topic / Hook</label>
                                    <input
                                        id="reel-topic"
                                        className="form-input"
                                        placeholder="e.g. 3 mindset shifts that changed my business"
                                        value={form.topic}
                                        onChange={(e) => update("topic", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-grid" style={{ marginBottom: 12 }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="reel-format">Format</label>
                                    <select
                                        id="reel-format"
                                        className="form-select"
                                        value={form.format}
                                        onChange={(e) => update("format", e.target.value)}
                                    >
                                        {FORMATS.map((f) => (
                                            <option key={f.value} value={f.value}>
                                                {f.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="reel-length">Length (seconds)</label>
                                    <input
                                        id="reel-length"
                                        type="number"
                                        className="form-input"
                                        placeholder="e.g. 30"
                                        value={form.length}
                                        onChange={(e) => update("length", e.target.value)}
                                        min={1}
                                        max={600}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", marginBottom: 16 }}>
                                {(["views", "likes", "comments", "shares"] as const).map((field) => (
                                    <div key={field} className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" htmlFor={`reel-${field}`}>
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                            {field === "views" && " *"}
                                        </label>
                                        <input
                                            id={`reel-${field}`}
                                            type="number"
                                            className="form-input"
                                            placeholder="0"
                                            value={form[field]}
                                            onChange={(e) => update(field, e.target.value)}
                                            min={0}
                                            required={field === "views"}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Live engagement preview */}
                            {form.views && parseInt(form.views) > 0 && (
                                <div
                                    style={{
                                        padding: 12,
                                        background: "var(--color-surface-2)",
                                        borderRadius: "var(--radius-sm)",
                                        border: "1px solid var(--color-border)",
                                        marginBottom: 16,
                                        fontSize: 13,
                                        color: "var(--color-text-muted)",
                                    }}
                                >
                                    Estimated engagement rate:{" "}
                                    <strong style={{ color: "var(--color-accent)" }}>
                                        {(
                                            ((parseInt(form.likes || "0") +
                                                parseInt(form.comments || "0") +
                                                parseInt(form.shares || "0")) /
                                                parseInt(form.views)) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </strong>
                                </div>
                            )}

                            <button
                                id="submit-reel-btn"
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <div className="spinner" style={{ width: 14, height: 14, borderTopColor: "white" }} />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Reel →"
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Reels Table */}
                <div className="card">
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: 52 }} />
                            ))}
                        </div>
                    ) : reels.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📹</div>
                            <div className="empty-state-title">No reels logged yet</div>
                            <div className="empty-state-text">
                                Add at least 3 reels to unlock AI pattern detection
                            </div>
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ marginTop: 12 }}
                                onClick={() => setShowForm(true)}
                            >
                                Log Your First Reel →
                            </button>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Topic</th>
                                    <th>Format</th>
                                    <th>Views</th>
                                    <th>Engagement</th>
                                    <th>Length</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {reels.map((reel) => (
                                    <tr key={reel.id}>
                                        <td style={{ fontWeight: 600, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {reel.topic}
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    color: "var(--color-text-muted)",
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {reel.format.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                                            {reel.views.toLocaleString()}
                                        </td>
                                        <td>
                                            <EngagementBadge rate={reel.engagement_rate} />
                                        </td>
                                        <td style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                                            {reel.length}s
                                        </td>
                                        <td style={{ fontSize: 12, color: "var(--color-text-subtle)" }}>
                                            {formatDate(reel.created_at)}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(reel.id)}
                                                className="btn btn-danger btn-sm"
                                                disabled={deletingId === reel.id}
                                            >
                                                {deletingId === reel.id ? "..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
