import { CohereClient } from "cohere-ai";
import type { ChatMessage, ChatRequest, ChatResponse } from "./types";

/**
 * Get Cohere API key from environment variable
 */
const getCohereApiKey = (): string => {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Cohere API key is not configured. Please set VITE_COHERE_API_KEY in your .env file."
    );
  }
  return apiKey;
};

/**
 * Initialize Cohere client
 */
let cohereClient: CohereClient | null = null;

const getCohereClient = (): CohereClient => {
  if (!cohereClient) {
    cohereClient = new CohereClient({
      token: getCohereApiKey(),
    });
  }
  return cohereClient;
};

/**
 * Convert chat messages to Cohere format
 */
const formatMessagesForCohere = (
  messages: ChatMessage[]
): Array<{ role: "user" | "assistant" | "system"; content: string }> => {
  return messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.content,
  }));
};

/**
 * Send chat message to Cohere API
 * @param request - Chat request with message and optional conversation history
 * @returns Chat response with AI-generated message
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const client = getCohereClient();
    const { message, conversationHistory = [] } = request;

    // Build conversation history with system prompt
    const systemPrompt = `You are an expert PC parts advisor specializing in computer hardware recommendations and compatibility advice. Your role is to help users build compatible PC systems by recommending appropriate components.

**Your Expertise:**
- CPU (Central Processing Unit) selection and compatibility
- GPU (Graphics Processing Unit) recommendations
- Motherboard compatibility (socket types, chipset, form factor)
- RAM (Memory) compatibility (DDR type, speed, capacity)
- PSU (Power Supply Unit) wattage requirements
- PC Case compatibility (form factor, size)
- Component compatibility checking
- Performance optimization
- Budget considerations

**Product Categories:**
1. **CPU** - Processors (Intel, AMD) with socket types (LGA, AM4, AM5, etc.)
2. **GPU** - Graphics cards (NVIDIA, AMD) with PCIe slots
3. **Motherboard** - Mainboards with specific sockets, chipsets, and form factors
4. **RAM Kits** - Memory modules (DDR4, DDR5) with speeds and capacities
5. **PSU** - Power supplies with wattage ratings and efficiency
6. **PC Case** - Cases with form factor support (ATX, mATX, ITX)

**Key Compatibility Rules:**
- CPU socket must match motherboard socket
- RAM type (DDR4/DDR5) must match motherboard support
- PSU wattage must meet system requirements
- Case form factor must accommodate motherboard size
- GPU must fit in case and have adequate PSU power

**Your Approach:**
- Ask clarifying questions about budget, use case (gaming, work, content creation), and preferences
- Provide specific component recommendations with reasoning
- Check compatibility between suggested components
- Consider performance-to-price ratios
- Warn about potential compatibility issues
- Suggest alternatives when appropriate

Always be helpful, clear, and focus on building compatible PC systems that meet the user's needs and budget.`;

    // Prepare messages for Cohere
    const chatHistory =
      conversationHistory.length > 0
        ? formatMessagesForCohere(conversationHistory)
        : [];

    // Use Cohere chat API
    const response = await client.chat({
      message: message,
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      model: "command-a-03-2025", // Using Command R+ for better reasoning
      preamble: systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return {
      message:
        response.text ||
        "I apologize, but I couldn't generate a response. Please try again.",
      usage: {
        promptTokens: response.meta?.billedUnits?.inputTokens,
        completionTokens: response.meta?.billedUnits?.outputTokens,
      },
    };
  } catch (error: unknown) {
    // Handle specific Cohere API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes("api key") ||
        errorMessage.includes("authentication") ||
        errorMessage.includes("unauthorized")
      ) {
        throw new Error(
          "Invalid or missing Cohere API key. Please check your configuration."
        );
      }
      if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
        throw new Error(
          "Rate limit exceeded. Please wait a moment and try again."
        );
      }
      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        throw new Error(
          "API quota exceeded. Please check your Cohere account limits."
        );
      }
      if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }
      if (errorMessage.includes("timeout")) {
        throw new Error("Request timed out. Please try again.");
      }

      // Check for Cohere-specific error structure
      const cohereError = error as any;
      if (cohereError?.body?.message) {
        throw new Error(`Cohere API error: ${cohereError.body.message}`);
      }

      throw new Error(`Failed to get AI response: ${error.message}`);
    }

    // Handle non-Error objects
    if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if (errorObj.message) {
        throw new Error(String(errorObj.message));
      }
    }

    throw new Error(
      "An unexpected error occurred while communicating with AI."
    );
  }
}
