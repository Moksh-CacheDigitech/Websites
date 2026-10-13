import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const SUGGESTIONS = [
  'What cloud services do you offer?',
  'How can I contact Cache Digitech?',
  'Who is on the leadership team?',
];

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const { messages, input, setInput, loading, chatError, sendMessage, hasAsked } = useChat();
  const messagesEndRef = useRef(null);
  const popupInputRef = useRef(null);

  useEffect(() => {
    const heroCard = document.querySelector('.ai-chat-card');
    if (!heroCard) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(heroCard);
    return () => observer.disconnect();
  }, []);

  const scrollToBottom = () => {
    const el = messagesEndRef.current;
    if (!el) return;
    const container = el.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  };
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, loading]);

  useEffect(() => {
    if (open && popupInputRef.current) {
      setTimeout(() => popupInputRef.current?.focus(), 120);
    }
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!visible) return null;

  return (
    <>
      {open && (
        <div
          data-chat-popup
          className="cd-chat-panel fixed bottom-[5.25rem] right-3 sm:right-6 sm:bottom-24 z-999 w-[calc(100vw-1.5rem)] max-w-[400px] h-[min(82vh,560px)] min-h-[440px] sm:w-[400px] flex flex-col overflow-hidden animate-[floatChatIn_0.35s_var(--ease-out-smooth)]"
          role="dialog"
          aria-label="Cache Digitech assistant"
        >
          {/* Header */}
          <div className="cd-chat-header shrink-0 px-5 pt-4 pb-3 border-b border-black/5 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="cd-chat-avatar shrink-0">
                  <img
                    src="/Cachelogo.webp"
                    alt=""
                    className="w-7 h-7 object-contain"
                    decoding="async"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-(--apple-black) tracking-tight leading-tight truncate">
                    Cache Digitech
                  </p>
                  <p className="text-[11px] text-(--apple-gray) mt-0.5 flex items-center gap-1.5">
                    <span className="cd-chat-online" aria-hidden />
                    Website assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <span className="material-symbols-outlined text-(--apple-gray) text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-hide bg-[#fafafa]">
            {!hasAsked && (
              <div className="flex flex-col h-full justify-center px-1 py-2">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-500 mb-2">
                  Ask Cache
                </p>
                <h4 className="text-[22px] font-light text-(--apple-black) tracking-tight leading-snug mb-5">
                  How can we help?
                </h4>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className="cd-chat-chip text-left text-[13px] text-(--apple-black) px-3.5 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatError && (
              <div className="text-[13px] text-red-700 bg-red-50 border border-red-100 p-3 rounded-xl">
                {chatError}
              </div>
            )}

            {messages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <div key={i} className="flex gap-2.5 items-end">
                  <div className="cd-chat-mini-mark shrink-0 mb-0.5" aria-hidden>
                    <img src="/Cachelogo.webp" alt="" className="w-3.5 h-3.5 object-contain" />
                  </div>
                  <div className="cd-chat-bubble-ai flex-1 max-w-[88%] leading-relaxed px-3.5 py-3 text-[13.5px] text-(--apple-black) whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="cd-chat-bubble-user max-w-[85%] leading-relaxed px-3.5 py-3 text-[13.5px] text-white whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="flex gap-2.5 items-end">
                <div className="cd-chat-mini-mark shrink-0" aria-hidden>
                  <img src="/Cachelogo.webp" alt="" className="w-3.5 h-3.5 object-contain" />
                </div>
                <div className="cd-chat-bubble-ai px-3.5 py-3 flex items-center gap-1.5">
                  <span className="cd-chat-dot" />
                  <span className="cd-chat-dot" style={{ animationDelay: '0.15s' }} />
                  <span className="cd-chat-dot" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="shrink-0 px-4 pb-4 pt-2 bg-[#fafafa] border-t border-black/5">
            <div className="cd-chat-composer flex items-center gap-2 pl-4 pr-1.5 py-1.5">
              <input
                ref={popupInputRef}
                className="w-full border-none bg-transparent focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 text-[13.5px] text-(--apple-black) placeholder:text-(--apple-gray)/80"
                placeholder="Ask about services, solutions, contact…"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Message"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="cd-chat-send shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-35 disabled:scale-100 hover:scale-[1.04] active:scale-95"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-white text-[20px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`cd-chat-fab fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-999 w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${open ? 'cd-chat-fab--open' : ''}`}
        aria-label={open ? 'Close chat' : 'Open Cache Digitech assistant'}
        aria-expanded={open}
      >
        {!open && <span className="cd-chat-fab-ring" aria-hidden />}
        <span
          className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${open ? 'text-(--apple-black) rotate-0' : 'text-white'}`}
        >
          {open ? 'close' : 'forum'}
        </span>
      </button>
    </>
  );
};

export default FloatingChatbot;
