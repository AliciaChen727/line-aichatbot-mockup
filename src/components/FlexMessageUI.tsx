import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ParsedSummary } from './Summarizer';
import LineContextMenu from './LineContextMenu';
import LiffItineraryModal from './LiffItineraryModal';

interface FlexMessageUIProps {
    summary: ParsedSummary | null;
    time: string;
}

export default function FlexMessageUI({ summary, time }: FlexMessageUIProps) {
    const [showFeedbackMenu, setShowFeedbackMenu] = useState(false);
    const [isThumbUpActive, setIsThumbUpActive] = useState(false);
    const [isThumbDownActive, setIsThumbDownActive] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
    const [showLiff, setShowLiff] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Treat null summary as loading state
    const isLoading = !summary;

    return (
        <div
            className="message-row bot animate-popIn"
            onContextMenu={(e) => {
                // Determine if click was inside the feedback actions to avoid overriding its events,
                // though usually we want the whole message to trigger the menu.
                e.preventDefault();
                e.stopPropagation(); // Prevents bubbling to window which instantly closes the context menu
                setContextMenuPos({ x: e.clientX, y: e.clientY });
            }}
        >
            <div className="bot-avatar flex-shrink-0 flex items-center justify-center text-white font-bold rounded-full mr-2" style={{ width: '36px', height: '36px', fontSize: '14px', background: 'linear-gradient(135deg, var(--line-primary), #11e06a)' }}>
                AI
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '11px', marginBottom: '4px', marginLeft: '4px', color: isLoading ? "var(--line-primary)" : "var(--text-muted)", fontWeight: isLoading ? "bold" : "normal" }}>
                    {isLoading ? "旅遊助手處理中..." : "旅遊助手"}
                </span>
                <div style={{ display: 'flex', alignItems: 'flex-end', maxWidth: '100%' }}>
                    <div className="message-bubble" style={{
                        backgroundColor: 'var(--bubble-bot-bg)',
                        color: 'var(--bubble-bot-text)',
                        borderTopLeftRadius: '4px',
                        borderBottomLeftRadius: '18px',
                        padding: isLoading ? '12px 16px' : '6px',
                        overflow: 'hidden',
                        maxWidth: '100%',
                        flex: '0 1 auto'
                    }}>
                        {isLoading ? (
                            <div className="typing-indicator m-0">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                    我幫大家彙整了剛才討論的重點，這是大家想去的行程草稿...
                                </div>
                                <div className="bg-white dark:bg-[#1f2c34] rounded-[12px] overflow-hidden border border-gray-100 dark:border-gray-800" style={{ width: '280px', maxWidth: '100%', wordBreak: 'break-word' }}>
                                    {/* Flex Header */}
                                    <div className="bg-[#0b2447] text-white p-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] tracking-wider opacity-80 uppercase">AI SUMMARY</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                        </div>
                                        <h3 className="font-bold text-base m-0 leading-tight">日本旅遊行程重點摘要</h3>
                                    </div>

                                    {/* Flex Body - Highlights Only */}
                                    <div className="p-3 space-y-3 text-[13px] leading-relaxed" style={{ color: "var(--text-main)" }}>
                                        <div>
                                            <h4 className="flex items-center gap-1.5 font-bold mb-2 pb-1 border-b border-gray-100 dark:border-gray-800" style={{ color: "var(--line-primary)" }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                【行程亮點總結】
                                            </h4>
                                            <ul className="pl-0 space-y-1.5 opacity-90 m-0 list-none">
                                                {summary!.highlights?.map((highlight, i) => (
                                                    <li key={i} className="flex font-medium">
                                                        <span className="mr-1.5 text-[var(--line-primary)]">•</span>
                                                        <span>{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Flex Footer / Button */}
                                    <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex justify-center bg-white dark:bg-[#1f2c34]">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowLiff(true); }}
                                            className="w-full text-[14px] font-bold text-center py-2 rounded-lg transition-colors bg-[var(--line-primary)] text-white hover:opacity-90 shadow-sm"
                                        >
                                            查看完整互動行程
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {!isLoading && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px', marginBottom: '2px', lineHeight: '1', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {time}
                        </span>
                    )}
                </div>

                {/* Feedback Actions */}
                {!isLoading && (
                    <div className="feedback-container" style={{ position: 'relative' }}>
                        <div className="feedback-actions">
                            <button
                                className={`feedback-btn ${isThumbUpActive ? 'active-thumb-up' : ''}`}
                                aria-label="Good response"
                                onClick={() => {
                                    setIsThumbUpActive(!isThumbUpActive);
                                    setIsThumbDownActive(false);
                                    setShowFeedbackMenu(false);
                                    setFeedbackSubmitted(false);
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill={isThumbUpActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                            </button>
                            <button
                                className={`feedback-btn ${isThumbDownActive ? 'active-thumb-down' : ''}`}
                                aria-label="Bad response"
                                onClick={() => {
                                    if (feedbackSubmitted) return; // Don't show menu again if already submitted
                                    setShowFeedbackMenu(!showFeedbackMenu);
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill={isThumbDownActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                            </button>
                        </div>

                        {/* Feedback Menu Popup */}
                        {showFeedbackMenu && (
                            <div className="feedback-popup" onClick={e => e.stopPropagation()}>
                                <div className="feedback-header">
                                    <h2>What went wrong?</h2>
                                    <p>Your feedback helps make旅遊助手 better for everyone.</p>
                                    <button className="feedback-close" onClick={() => setShowFeedbackMenu(false)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                                <div className="feedback-options">
                                    {['Personalization issue', 'Not factually correct', "Didn't follow instructions", 'Offensive / Unsafe', 'More...', 'Other'].map(option => (
                                        <button
                                            key={option}
                                            className="feedback-option"
                                            onClick={() => {
                                                setShowFeedbackMenu(false);
                                                setIsThumbDownActive(true);
                                                setIsThumbUpActive(false);
                                                setFeedbackSubmitted(true);

                                                // Reset the success message after 3 seconds
                                                setTimeout(() => {
                                                    setFeedbackSubmitted(false);
                                                }, 3000);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feedback Submitted Success Toast */}
                        {feedbackSubmitted && !showFeedbackMenu && (
                            <div className="feedback-popup" style={{ padding: '12px 16px', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06C755" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>感謝你的回饋</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <LineContextMenu
                position={contextMenuPos}
                onClose={() => setContextMenuPos(null)}
            />

            {/* LIFF Full Screen Itinerary Details Modal */}
            {showLiff && summary && mounted && createPortal(
                <LiffItineraryModal
                    summary={summary}
                    onClose={() => setShowLiff(false)}
                />,
                document.querySelector('.app-container') || document.body
            )}
        </div>
    );
}
