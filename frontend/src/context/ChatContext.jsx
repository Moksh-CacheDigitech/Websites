import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

// Empty = same-origin / Vite proxy. Production: set VITE_CHAT_API_URL to the Node chat-api URL.
const CHAT_API_URL = (import.meta.env.VITE_CHAT_API_URL || '').replace(/\/$/, '');

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const hasAsked = messages.length > 0;

  const sendMessage = useCallback(async (overrideInput) => {
    const raw = overrideInput != null && typeof overrideInput === 'string' ? overrideInput : input;
    const text = String(raw).trim();
    if (!text || loading) return;

    setInput('');
    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);
    setChatError(null);

    try {
      const res = await fetch(`${CHAT_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-12) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Chat request failed (${res.status})`);
      }
      const reply = String(data.reply || '').trim() || 'Sorry, I could not generate a reply.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.warn('[chat]', err);
      setChatError(err.message || 'Chat is temporarily unavailable.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry - the assistant is temporarily unavailable. Please email info@cachedigitech.com or use /contactus.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <ChatContext.Provider value={{ messages, setMessages, input, setInput, loading, chatError, setChatError, hasAsked, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

export default ChatContext;
