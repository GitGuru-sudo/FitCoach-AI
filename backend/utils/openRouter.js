const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const callOpenRouter = async ({ messages, temperature = 0.7, maxTokens = 220 }) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fitcoach-ai.app",
      "X-Title": "FitCoach AI",
    },
    body: JSON.stringify({
      model: "mistralai/mixtral-8x7b-instruct",
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
};
