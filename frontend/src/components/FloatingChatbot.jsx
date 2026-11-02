import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAppLoader } from '../context/AppLoaderContext';
import ChatMessageContent from './ChatMessageContent';
import InteractiveChatBot from './InteractiveChatBot';

const SUGGESTIONS = [
  'Tell me about the company',
  'Who are the leaders at Cache Digitech?',
  'What do you do?',
  'What services does Cache Digitech offer?',
  'What is AI Ops CoE?',
  'Which industries do you serve?',
  'What innovations has Cache Digitech built?',
  'How do I contact you?',
];

const FAB_ENTRY_LERP = 0.08;
const FAB_TILT_LERP = 0.05;
const FAB_TILT_HOLD_MS = 500;

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [entering, setEntering] = useState(false);
  const [showIdleBubble, setShowIdleBubble] = useState(false);
  const [fabProgress, setFabProgress] = useState({ slide: 0, tilt: 0 });
  const { messages, input, setInput, loading, chatError, sendMessage, hasAsked } = useChat();
  const { loaderDone } = useAppLoader();
  const messagesEndRef = useRef(null);
  const popupInputRef = useRef(null);
  const panelRef = useRef(null);
  const fabProgressRef = useRef({ slide: 0, tilt: 0 });
  const fabTargetRef = useRef({ slide: 0, tilt: 0 });
  const fabTiltScheduledRef = useRef(false);
  const fabRafRef = useRef(null);

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
    // Double rAF so the closed transform paints before the reveal class applies
    let innerId = 0;
    const outerId = requestAnimationFrame(() => {
      innerId = requestAnimationFrame(() => setEntering(true));
    });
    return () => {
      cancelAnimationFrame(outerId);
      cancelAnimationFrame(innerId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Same timing as hero image: start as soon as loader is done (no delay)
  useEffect(() => {
    if (!loaderDone) return undefined;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      fabTargetRef.current = { slide: 1, tilt: 1 };
      fabProgressRef.current = { slide: 1, tilt: 1 };
      setFabProgress({ slide: 1, tilt: 1 });
      return undefined;
    }
    fabTargetRef.current = { slide: 1, tilt: fabTargetRef.current.tilt };
    return undefined;
  }, [loaderDone]);

  useEffect(() => {
    const tick = () => {
      const cur = fabProgressRef.current;
      const tgt = fabTargetRef.current;
      const lerp = (current, target, factor) => {
        const next = current + (target - current) * factor;
        return Math.abs(next - target) < 0.0005 ? target : next;
      };
      const next = {
        slide: lerp(cur.slide, tgt.slide, FAB_ENTRY_LERP),
        tilt: lerp(cur.tilt, tgt.tilt, FAB_TILT_LERP),
      };
      fabProgressRef.current = next;
      setFabProgress(next);

      if (next.slide > 0.92 && !fabTiltScheduledRef.current) {
        fabTiltScheduledRef.current = true;
        setTimeout(() => {
          fabTargetRef.current = { ...fabTargetRef.current, tilt: 1 };
        }, FAB_TILT_HOLD_MS);
      }

      fabRafRef.current = requestAnimationFrame(tick);
    };
    fabRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (fabRafRef.current) cancelAnimationFrame(fabRafRef.current);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setShowIdleBubble(false);
      return undefined;
    }
    if (fabProgress.tilt < 0.85) return undefined;
    const showTimer = setTimeout(() => setShowIdleBubble(true), 700);
    const cycle = setInterval(() => {
      setShowIdleBubble(true);
      setTimeout(() => setShowIdleBubble(false), 4500);
    }, 10000);
    return () => {
      clearTimeout(showTimer);
      clearInterval(cycle);
    };
  }, [open, fabProgress.tilt]);

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
      setTimeout(() => popupInputRef.current?.focus(), 520);
    }
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeChat = () => setOpen(false);

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
          <header className="cd-chat-header cd-chat-header--close-only">
            <button
              type="button"
              className="cd-chat-close"
              onClick={closeChat}
              aria-label="Close chatbot"
              title="Close"
            >
              <span className="material-symbols-outlined" aria-hidden>
                close
              </span>
            </button>
          </header>

          <div className="cd-chat-messages flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 sm:px-4 py-3.5 sm:py-4 space-y-3.5 scrollbar-hide bg-[#fafafa]">
            {!hasAsked && (
              <div className="cd-chat-empty flex flex-col h-full justify-center px-0.5 sm:px-1 py-1 sm:py-2">
                <div className="cd-chat-empty-bot" aria-hidden>
                  <InteractiveChatBot size={72} active followStrength={1} />
                </div>
                <p className="cd-chat-empty-label text-[11px] font-semibold tracking-[0.18em] uppercase text-red-500 mb-2">
                  Ask Cache
                </p>
                <h4 className="cd-chat-empty-title text-[20px] sm:text-[22px] font-light text-(--apple-black) tracking-tight leading-snug mb-4 sm:mb-5">
                  How can we help?
                </h4>
                <div className="cd-chat-suggestions">
                  {SUGGESTIONS.map((q, idx) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      style={{ animationDelay: `${100 + idx * 45}ms` }}
                      className="cd-chat-chip text-left text-[12.5px] sm:text-[13px] text-(--apple-black) px-3 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
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
                  <div className="cd-chat-mini-mark cd-chat-mini-mark--bot shrink-0 mb-0.5" aria-hidden>
                    <InteractiveChatBot size={26} active staticPose followStrength={0} />
                  </div>
                  <div className="cd-chat-bubble-ai flex-1 max-w-[90%] sm:max-w-[88%] px-3 sm:px-3.5 py-2.5 sm:py-3 text-[13px] sm:text-[13.5px] text-(--apple-black)">
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
                <div className="cd-chat-mini-mark cd-chat-mini-mark--bot shrink-0" aria-hidden>
                  <InteractiveChatBot size={26} active thinking staticPose followStrength={0} />
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

          <div className="cd-chat-footer shrink-0 px-3.5 sm:px-4 pb-3 sm:pb-4 pt-2 bg-[#fafafa] border-t border-black/5">
            <div className="cd-chat-composer flex items-center gap-2 pl-3.5 sm:pl-4 pr-1.5 py-1.5">
              <input
                ref={popupInputRef}
                className="w-full min-w-0 border-none bg-transparent focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 text-[16px] sm:text-[13.5px] text-(--apple-black) placeholder:text-(--apple-gray)/80"
                placeholder="Ask about services, solutions..."
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
                className="cd-chat-send shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-35 disabled:scale-100 hover:scale-[1.04] active:scale-95"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-white text-[20px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!open && loaderDone && (
        <div
          className={`cd-chat-fab-wrap ${fabProgress.tilt >= 0.98 ? 'cd-chat-fab-wrap--settled' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            perspectiveOrigin: 'center center',
          }}
        >
          {showIdleBubble && (
            <div className="cd-chat-fab-bubble" role="status">
              Need help? Ask Cache
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`cd-chat-fab cd-chat-fab--bot ${fabProgress.tilt >= 0.98 ? 'cd-chat-fab--entered' : ''}`}
            aria-label="Open Cache Digitech assistant"
            aria-expanded={false}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              // Corner stay; hero-matched emerge from deep inside (-Z) then soft rotateY + color
              transform: `translateZ(${-320 * (1 - fabProgress.slide)}px) rotateY(${-12 * fabProgress.tilt}deg) scale(${0.55 + 0.45 * fabProgress.slide})`,
              opacity: fabProgress.slide < 0.02 ? 0 : 0.97 + 0.03 * fabProgress.slide,
              filter: fabProgress.tilt >= 1 ? 'none' : `grayscale(${1 - fabProgress.tilt})`,
              visibility: fabProgress.slide < 0.02 ? 'hidden' : 'visible',
              willChange: fabProgress.slide < 1 || fabProgress.tilt < 1 ? 'transform, opacity, filter' : 'auto',
            }}
          >
            <span className="cd-chat-fab-ring" aria-hidden />
            <InteractiveChatBot size={62} active={fabProgress.slide > 0.35} followStrength={1.1} />
          </button>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
