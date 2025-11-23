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
  } catch (error) {
    console.error("Failed to load chat history:", error);
  }
  return [];
};

/**
 * Save chat history to localStorage
 */
const saveChatHistory = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save chat history:", error);
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
 *     onSuccess: () => console.log("Message sent"),
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

  // Load history on mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
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

      // Add user message immediately
      const userMessage: ChatMessage = {
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);

      try {
        // Send to AI
        const response = await sendChatMessage({
          message: content.trim(),
          conversationHistory: messages,
        });

        // Add assistant response
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

        // Show appropriate error toast based on error type
        if (error.message.includes("API key")) {
          toast.error("API Configuration Error", {
            description:
              "Please configure your Cohere API key in the .env file",
            duration: 5000,
          });
        } else if (error.message.includes("Rate limit")) {
          toast.error("Rate Limit Exceeded", {
            description: "Please wait a moment before sending another message",
            duration: 4000,
          });
        } else if (error.message.includes("quota")) {
          toast.error("API Quota Exceeded", {
            description: "Please check your Cohere account limits",
            duration: 5000,
          });
        } else {
          toast.error("Failed to send message", {
            description: error.message,
            duration: 4000,
          });
        }

        options?.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

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
   * Retry last failed message
   */
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (lastUserMessage) {
      // Remove the last user message and any subsequent assistant messages
      const lastUserIndex = messages.findIndex(
        (msg) => msg === lastUserMessage
      );
      const messagesBeforeLast = messages.slice(0, lastUserIndex);
      setMessages(messagesBeforeLast);
      saveChatHistory(messagesBeforeLast);

      // Retry sending
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
