/**
 * OpenRouter API Service
 * Handles all communication with OpenRouter API for LLM interactions
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Available models on OpenRouter
export const AVAILABLE_MODELS = {
  CLAUDE_3_5_SONNET: "anthropic/claude-3.5-sonnet",
  CLAUDE_3_OPUS: "anthropic/claude-3-opus",
  CLAUDE_3_HAIKU: "anthropic/claude-3-haiku",
  GPTO4_TURBO: "openai/gpt-4-turbo",
  GPT4_MINI: "openai/gpt-4o-mini",
  LLAMA_2_70B: "meta-llama/llama-2-70b-chat",
  MISTRAL_LARGE: "mistralai/mistral-large",
} as const;

export type ModelType = typeof AVAILABLE_MODELS[keyof typeof AVAILABLE_MODELS];

interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

/**
 * Send a chat message to OpenRouter API
 */
export async function sendMessageToOpenRouter(
  messages: OpenRouterMessage[],
  model: ModelType = AVAILABLE_MODELS.CLAUDE_3_5_SONNET,
  systemInstruction?: string
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OpenRouter API key not found. Set VITE_OPENROUTER_API_KEY in your .env file"
    );
  }

  // Prepend system instruction if provided
  const fullMessages: OpenRouterMessage[] = systemInstruction
    ? [{ role: "system", content: systemInstruction }, ...messages]
    : messages;

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "KnowYourBody",
      },
      body: JSON.stringify({
        model: model,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenRouter API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data: OpenRouterResponse = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid response from OpenRouter API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get response from OpenRouter: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get streaming response from OpenRouter API
 * Returns a readable stream for real-time message updates
 */
export async function streamMessageFromOpenRouter(
  messages: OpenRouterMessage[],
  onChunk: (chunk: string) => void,
  model: ModelType = AVAILABLE_MODELS.CLAUDE_3_5_SONNET,
  systemInstruction?: string
): Promise<void> {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OpenRouter API key not found. Set VITE_OPENROUTER_API_KEY in your .env file"
    );
  }

  const fullMessages: OpenRouterMessage[] = systemInstruction
    ? [{ role: "system", content: systemInstruction }, ...messages]
    : messages;

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "KnowYourBody",
      },
      body: JSON.stringify({
        model: model,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.95,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenRouter API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body from OpenRouter API");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.choices?.[0]?.delta?.content) {
              onChunk(parsed.choices[0].delta.content);
            }
          } catch (e) {
            // Skip parsing errors for malformed JSON
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to stream response from OpenRouter: ${error.message}`
      );
    }
    throw error;
  }
}
