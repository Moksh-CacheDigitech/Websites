import React, { createContext, useContext, useState } from 'react';

const ChatFocusContext = createContext({ chatFocused: false, setChatFocused: () => {} });

export function ChatFocusProvider({ children }) {
  const [chatFocused, setChatFocused] = useState(false);
  return (
    <ChatFocusContext.Provider value={{ chatFocused, setChatFocused }}>
      {children}
    </ChatFocusContext.Provider>
  );
}

export function useChatFocus() {
  return useContext(ChatFocusContext);
}

export default ChatFocusContext;
