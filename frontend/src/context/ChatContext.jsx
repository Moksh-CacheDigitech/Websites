import React, { createContext, useContext, useState, useCallback } from 'react';
import { answerFromFaqs } from '../lib/faqChat';

const ChatContext = createContext(null);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setChatError(null);

    try {
      // Brief pause so the typing dots feel natural (fully client-side FAQ match)
      await wait(280 + Math.min(420, text.length * 8));
      const result = answerFromFaqs(text);
      const reply =
        String(result?.reply || '').trim() ||
        "I'd love to help with Cache Digitech services. Reach us at info@cachedigitech.com.";
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.warn('[chat]', err);
      setChatError(err.message || 'Chat is temporarily unavailable.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry - something went wrong. Please email info@cachedigitech.com or use /contactus.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        loading,
        chatError,
        setChatError,
        hasAsked,
        sendMessage,
      }}
    >
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
