import { useState, useCallback, useEffect } from "react";
import { sendChatMessage } from "@/api/chat";
import type { ChatMessage, ChatResponse } from "@/api/types";
import { toast } from "sonner";

const STORAGE_KEY = "pc_parts_chat_history";

/**
 * Load chat history from localStorage
 */
const loadChatHistory = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    return [];
  }
  return [];
};

/**
 * Save chat history to localStorage
 */
const saveChatHistory = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    console.log("Failed to save chat history");
  }
};

/**
 * Hook for managing chat state and AI interactions
 *
 * @returns Chat state and functions for sending messages, clearing chat, etc.
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, error, clearChat } = useChat();
 *
 * const handleSend = () => {
 *   sendMessage("What CPU should I get for gaming?", {
 *     onSuccess: () => {},
 *     onError: (err) => toast.error(err.message),
 *   });
 * };
 * ```
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadChatHistory()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  }, []);

  /**
   * Clear all chat messages
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
    toast.success("Chat cleared");
  }, []);

  /**
   * Send a message to the AI
   */
  const sendMessage = useCallback(
    async (
      content: string,
      options?: {
        onSuccess?: (response: ChatResponse) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      if (!content.trim()) {
        toast.error("Please enter a message");
        return;
      }

      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const trimmedContent = content.trim();
      if (!trimmedContent || trimmedContent.length === 0) {
        toast.error("Please enter a message");
        return;
      }

      const userMessage: ChatMessage = {
        role: "user",
        content: trimmedContent,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);

      try {
        const validHistory = messages.filter(
          (msg) => msg.content && msg.content.trim().length > 0
        );

        const response = await sendChatMessage({
          message: trimmedContent,
          conversationHistory: validHistory,
        });

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.message,
          timestamp: new Date().toISOString(),
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);

        options?.onSuccess?.(response);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to send message. Please try again.");

        setError(error.message);

        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes("api key") ||
          errorMessage.includes("configuration")
        ) {
          toast.error("API Configuration Error", {
            description:
              "Please configure your Cohere API key in the .env file",
            duration: 5000,
          });
        } else if (errorMessage.includes("rate limit")) {
          toast.error("Rate Limit Exceeded", {
            description: "Please wait a moment before sending another message",
            duration: 4000,
          });
        } else if (errorMessage.includes("quota")) {
          toast.error("API Quota Exceeded", {
            description: "Please check your Cohere account limits",
            duration: 5000,
          });
        } else if (
          errorMessage.includes("chat history") ||
          errorMessage.includes("history must have a message") ||
          errorMessage.includes("invalid role in chat_history")
        ) {
          toast.error("Chat History Error", {
            description:
              "There was an issue with the conversation history format. Try clearing the chat and starting fresh.",
            duration: 6000,
            action: {
              label: "Clear Chat",
              onClick: () => {
                clearChat();
              },
            },
          });
        } else if (
          errorMessage.includes("network error") &&
          !errorMessage.includes("ai service")
        ) {
          toast.error("Network Error", {
            description: "Please check your internet connection and try again",
            duration: 4000,
          });
        } else if (errorMessage.includes("timeout")) {
          toast.error("Request Timeout", {
            description: "The request took too long. Please try again",
            duration: 4000,
          });
        } else if (errorMessage.includes("temporarily unavailable")) {
          toast.error("Service Unavailable", {
            description:
              "The AI service is temporarily down. Please try again later",
            duration: 5000,
          });
        } else {
          toast.error("Failed to send message", {
            description: error.message || "An unexpected error occurred",
            duration: 5000,
          });
        }

        options?.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, clearChat]
  );

  /**
   * Retry last failed message
   */
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (lastUserMessage) {
      const lastUserIndex = messages.findIndex(
        (msg) => msg === lastUserMessage
      );
      const messagesBeforeLast = messages.slice(0, lastUserIndex);
      setMessages(messagesBeforeLast);
      saveChatHistory(messagesBeforeLast);

      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    sendMessage,
    clearChat,
    retryLastMessage,
    isLoading,
    error,
  };
}
