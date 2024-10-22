import { useEffect, useState } from "react";
import { SiriMessage } from "../types";

export const useConversation = (key: string) => {
  const [messages, setMessages] = useState<SiriMessage[]>([]);

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const loadMessages = () => {
      const storedMessages = localStorage.getItem(key);
      return storedMessages ? JSON.parse(storedMessages) : [];
    };

    setMessages(loadMessages());
  }, [key]);

  // Save messages to localStorage
  const updateMessages = (newMessages: SiriMessage[]) => {
    setMessages(newMessages);
    localStorage.setItem(key, JSON.stringify(newMessages));
  };

  // Clear messages from localStorage
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(key);
  };

  return {
    messages,
    updateMessages,
    clearMessages,
  };
};
