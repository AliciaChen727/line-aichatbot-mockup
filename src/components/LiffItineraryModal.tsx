import React, { useState } from 'react';
import type { ParsedSummary, BookingCard } from './Summarizer';

interface LiffItineraryModalProps {
    summary: ParsedSummary;
    onClose: () => void;
}

export default function LiffItineraryModal({ summary, onClose }: LiffItineraryModalProps) {
    // states for drag and drop reordering
    const [itineraryItems, setItineraryItems] = useState([
        ...summary.confirmedItinerary.map(item => ({ id: `conf-${item}`, text: item, type: 'confirmed' })),
        ...summary.pendingItems.map(item => ({ id: `pend-${item}`, text: item, type: 'pending' }))
    ]);

    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

    const handleDragStart = (idx: number) => {
        setDraggedIdx(idx);
    };

    const handleDragEnter = (idx: number) => {
        if (draggedIdx === null || draggedIdx === idx) return;
        const newItems = [...itineraryItems];
        const draggedItem = newItems[draggedIdx];
        newItems.splice(draggedIdx, 1);
        newItems.splice(idx, 0, draggedItem);
        setDraggedIdx(idx);
        setItineraryItems(newItems);
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
    };

    return (
        <div className="absolute inset-0 z-50 bg-white dark:bg-[#111111] flex flex-col h-full w-full animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <h2 className="text-lg font-bold">互動行程總覽</h2>
                </div>
                <button className="text-sm font-bold px-3 py-1.5 bg-[var(--line-primary)] text-white rounded-full hover:opacity-90 transition-opacity">
                    儲存變更
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 text-[var(--text-main)]">

                {/* Confirmed & Pending Itinerary */}
                <div>
                    <h3 className="font-bold text-[15px] mb-2 flex items-center gap-1.5" style={{ color: "#06C755" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        【確認行程】
                    </h3>
                    <div className="space-y-1 pl-1 mb-4">
                        {itineraryItems.filter(i => i.type === 'confirmed').map((item, idx) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(itineraryItems.findIndex(x => x.id === item.id))}
                                onDragEnter={() => handleDragEnter(itineraryItems.findIndex(x => x.id === item.id))}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                className={`flex items-center gap-2 cursor-grab active:cursor-grabbing ${draggedIdx === itineraryItems.findIndex(x => x.id === item.id) ? 'opacity-50' : ''}`}
                            >
                                <span className="text-[15px] text-[var(--text-main)] w-full">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <h3 className="font-bold text-[15px] mb-2 flex items-center gap-1.5" style={{ color: "#FF3366" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        【待定事項/討論】
                    </h3>
                    <div className="space-y-1 pl-1">
                        {itineraryItems.filter(i => i.type === 'pending').map((item, idx) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(itineraryItems.findIndex(x => x.id === item.id))}
                                onDragEnter={() => handleDragEnter(itineraryItems.findIndex(x => x.id === item.id))}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                className={`flex items-center gap-2 cursor-grab active:cursor-grabbing ${draggedIdx === itineraryItems.findIndex(x => x.id === item.id) ? 'opacity-50' : ''}`}
                            >
                                <span className="text-[15px] text-[var(--text-main)] w-full">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget */}
                <div>
                    <h3 className="font-bold text-[15px] mb-1.5 flex items-center gap-1.5" style={{ color: "#FFaa00" }}>
                        <span style={{ fontSize: '16px', lineHeight: 1 }}>$</span>
                        【預算預估】
                    </h3>
                    <p className="text-[15px] text-[var(--text-main)] pl-1 mb-0">{summary.estimatedBudget}</p>
                </div>

                {/* Recommendations */}
                {summary.bookingCards && summary.bookingCards.length > 0 && (
                    <div>
                        <h3 className="font-bold text-[15px] mb-3 flex items-center gap-1.5" style={{ color: "var(--line-primary)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            【推薦預訂】
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {summary.bookingCards.map((card, i) => (
                                <div key={i} className="flex flex-col bg-white dark:bg-[#1f2c34] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {card.imageUrl && (
                                        <div className="relative h-40 w-full overflow-hidden">
                                            <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-black/80">
                                                <span>新增到行程</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-base mb-1 leading-snug">{card.title}</h4>
                                            {card.rating > 0 && (
                                                <div className="flex items-center text-yellow-500 text-xs font-bold mb-3">
                                                    <span>★</span> <span className="ml-1">{card.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-start mb-4">
                                            <span className="font-bold text-lg text-[var(--line-primary)]">{card.price}</span>
                                            {card.linePointsReward && (
                                                <div className="flex items-center gap-1.5 bg-[#E6F9EE] text-[#06C755] text-xs font-bold px-2 py-0.5 rounded">
                                                    <div className="w-4 h-4 rounded-full bg-[#06C755] text-white flex items-center justify-center text-[10px] font-black">P</div>
                                                    <span>享 {card.linePointsReward}% 回饋</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {card.actions.map((action, actionIdx) => {
                                                const isPrimary = action.label === '立即預訂';
                                                return (
                                                    <a
                                                        key={actionIdx}
                                                        href={action.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex-1 text-center text-sm font-bold py-2.5 rounded-lg transition-opacity hover:opacity-80 ${isPrimary ? 'bg-[var(--line-primary)] text-white' : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-main)]'}`}
                                                    >
                                                        {action.label}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
}
