import React, { useState } from 'react';
import type { ParsedSummary } from './Summarizer';

interface FlexMessageUIProps {
    summary: ParsedSummary | null;
    time: string;
}

export default function FlexMessageUI({ summary, time }: FlexMessageUIProps) {
    const [showFeedbackMenu, setShowFeedbackMenu] = useState(false);
    const [isThumbUpActive, setIsThumbUpActive] = useState(false);
    const [isThumbDownActive, setIsThumbDownActive] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    // Treat null summary as loading state
    const isLoading = !summary;

    return (
        <div className="message-row bot animate-popIn">
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
                            <div className="bg-white dark:bg-[#1f2c34] rounded-[12px] overflow-hidden border border-gray-100 dark:border-gray-800" style={{ width: '280px', maxWidth: '100%', wordBreak: 'break-word' }}>
                                {/* Flex Header */}
                                <div className="bg-[#0b2447] text-white p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] tracking-wider opacity-80 uppercase">AI SUMMARY</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                    </div>
                                    <h3 className="font-bold text-base m-0 leading-tight">日本旅遊行程重點摘要</h3>
                                </div>

                                {/* Flex Body */}
                                <div className="p-3 space-y-3 text-[13px] leading-relaxed" style={{ color: "var(--text-main)" }}>

                                    {/* Confirmed */}
                                    <div>
                                        <h4 className="flex items-center gap-1.5 font-bold mb-1.5 pb-1 border-b border-gray-100 dark:border-gray-800" style={{ color: "#06C755" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            【確認行程】
                                        </h4>
                                        <ul className="pl-4 list-disc space-y-0.5 opacity-90 m-0">
                                            {summary!.confirmedItinerary.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Budget */}
                                    <div>
                                        <h4 className="flex items-center gap-1.5 font-bold mb-1.5 pb-1 border-b border-gray-100 dark:border-gray-800" style={{ color: "#FFaa00" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                            【預算預估】
                                        </h4>
                                        <p className="pl-1 mb-0 opacity-90 font-medium">{summary!.estimatedBudget}</p>
                                    </div>

                                    {/* Pending / Conflicts */}
                                    <div>
                                        <h4 className="flex items-center gap-1.5 font-bold mb-1.5 pb-1 border-b border-gray-100 dark:border-gray-800" style={{ color: "#FF3366" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                            【待定事項/討論】
                                        </h4>
                                        <ul className="pl-4 list-disc space-y-0.5 opacity-90 m-0">
                                            {summary!.pendingItems.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Recommended Bookings */}
                                    {summary!.bookingCards && summary!.bookingCards.length > 0 && (
                                        <div className="pt-2">
                                            <h4 className="flex items-center gap-1.5 font-bold mb-2 pb-1 border-b border-gray-100 dark:border-gray-800" style={{ color: "var(--line-primary)" }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                【推薦預訂】
                                            </h4>
                                            <div className="space-y-3">
                                                {summary!.bookingCards.map((card, i) => (
                                                    <div key={i} style={{
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '12px',
                                                        backgroundColor: 'var(--bubble-bot-bg)',
                                                        boxShadow: 'var(--shadow-sm)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        overflow: 'hidden',
                                                        marginBottom: '12px'
                                                    }}>
                                                        {/* Top Image (with padding inside as requested by screenshot) */}
                                                        {card.imageUrl && (
                                                            <div style={{ padding: '8px', paddingBottom: '0', position: 'relative' }}>
                                                                <div style={{
                                                                    width: '100%',
                                                                    height: '140px',
                                                                    borderRadius: '8px',
                                                                    overflow: 'hidden',
                                                                    backgroundColor: '#f0f0f0',
                                                                    position: 'relative'
                                                                }}>
                                                                    <img
                                                                        src={card.imageUrl}
                                                                        alt={card.title}
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    />
                                                                    <a
                                                                        href="https://travel.line.me/journeys?tab=myJourney"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '8px',
                                                                            right: '8px',
                                                                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                                                            color: 'white',
                                                                            fontSize: '11px',
                                                                            fontWeight: 'bold',
                                                                            padding: '4px 8px',
                                                                            borderRadius: '12px',
                                                                            textDecoration: 'none',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px',
                                                                            backdropFilter: 'blur(4px)'
                                                                        }}
                                                                    >
                                                                        新增到我的行程
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Text Details Section */}
                                                        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                            <div style={{ marginBottom: '8px' }}>
                                                                <h5 style={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: '15px',
                                                                    lineHeight: '1.2',
                                                                    margin: '0',
                                                                    color: 'var(--text-main)'
                                                                }}>{card.title}</h5>
                                                                {card.rating > 0 && (
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        color: '#FFaa00',
                                                                        fontSize: '12px',
                                                                        fontWeight: 'bold',
                                                                        marginTop: '4px'
                                                                    }}>
                                                                        <span>★</span> <span style={{ marginLeft: '4px' }}>{card.rating}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div style={{
                                                                fontWeight: 'bold',
                                                                fontSize: '16px',
                                                                paddingBottom: '8px',
                                                                color: 'var(--line-primary)'
                                                            }}>
                                                                {card.price}
                                                            </div>
                                                        </div>

                                                        {/* Bottom Action Grid */}
                                                        <div style={{
                                                            padding: '8px',
                                                            borderTop: '1px solid var(--border-color)',
                                                            display: 'flex',
                                                            gap: '8px'
                                                        }}>
                                                            {card.actions.map((action, actionIdx) => (
                                                                <a
                                                                    key={actionIdx}
                                                                    href={action.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        flex: 1,
                                                                        textAlign: 'center',
                                                                        fontSize: '13px',
                                                                        fontWeight: 'bold',
                                                                        padding: '10px 0',
                                                                        borderRadius: '8px',
                                                                        backgroundColor: actionIdx === 0 ? "var(--line-primary)" : "#f3f4f6",
                                                                        color: actionIdx === 0 ? "white" : "var(--text-main)",
                                                                        textDecoration: "none"
                                                                    }}
                                                                >
                                                                    {action.label}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Flex Footer / Button */}
                                <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex justify-center bg-white dark:bg-[#1f2c34]">
                                    <a
                                        href="https://travel.line.me/global-search?q=%E8%B6%8A%E5%BE%8C%E6%B9%AF%E6%BE%A4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[14px] font-bold text-center underline decoration-dashed underline-offset-4 hover:text-[#05A747] transition-colors"
                                        style={{ color: "var(--line-primary)" }}
                                    >
                                        點我看詳細規劃
                                    </a>
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
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>已經回饋送出</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
