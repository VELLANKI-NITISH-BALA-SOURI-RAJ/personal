import json
import google.generativeai as genai
from app.config import get_settings


def _configure_gemini():
    settings = get_settings()
    genai.configure(api_key=settings.gemini_api_key)
    return genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=genai.GenerationConfig(
            temperature=0.8,
            top_p=0.95,
            max_output_tokens=2048,
        ),
    )


async def generate_script(
    topic: str,
    analytics: dict,
    format_hint: str | None = None,
    target_length: int | None = None,
    additional_context: str | None = None,
) -> dict:
    """
    Performance-informed script generation using user analytics data.
    Returns structured JSON with hooks, script, CTAs, and strategy notes.
    """
    model = _configure_gemini()

    pattern_status = analytics.get("pattern_status", "insufficient_data")
    best_format = analytics.get("best_format") or format_hint or "any format"
    ideal_length = analytics.get("ideal_length") or target_length or 30
    avg_engagement = analytics.get("avg_engagement_rate", 0)
    confidence = analytics.get("confidence", 0)
    recent_trend = analytics.get("recent_trend", "unknown")
    top_topic = analytics.get("top_topic", "general")

    format_breakdown = analytics.get("format_breakdown", [])
    format_insights = ""
    if format_breakdown:
        top_formats = format_breakdown[:3]
        format_insights = ", ".join(
            [f"{f['format']} ({f['avg_engagement']:.2f}% avg)" for f in top_formats]
        )

    analytics_summary = f"""
CREATOR ANALYTICS SNAPSHOT:
- Total reels analyzed: {analytics.get('total_reels', 0)}
- Average engagement rate: {avg_engagement:.2f}%
- Best performing format: {best_format}
- Ideal reel length: {ideal_length}s
- Pattern status: {pattern_status} (confidence: {confidence}%)
- Recent performance trend: {recent_trend}
- Top topic cluster: {top_topic}
- Format performance ranking: {format_insights or 'No data yet'}
"""

    context_note = f"\nAdditional creator context: {additional_context}" if additional_context else ""

    prompt = f"""You are a high-performance short-form content strategist. Your outputs are used directly by creators who study their data before recording.

{analytics_summary}{context_note}

TASK: Generate an optimized reel script package for this topic: "{topic}"

CREATOR INTELLIGENCE NOTES:
- Their best format is "{best_format}" — bias script structure toward this
- Their ideal length is {ideal_length}s — calibrate script pacing accordingly
- Engagement trend is {recent_trend} — {"maintain momentum" if recent_trend == "improving" else "course correct" if recent_trend == "declining" else "establish baseline"}
- Pattern confidence: {confidence}% — {"data-backed recommendations" if confidence > 50 else "exploratory recommendations (still building data)"}

OUTPUT FORMAT (strict JSON, no markdown fences):
{{
  "hooks": [
    {{
      "hook_text": "...",
      "hook_type": "curiosity|contrast|pain_point|bold_claim|social_proof",
      "why_it_works": "..."
    }},
    {{
      "hook_text": "...",
      "hook_type": "...",
      "why_it_works": "..."
    }},
    {{
      "hook_text": "...",
      "hook_type": "...",
      "why_it_works": "..."
    }}
  ],
  "script": {{
    "format": "{best_format}",
    "estimated_length_seconds": {ideal_length},
    "sections": [
      {{"label": "Hook (0-3s)", "content": "..."}},
      {{"label": "Problem/Stakes (3-8s)", "content": "..."}},
      {{"label": "Value Delivery (8-{max(ideal_length-10, 15)}s)", "content": "..."}},
      {{"label": "CTA ({max(ideal_length-7, 20)}-{ideal_length}s)", "content": "..."}}
    ],
    "full_script": "Complete script text optimized for {ideal_length}s delivery"
  }},
  "cta": {{
    "primary_cta": "...",
    "engagement_trigger": "...",
    "save_hook": "..."
  }},
  "execution_notes": {{
    "opening_visual": "...",
    "pacing_recommendation": "...",
    "audio_strategy": "...",
    "text_overlay_tips": "..."
  }},
  "retention_strategy": {{
    "pattern_interrupt_at": "...",
    "loop_mechanism": "...",
    "rewatch_trigger": "..."
  }},
  "performance_prediction": {{
    "confidence_based_on": "...",
    "expected_engagement_vs_your_avg": "...",
    "key_risk": "..."
  }}
}}

Generate for topic: "{topic}". Be specific, data-informed, and creator-actionable. No generic advice."""

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    if raw.endswith("```"):
        raw = raw[:-3].strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: return partial structured response
        return {
            "error": "Failed to parse structured output",
            "raw_output": raw,
            "hooks": [],
            "script": {"full_script": raw},
            "cta": {},
            "execution_notes": {},
            "retention_strategy": {},
            "performance_prediction": {},
        }


async def chat_with_assistant(
    message: str,
    history: list[dict],
    analytics: dict,
) -> str:
    """
    Chat assistant with full analytics context injection.
    Maintains conversation history and provides growth-strategy responses.
    """
    model = _configure_gemini()

    pattern_status = analytics.get("pattern_status", "insufficient_data")
    best_format = analytics.get("best_format") or "not determined yet"
    avg_engagement = analytics.get("avg_engagement_rate", 0)
    total_reels = analytics.get("total_reels", 0)
    recent_trend = analytics.get("recent_trend", "unknown")
    ideal_length = analytics.get("ideal_length")

    system_context = f"""You are the Reel Growth OS Assistant — a data-driven short-form content strategist embedded in a performance analytics SaaS.

YOUR CREATOR'S CURRENT DATA:
- Reels logged: {total_reels}
- Avg engagement rate: {avg_engagement:.2f}%
- Best performing format: {best_format}
- Ideal reel length: {f"{ideal_length}s" if ideal_length else "not enough data"}
- Pattern status: {pattern_status}
- Recent trend: {recent_trend}

YOUR ROLE:
- Answer questions about their content strategy using THEIR data, not generic advice
- When recommending formats, reference their top-performing format
- When engagement is low, diagnose specifically — hook failure, wrong format, poor topic
- When asked "what should I post", give a data-backed recommendation
- Be direct, specific, and action-oriented
- Never say "it depends" without following up with a specific recommendation
- Format responses with structure (bullet points, sections) when helpful
- If data is insufficient, acknowledge it and give a baseline strategy to build data faster

CONVERSATION:"""

    # Build history context
    history_text = ""
    for msg in history[-6:]:  # Last 6 messages for context
        role = "Creator" if msg["role"] == "user" else "Assistant"
        history_text += f"\n{role}: {msg['content']}"

    full_prompt = f"{system_context}{history_text}\nCreator: {message}\nAssistant:"

    response = model.generate_content(full_prompt)
    return response.text.strip()
