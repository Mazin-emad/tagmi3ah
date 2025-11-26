import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PaperAirplaneIcon,
  TrashIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { LoadingComponent } from "@/components/global/LoadingComponents";
import { cn } from "@/lib/utils";

export default function Chat() {
  const {
    messages,
    sendMessage,
    clearChat,
    retryLastMessage,
    isLoading,
    error,
  } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageToSend = input.trim();
    setInput("");

    sendMessage(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI PC Parts Advisor
          </h1>
          <p className="text-muted-foreground">
            Get expert recommendations for PC components and compatibility
            advice
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] lg:h-[calc(100vh-16rem)]">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle>Chat</CardTitle>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <>
                  {error && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retryLastMessage}
                      title="Retry last message"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    title="Clear chat history"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </>
              )}
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Ask me about PC parts, compatibility, recommendations, or
                  building a custom PC. I can help you choose the right
                  components for your needs and budget.
                </p>
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "What CPU should I get for gaming?",
                      "Is this motherboard compatible with DDR5 RAM?",
                      "Help me build a PC for $1000",
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(suggestion);
                          setTimeout(() => {
                            inputRef.current?.focus();
                          }, 100);
                        }}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-2 group relative",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap wrap-break-word">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {message.timestamp && (
                          <p
                            className={cn(
                              "text-xs",
                              message.role === "user"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                            message.role === "user"
                              ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => copyToClipboard(message.content)}
                          title="Copy message"
                        >
                          <ClipboardDocumentIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            You
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about PC parts, compatibility, or recommendations..."
                disabled={isLoading}
                rows={1}
                className="flex-1 min-h-[44px] max-h-32 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  height: "auto",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(
                    target.scrollHeight,
                    128
                  )}px`;
                }}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-11 w-11 shrink-0"
              >
                {isLoading ? (
                  <LoadingComponent />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </p>
              {input.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {input.length} characters
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
