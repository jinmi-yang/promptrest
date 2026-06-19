// Vercel Serverless Function — turns an uploaded image into a reusable prompt.
// The API key stays here on the server (set ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables).
// Until that variable is set, this returns 501 and the homepage tool shows a friendly "준비 중" state (no cost).
//
// Swap provider/model freely:
//   - PROMPT_MODEL env overrides the model (default: claude-haiku-4-5, a cheap vision model).
//   - To use OpenAI/Google instead, replace the fetch block below with that provider's vision endpoint.

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(501).json({ error: "not_configured" }); return; }

  try {
    const { image, mediaType } = (req.body && typeof req.body === "object") ? req.body : JSON.parse(req.body || "{}");
    if (!image) { res.status(400).json({ error: "no_image" }); return; }
    // ~4MB base64 guard (Vercel body limit is ~4.5MB; the client already downscales to 768px)
    if (image.length > 5_500_000) { res.status(413).json({ error: "too_large" }); return; }

    const model = process.env.PROMPT_MODEL || "claude-haiku-4-5";
    const system =
      "You are an expert prompt engineer for AI image generators. " +
      "Given an image, write ONE reusable text-to-image prompt that would produce a visually similar image. " +
      "Describe subject, setting, composition, lighting, color palette, mood, style, and (if relevant) camera/lens. " +
      "Output ONLY the prompt text in English — no preamble, no quotes, no markdown, no explanations.";

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        system,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } },
            { type: "text", text: "Write a single detailed image-generation prompt that would recreate a similar image. Output only the prompt." },
          ],
        }],
      }),
    });

    if (!r.ok) {
      const detail = (await r.text().catch(() => "")).slice(0, 300);
      res.status(502).json({ error: "upstream_error", detail });
      return;
    }
    const data = await r.json();
    const prompt = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    if (!prompt) { res.status(502).json({ error: "empty" }); return; }
    res.status(200).json({ prompt });
  } catch (e) {
    res.status(500).json({ error: "server_error", detail: String(e && e.message || e).slice(0, 200) });
  }
}
