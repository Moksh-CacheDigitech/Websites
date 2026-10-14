import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessageContent from './ChatMessageContent';

const SUGGESTIONS = [
  'What cloud services do you offer?',
  'How can I contact Cache Digitech?',
  'Who is on the leadership team?',
];

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);
  const { messages, input, setInput, loading, chatError, sendMessage, hasAsked } = useChat();
  const messagesEndRef = useRef(null);
  const popupInputRef = useRef(null);
  const panelRef = useRef(null);

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

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setEntering(false);
      return undefined;
    }
    const id = requestAnimationFrame(() => setEntering(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const scrollToBottom = () => {
    const el = messagesEndRef.current;
    if (!el) return;
    const container = el.parentElement;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, loading]);

  useEffect(() => {
    if (open && popupInputRef.current) {
      setTimeout(() => popupInputRef.current?.focus(), 180);
    }
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeChat = () => setOpen(false);

  if (!visible) return null;

  return (
    <>
      {open && (
        <button
          type="button"
          className={`cd-chat-backdrop ${entering ? 'cd-chat-backdrop--in' : ''}`}
          aria-label="Close chat overlay"
          onClick={closeChat}
        />
      )}

      {open && (
        <div
          ref={panelRef}
          data-chat-popup
          className={`cd-chat-panel ${entering ? 'cd-chat-panel--in' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Cache Digitech assistant"
        >
          <div className="cd-chat-header shrink-0 px-4 sm:px-5 pt-3.5 sm:pt-4 pb-3 border-b border-black/5 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="cd-chat-avatar shrink-0">
                  <img
                    src="/Cachelogo.webp"
                    alt=""
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                    decoding="async"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] sm:text-[15px] font-semibold text-(--apple-black) tracking-tight leading-tight truncate">
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
                onClick={closeChat}
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <span className="material-symbols-outlined text-(--apple-gray) text-[22px]">close</span>
              </button>
            </div>
          </div>

          <div className="cd-chat-messages flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 sm:px-4 py-3.5 sm:py-4 space-y-3.5 scrollbar-hide bg-[#fafafa]">
            {!hasAsked && (
              <div className="cd-chat-empty flex flex-col h-full justify-center px-0.5 sm:px-1 py-1 sm:py-2">
                <p className="cd-chat-empty-label text-[11px] font-semibold tracking-[0.18em] uppercase text-red-500 mb-2">
                  Ask Cache
                </p>
                <h4 className="cd-chat-empty-title text-[20px] sm:text-[22px] font-light text-(--apple-black) tracking-tight leading-snug mb-4 sm:mb-5">
                  How can we help?
                </h4>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((q, idx) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      style={{ animationDelay: `${120 + idx * 70}ms` }}
                      className="cd-chat-chip text-left text-[13px] sm:text-[13px] text-(--apple-black) px-3.5 py-3 sm:py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatError && (
              <div className="cd-chat-msg-in text-[13px] text-red-700 bg-red-50 border border-red-100 p-3 rounded-xl">
                {chatError}
              </div>
            )}

            {messages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <div key={i} className="cd-chat-msg-in flex gap-2 sm:gap-2.5 items-end">
                  <div className="cd-chat-mini-mark shrink-0 mb-0.5" aria-hidden>
                    <img src="/Cachelogo.webp" alt="" className="w-3.5 h-3.5 object-contain" />
                  </div>
                  <div className="cd-chat-bubble-ai flex-1 max-w-[90%] sm:max-w-[88%] leading-relaxed px-3 sm:px-3.5 py-2.5 sm:py-3 text-[13px] sm:text-[13.5px] text-(--apple-black)">
                    <ChatMessageContent content={msg.content} />
                  </div>
                </div>
              ) : (
                <div key={i} className="cd-chat-msg-in flex justify-end">
                  <div className="cd-chat-bubble-user max-w-[88%] sm:max-w-[85%] leading-relaxed px-3 sm:px-3.5 py-2.5 sm:py-3 text-[13px] sm:text-[13.5px] text-white whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="cd-chat-msg-in flex gap-2 sm:gap-2.5 items-end">
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

          <div className="cd-chat-footer shrink-0 px-3.5 sm:px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:pb-4 pt-2 bg-[#fafafa] border-t border-black/5">
            <div className="cd-chat-composer flex items-center gap-2 pl-3.5 sm:pl-4 pr-1.5 py-1.5">
              <input
                ref={popupInputRef}
                className="w-full min-w-0 border-none bg-transparent focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 text-[16px] sm:text-[13.5px] text-(--apple-black) placeholder:text-(--apple-gray)/80"
                placeholder="Ask about services, solutions…"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Message"
                enterKeyHint="send"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="cd-chat-send shrink-0 w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-35 disabled:scale-100 hover:scale-[1.04] active:scale-95"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-white text-[20px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`cd-chat-fab ${open ? 'cd-chat-fab--open' : ''}`}
        aria-label={open ? 'Close chat' : 'Open Cache Digitech assistant'}
        aria-expanded={open}
      >
        {!open && <span className="cd-chat-fab-ring" aria-hidden />}
        <span
          className={`material-symbols-outlined text-[26px] transition-transform duration-300 ease-out ${
            open ? 'text-(--apple-black) rotate-90' : 'text-white rotate-0'
          }`}
        >
          {open ? 'close' : 'forum'}
        </span>
      </button>
    </>
  );
};

export default FloatingChatbot;
