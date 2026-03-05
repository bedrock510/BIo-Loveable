from datetime import date
import anthropic
import json


def build_report_json(user_id, biosignal_scores, flags, self_report=None):
    return {
        "report_version": "1.0",
        "user_id": user_id or "guest",
        "recording_date": date.today().isoformat(),
        "scores": biosignal_scores,
        "flags": flags,
        "self_report": self_report or {},
        "disclaimer": "Non-diagnostic wellness insights; not medical advice."
    }


def generate_report(report_json, agreement_score, primary_goal=None):
    client = anthropic.Anthropic()

    confidence_level = "high" if agreement_score > 0.7 else "moderate"

    # Pre-convert scores to percentages before passing to Claude
    scores = report_json.get("scores", {})
    score_percentages = {
        key: f"{round(value * 100)}%"
        for key, value in scores.items()
    }

    flags = report_json.get("flags", {})
    self_report = report_json.get("self_report", {})

    system_prompt = """You are the White Glove Wellness® BioSignal Report Writer.

You receive scored wellness data and write a direct, data-forward, personalized wellness report.

RULES:
- Scores are already converted to percentages — use them directly in your language
- Always reference the actual percentage numbers
- Example: "Your stress load registered at 52%, which places you in a range commonly associated with low-grade chronic tension accumulating in the nervous system."
- Example: "Your recovery capacity came in at 31% — below the 40% threshold where the body typically struggles to fully replenish between cycles of demand."
- Example: "Your facial tension load at 18% suggests your physical expression is relatively at ease."
- Be direct and specific. No flowery language. No poetry. No padding.
- Warm but clinical. Think premium health report, not spa brochure.
- NEVER use phrases like: "gentle invitation," "luminous," "nourishing," "beautifully rich," "remarkable"
- NEVER diagnose. NEVER claim disease detection.
- Use language like: "has been associated with," "commonly linked to," "our analysis indicates," "this pattern suggests"
- If confidence_level is moderate — add one sentence noting that signal agreement was partial and results should be interpreted with that in mind
- Next steps must be specific to the actual score numbers — not generic wellness advice
- Keep the whole report under 600 words
- Write in short, direct paragraphs

REPORT STRUCTURE:
1. One-line disclaimer (italicized)
2. Score Summary — go through each score as a percentage with one direct sentence on what it may indicate
3. What The Data Suggests — 2-3 short paragraphs connecting the patterns across scores, referencing specific numbers
4. Your Next Steps — 3-5 specific actionable recommendations tied directly to the scores
5. How White Glove Wellness® Can Help — 2-3 sentences max, mention specific protocol categories relevant to the scores
6. One-line disclaimer (italicized)"""

    user_message = f"""Here is the BioSignal scan data:

SCORES (pre-converted to percentages):
{chr(10).join(f"- {k.replace('_', ' ').title()}: {v}" for k, v in score_percentages.items())}

FLAGS TRIGGERED:
{chr(10).join(f"- {k.replace('_', ' ').title()}: {'YES' if v else 'No'}" for k, v in flags.items())}

SELF REPORT:
- Sleep hours last night: {self_report.get('sleep_hours_avg', 'Not provided')}
- Self-reported stress level: {self_report.get('stress_level_1_10', 'Not provided')}/10
- Primary wellness goal: {primary_goal or 'Not specified'}

Signal confidence level: {confidence_level}
(High = facial and audio signals strongly agreed. Moderate = partial agreement between signals.)

Write the full wellness report now."""

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1500,
        messages=[
            {"role": "user", "content": user_message}
        ],
        system=system_prompt
    )

    return message.content[0].text
