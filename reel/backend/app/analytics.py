from typing import Optional
from statistics import mean
from collections import Counter


def compute_engagement_rate(views: int, likes: int, comments: int, shares: int) -> float:
    """Engagement rate as % of total interactions relative to views."""
    if views == 0:
        return 0.0
    total_interactions = likes + comments + shares
    return round((total_interactions / views) * 100, 4)


def _classify_length(avg_length: float) -> int:
    """Return nearest rounded ideal length in seconds."""
    return round(avg_length / 5) * 5  # round to nearest 5s


def analyze_performance(reels: list[dict]) -> dict:
    """
    Core analytics engine. Ingests list of reel dicts and returns structured
    analytics object with pattern classification and confidence.
    """
    MIN_REELS = 3
    PATTERN_VARIANCE_THRESHOLD = 1.0  # % engagement rate

    if len(reels) < MIN_REELS:
        return {
            "total_reels": len(reels),
            "avg_engagement_rate": _safe_mean([r["engagement_rate"] for r in reels]),
            "best_format": None,
            "ideal_length": None,
            "pattern_status": "insufficient_data",
            "confidence": 0.0,
            "format_breakdown": [],
            "top_topic": None,
            "recent_trend": None,
        }

    # Group by format
    format_groups: dict[str, list[float]] = {}
    format_lengths: dict[str, list[int]] = {}
    for r in reels:
        fmt = r.get("format", "unknown")
        format_groups.setdefault(fmt, []).append(r["engagement_rate"])
        format_lengths.setdefault(fmt, []).append(r.get("length", 30))

    format_breakdown = [
        {
            "format": fmt,
            "avg_engagement": round(mean(rates), 4),
            "reel_count": len(rates),
        }
        for fmt, rates in format_groups.items()
    ]
    format_breakdown.sort(key=lambda x: x["avg_engagement"], reverse=True)

    best_format_data = format_breakdown[0] if format_breakdown else None
    best_format = best_format_data["format"] if best_format_data else None

    # Detect dominant pattern: top format must beat average by > threshold
    all_rates = [r["engagement_rate"] for r in reels]
    overall_avg = mean(all_rates)
    best_avg = best_format_data["avg_engagement"] if best_format_data else 0

    variance = best_avg - overall_avg
    if variance > PATTERN_VARIANCE_THRESHOLD:
        pattern_status = "pattern_detected"
        confidence = min(round((variance / PATTERN_VARIANCE_THRESHOLD) * 50, 1), 100.0)
    elif len(reels) >= MIN_REELS:
        pattern_status = "no_clear_pattern"
        confidence = 30.0
    else:
        pattern_status = "insufficient_data"
        confidence = 0.0

    # Ideal length from best format
    ideal_length = None
    if best_format and format_lengths.get(best_format):
        ideal_length = _classify_length(mean(format_lengths[best_format]))

    # Top topic
    topics = [r.get("topic", "") for r in reels if r.get("topic")]
    topic_counter = Counter(topics)
    top_topic = topic_counter.most_common(1)[0][0] if topic_counter else None

    # Recent trend: compare last 3 vs previous avg
    recent_trend = None
    if len(reels) >= 6:
        sorted_reels = sorted(reels, key=lambda x: x.get("created_at", ""), reverse=True)
        recent_avg = mean([r["engagement_rate"] for r in sorted_reels[:3]])
        older_avg = mean([r["engagement_rate"] for r in sorted_reels[3:6]])
        if recent_avg > older_avg * 1.1:
            recent_trend = "improving"
        elif recent_avg < older_avg * 0.9:
            recent_trend = "declining"
        else:
            recent_trend = "stable"

    return {
        "total_reels": len(reels),
        "avg_engagement_rate": round(overall_avg, 4),
        "best_format": best_format,
        "ideal_length": ideal_length,
        "pattern_status": pattern_status,
        "confidence": confidence,
        "format_breakdown": format_breakdown,
        "top_topic": top_topic,
        "recent_trend": recent_trend,
    }


def _safe_mean(values: list[float]) -> float:
    if not values:
        return 0.0
    return round(mean(values), 4)
