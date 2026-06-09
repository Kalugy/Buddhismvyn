import { useState, useRef, useEffect } from "react";
import { Send, Loader2, User, Key, Eye, EyeOff, CheckCircle, XCircle, Trash2 } from "lucide-react";

const STORAGE_KEY = "dharma_path_api_key";

const SYSTEM_PROMPT = `You are a knowledgeable and compassionate Buddhist teacher and guide. You help people learn about Buddhism — its history, philosophy, practices, meditation techniques, and daily application.

Your tone is warm, clear, non-preachy, and accessible. You explain complex concepts in simple terms. You draw from all major Buddhist traditions (Theravada, Mahayana, Vajrayana) and note differences when relevant. You are respectful of all spiritual paths while being accurate about Buddhist teachings.

Keep responses focused and digestible — typically 2-4 paragraphs unless a longer explanation is genuinely needed. Use specific examples, analogies, and occasionally Pali/Sanskrit terms (always with translations).`;

function ApiKeySetup({ onSave }) {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const key = input.trim();
    if (!key) return;
    if (!key.startsWith("sk-ant-")) {
      setError("That doesn't look like an Anthropic API key. It should start with sk-ant-");
      return;
    }

    setValidating(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: key,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: "Hello" }],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Invalid API key");
      }

      localStorage.setItem(STORAGE_KEY, key);
      onSave(key);
    } catch (e) {
      setError(e.message.includes("Invalid") || e.message.includes("auth") ? "API key is invalid or unauthorized." : e.message);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-5">
        <Key className="w-8 h-8 text-amber-700" />
      </div>
      <h2 className="text-2xl font-bold text-stone-900 mb-2">Connect Your API Key</h2>
      <p className="text-stone-500 text-sm mb-8 leading-relaxed">
        To chat with the Buddhist AI teacher, enter your{" "}
        <a href="https://console.anthropic.com/keys" target="_blank" rel="noreferrer" className="text-amber-700 underline underline-offset-2">
          Anthropic API key
        </a>
        . It's stored only in your browser — never sent to any server except Anthropic's.
      </p>

      <div className="w-full space-y-3">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="sk-ant-api03-..."
            className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-amber-400 transition-colors font-mono"
          />
          <button
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm text-left">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!input.trim() || validating}
          className="w-full bg-amber-700 text-white font-semibold py-3 px-6 rounded-xl hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {validating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying key...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Save & Connect
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-stone-400 mt-6">
        Your key is saved in localStorage and never leaves your device except to call the Anthropic API directly.
      </p>
    </div>
  );
}

export default function ChatView() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namo Buddhaya 🙏 I'm your Buddhist teacher and guide. Ask me anything — about the history of Buddhism, the teachings, meditation practices, how to bring mindfulness into daily life, or anything else you're curious about. I'm here to help you explore the Dharma.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleDisconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    setMessages([
      {
        role: "assistant",
        content:
          "Namo Buddhaya 🙏 I'm your Buddhist teacher and guide. Ask me anything — about the history of Buddhism, the teachings, meditation practices, how to bring mindfulness into daily life, or anything else you're curious about. I'm here to help you explore the Dharma.",
      },
    ]);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          messages: [...messages.slice(1), userMsg],
          system: SYSTEM_PROMPT,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "API request failed");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const suggestions = [
    "What is the Middle Way?",
    "How do I start meditating?",
    "What is Nirvana?",
    "Explain karma simply",
  ];

  if (!apiKey) {
    return <ApiKeySetup onSave={setApiKey} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Ask the Teacher</h2>
          <p className="text-stone-500 text-sm">Powered by Claude AI</p>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
          title="Remove API key"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Disconnect
        </button>
      </div>

      {/* Connected badge */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-4 text-xs text-green-700">
        <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
        <span>
          Connected with key ending in <span className="font-mono font-semibold">...{apiKey.slice(-6)}</span>
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-amber-100" : "bg-stone-200"}`}>
              {msg.role === "assistant" ? (
                <span className="text-base">☸️</span>
              ) : (
                <User className="w-4 h-4 text-stone-600" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-white border border-stone-100 text-stone-700"
                  : "bg-amber-700 text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-base">☸️</span>
            </div>
            <div className="bg-white border border-stone-100 rounded-2xl px-4 py-3 flex items-center gap-2 text-stone-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Reflecting...
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {messages.length === 1 && (
          <div className="mt-2">
            <p className="text-xs text-stone-400 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="bg-white border border-stone-200 rounded-full px-3 py-1.5 text-sm text-stone-600 hover:border-amber-400 hover:text-amber-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border border-stone-200 rounded-2xl flex items-end gap-2 p-2 mt-2 shadow-sm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about Buddhism..."
          rows={1}
          className="flex-1 resize-none text-sm text-stone-800 placeholder-stone-400 focus:outline-none px-2 py-1.5 max-h-32"
          style={{ minHeight: "36px" }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="bg-amber-700 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
