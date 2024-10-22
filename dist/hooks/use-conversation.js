"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConversation = void 0;
const react_1 = require("react");
const useConversation = (key) => {
    const [messages, setMessages] = (0, react_1.useState)([]);
    // Load messages from localStorage when the component mounts
    (0, react_1.useEffect)(() => {
        const loadMessages = () => {
            const storedMessages = localStorage.getItem(key);
            return storedMessages ? JSON.parse(storedMessages) : [];
        };
        setMessages(loadMessages());
    }, [key]);
    // Save messages to localStorage
    const updateMessages = (newMessages) => {
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
exports.useConversation = useConversation;
