import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { chatApis } from "../../services/chat";
import type { Product } from "../../types";
import AiProductCard from "./AiProductCard";
import { useLocation, useParams } from "react-router";
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const isProductPage = pathname.startsWith("/product/") && Boolean(id);
  //Send message to assitant
  const sendMessage = async () => {
    const message = input.trim();

    if (!message || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await chatApis.sendMessage({ message });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message,
          products: response.products,
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  //generate product summary
  const handleProductSummary = async () => {
    if (!id) return;

    setIsSummarizing(true);

    try {
      const response = await chatApis.getProductSummary(Number(id));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message,
          products: response.products,
        },
      ]);
    } catch (error) {
      console.error("Error generating product summary:", error);
    } finally {
      setIsSummarizing(false);
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 px-4 py-4 text-white">
            <div>
              <h3 className="font-semibold">AI Shopping Assistant</h3>
              <p className="text-xs text-slate-300">Find products with AI</p>
            </div>

            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          {isProductPage && (
            <div className="border-b border-slate-200 p-3">
              <button
                onClick={handleProductSummary}
                disabled={isSummarizing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles size={16} />
                {isSummarizing
                  ? "Generating summary..."
                  : "Summarize this product"}
              </button>
            </div>
          )}
          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="m-auto text-center text-sm text-slate-500">
                Hi! What are you looking for today?
              </p>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-slate-900 text-white"
                    : "mr-auto bg-slate-100 text-slate-800"
                }`}
              >
                {message.content}
                {message.products && message.products.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {message.products.map((product) => (
                      <AiProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask about products..."
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="rounded-lg bg-slate-900 p-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

export default AiChatWidget;
