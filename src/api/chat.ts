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
 * Cohere API requires:
 * - 'message' field (not 'content')
 * - Role names: "User", "Chatbot", "System", "Tool" (capitalized)
 * - Filters out empty messages
 */
const formatMessagesForCohere = (
  messages: ChatMessage[]
): Array<{ role: "User" | "Chatbot"; message: string }> => {
  return messages
    .filter((msg) => msg.content && msg.content.trim().length > 0) // Filter out empty messages
    .map((msg) => ({
      role: msg.role === "user" ? "User" : "Chatbot", // Cohere expects "User" and "Chatbot" (capitalized)
      message: msg.content.trim(), // Cohere expects 'message' field, not 'content'
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
    // Log the full error for debugging (only in development)
    if (import.meta.env.DEV) {
      console.error("Cohere API Error:", error);
    }

    // Handle Cohere SDK error structure
    const cohereError = error as any;
    
    // Extract error message from various possible locations
    let apiErrorMessage: string | undefined;
    let statusCode: number | undefined;

    // Check for Cohere SDK error structure
    if (cohereError?.body) {
      if (typeof cohereError.body === "string") {
        try {
          const parsed = JSON.parse(cohereError.body);
          apiErrorMessage = parsed.message || parsed.error?.message;
          statusCode = parsed.status || parsed.statusCode;
        } catch {
          apiErrorMessage = cohereError.body;
        }
      } else if (typeof cohereError.body === "object") {
        apiErrorMessage = cohereError.body.message || cohereError.body.error?.message;
        statusCode = cohereError.body.status || cohereError.body.statusCode;
      }
    }

    // Check for status code in error object
    if (!statusCode && cohereError?.status) {
      statusCode = cohereError.status;
    }
    if (!statusCode && cohereError?.statusCode) {
      statusCode = cohereError.statusCode;
    }

    // Get error message from various sources
    const errorMessage = 
      apiErrorMessage || 
      cohereError?.message || 
      (error instanceof Error ? error.message : String(error));

    const errorMessageLower = errorMessage.toLowerCase();

    // Handle errors by status code first (more reliable)
    if (statusCode) {
      if (statusCode === 401 || statusCode === 403) {
        throw new Error(
          "Invalid or missing Cohere API key. Please check your configuration."
        );
      }
      if (statusCode === 429) {
        throw new Error(
          "Rate limit exceeded. Please wait a moment and try again."
        );
      }
      if (statusCode >= 500) {
        throw new Error(
          "AI service is temporarily unavailable. Please try again later."
        );
      }
      if (statusCode >= 400 && statusCode < 500) {
        // Client error - check for specific messages
        if (
          errorMessageLower.includes("all elements in history must have a message") ||
          errorMessageLower.includes("history must have a message") ||
          errorMessageLower.includes("invalid role in chat_history") ||
          errorMessageLower.includes("invalid request")
        ) {
          throw new Error(
            "There was an issue with the chat history format. Please try clearing the chat and starting a new conversation."
          );
        }
        throw new Error(`AI service error: ${errorMessage}`);
      }
    }

    // Handle specific error messages (fallback if no status code)
    if (
      errorMessageLower.includes("all elements in history must have a message") ||
      errorMessageLower.includes("history must have a message") ||
      errorMessageLower.includes("invalid role in chat_history") ||
      errorMessageLower.includes("invalid request")
    ) {
      throw new Error(
        "There was an issue with the chat history format. Please try clearing the chat and starting a new conversation."
      );
    }

    if (
      errorMessageLower.includes("api key") ||
      errorMessageLower.includes("authentication") ||
      errorMessageLower.includes("unauthorized")
    ) {
      throw new Error(
        "Invalid or missing Cohere API key. Please check your configuration."
      );
    }

    if (errorMessageLower.includes("rate limit") || errorMessageLower.includes("429")) {
      throw new Error(
        "Rate limit exceeded. Please wait a moment and try again."
      );
    }

    if (errorMessageLower.includes("quota") || errorMessageLower.includes("billing")) {
      throw new Error(
        "API quota exceeded. Please check your Cohere account limits."
      );
    }

    // Only treat as network error if it's actually a network issue
    // Check for actual network errors (not API errors that mention "fetch")
    if (
      error instanceof TypeError &&
      (error.message.includes("Failed to fetch") || error.message.includes("NetworkError"))
    ) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }

    if (errorMessageLower.includes("timeout")) {
      throw new Error("Request timed out. Please try again.");
    }

    // Generic error - show the actual error message if available
    if (errorMessage && errorMessage !== "Error") {
      throw new Error(`AI service error: ${errorMessage}`);
    }

    throw new Error(
      "An unexpected error occurred while communicating with AI. Please try again."
    );
  }
}
