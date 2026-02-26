"use client";

import { useState, useRef, useEffect } from "react";
import { type ChatMessage, type ParsedSummary, summarizeMessages } from "./Summarizer";
import FlexMessageUI from "./FlexMessageUI";

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2);
const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: "msg-1", senderName: "Alicia", senderId: "u1", avatarId: "A", text: "大家，下個月去日本旅遊要不要先確定一下要去哪？", timestamp: "10:00 AM", isMe: false },
    { id: "msg-2", senderName: "Spencer", senderId: "u2", avatarId: "S", text: "我超想去越後湯澤滑雪！聽說那邊的雪質很好 ❄️", timestamp: "10:02 AM", isMe: false },
    { id: "msg-3", senderName: "Me", senderId: "me", avatarId: "Me", text: "好耶！滑雪不錯，但我其實也滿想去河口湖看富士山的 ⛰️", timestamp: "10:05 AM", isMe: true, readCount: 3 },
    { id: "msg-4", senderName: "Alicia", senderId: "u1", avatarId: "A", text: "可是我不會滑雪耶，如果去滑雪的話，我可能只能在附近逛街 😅", timestamp: "10:08 AM", isMe: false },
    { id: "msg-5", senderName: "Wen", senderId: "u3", avatarId: "W", text: "那晚餐可不可以安排去吃好一點的燒肉？我想吃和牛", timestamp: "10:11 AM", isMe: false },
    { id: "msg-6", senderName: "Spencer", senderId: "u2", avatarId: "S", text: "好啊，那不然用AI助手整理一下現在大家的想法？", timestamp: "10:13 AM", isMe: false },
];

const BOT_AVATARS: Record<string, string> = {
    "u1": "#FF6B6B",
    "u2": "#4ECDC4",
    "u3": "#FFD166",
    "bot": "linear-gradient(135deg, var(--line-primary), #11e06a)",
};

type RenderableMessage =
    | { type: 'text', data: ChatMessage }
    | { type: 'flex', id: string, data: ParsedSummary | null, time: string };

export default function MessageThread() {
    const [messages, setMessages] = useState<RenderableMessage[]>(
        INITIAL_MESSAGES.map(m => ({ type: 'text', data: m }))
    );
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newMsgObj: ChatMessage = {
            id: generateId(),
            senderName: "Me",
            senderId: "me",
            avatarId: "Me",
            text: inputValue,
            timestamp: getCurrentTime(),
            isMe: true
        };

        setMessages((prev) => [...prev, { type: 'text', data: newMsgObj }]);
        setInputValue("");

        // Check if the user mentioned the AI assistant
        if (inputValue.includes("@旅遊助手") || inputValue.includes("助手") ||
            inputValue.includes("@旅遊助理") || inputValue.includes("助理")) {
            // Push an empty flex message to act as a placeholder
            // that will show the typing indicator while loading
            const placeholderId = generateId();

            setMessages((prev) => [
                ...prev,
                { type: 'flex', id: placeholderId, data: null, time: getCurrentTime() }
            ]);

            // Extract the last 20 messages (excluding Flex messages for summarization context)
            const textMessages = messages
                .filter(m => m.type === 'text')
                .map(m => (m as { type: 'text', data: ChatMessage }).data)
                .slice(-19);
            textMessages.push(newMsgObj);

            try {
                const summary = await summarizeMessages(textMessages);

                setMessages((prev) =>
                    prev.map(msg =>
                        msg.type === 'flex' && msg.id === placeholderId
                            ? { ...msg, data: summary, time: getCurrentTime() }
                            : msg
                    )
                );
            } catch (e) {
                console.error("Failed to generate summary", e);
                // Remove placeholder on failure
                setMessages(prev => prev.filter(msg =>
                    msg.type === 'flex' ? msg.id !== placeholderId : true
                ));
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="app-container group-chat">
            {/* Header */}
            <div className="chat-header justify-center sticky top-0 bg-white dark:bg-[#1f2c34] z-50 py-3 shadow-sm" style={{ backgroundColor: 'var(--header-bg)' }}>
                <span className="bot-name font-bold text-lg">日本滑雪行 🏂 (5)</span>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg) => {
                    const msgId = msg.type === 'flex' ? msg.id : msg.data.id;

                    if (msg.type === 'flex') {
                        return <FlexMessageUI key={msgId} summary={msg.data} time={msg.time} />;
                    }

                    const { data } = msg;

                    if (data.isMe) {
                        return (
                            <div key={data.id} className="message-row user">
                                <div className="message-wrapper">
                                    <div className="message-bubble">{data.text}</div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-end',
                                        marginRight: '6px',
                                        marginBottom: '2px'
                                    }}>
                                        {data.readCount && (
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1', marginBottom: '4px', fontWeight: '500' }}>
                                                已讀 {data.readCount}
                                            </span>
                                        )}
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1' }}>
                                            {data.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Other users in the group
                    return (
                        <div key={data.id} className="message-row bot animate-popIn">
                            <div
                                className="bot-avatar flex-shrink-0 flex items-center justify-center text-white font-bold rounded-full mr-2"
                                style={{ width: '36px', height: '36px', fontSize: '14px', background: BOT_AVATARS[data.senderId] || '#999' }}
                            >
                                {data.avatarId}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '75%' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '4px' }}>{data.senderName}</span>
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <div className="message-bubble" style={{
                                        backgroundColor: 'var(--bubble-bot-bg)',
                                        color: 'var(--bubble-bot-text)',
                                        borderTopLeftRadius: '4px',
                                        borderBottomLeftRadius: '18px',
                                        maxWidth: '100%'
                                    }}>
                                        {data.text}
                                    </div>
                                    <span style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        marginLeft: '6px',
                                        marginBottom: '2px',
                                        lineHeight: '1',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {data.timestamp}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing indicator removed from here since it's now handled smoothly inside FlexMessageUI */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <div className="input-container">
                    <input
                        className="chat-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="輸入訊息或呼叫旅遊助手..."
                        autoFocus
                    />
                </div>
                <button className="send-button" onClick={handleSend} aria-label="Send message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );
}
