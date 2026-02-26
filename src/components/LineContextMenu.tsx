import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Point {
    x: number;
    y: number;
}

interface LineContextMenuProps {
    position: Point | null;
    onClose: () => void;
}

const MENU_ITEMS = [
    { id: 'copy', label: '複製', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="11" height="11" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> },
    { id: 'select-copy', label: '選擇並複製', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path></svg> },
    { id: 'keep', label: 'Keep筆記', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> },
    { id: 'delete', label: '刪除', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> },
    { id: 'reply', label: '回覆', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> },
    { id: 'share', label: '分享', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> },
    { id: 'notes', label: '記事本', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { id: 'announce', label: '設為公告', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> },
    { id: 'report', label: '檢舉', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> },
    { id: 'screenshot', label: '截圖', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8V5a2 2 0 0 1 2-2h3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M21 16v3a2 2 0 0 1-2 2h-3"></path><rect x="8" y="8" width="8" height="8"></rect></svg> }
];

export default function LineContextMenu({ position, onClose }: LineContextMenuProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleClickOutside = (e: Event) => {
            onClose();
        };

        // Listen for scroll or click to dismiss menu
        // Use a tiny timeout so the event that opened the menu doesn't trigger the close listener immediately
        let timeoutId: NodeJS.Timeout;
        if (position) {
            timeoutId = setTimeout(() => {
                window.addEventListener('click', handleClickOutside);
                window.addEventListener('scroll', handleClickOutside, true); // true to catch capture phase before scroll changes layout
                window.addEventListener('contextmenu', handleClickOutside);
            }, 50);
        }

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleClickOutside, true);
            window.removeEventListener('contextmenu', handleClickOutside);
        };
    }, [position, onClose]);

    if (!position || !mounted) return null;

    // Render using fixed positioning so it overlays everything, using a Portal so it's not trapped by parent CSS transforms
    return createPortal(
        <div
            className="line-context-menu"
            style={{
                position: 'fixed',
                top: Math.min(position.y, window.innerHeight - 250) + 'px', // Prevent falling off bottom edge
                left: Math.max(10, Math.min(position.x - 140, window.innerWidth - 300)) + 'px', // Prevent falling off right/left edge (approx width 280)
                zIndex: 999999
            }}
            onClick={(e) => e.stopPropagation()}
            // Prevent the custom context menu itself from triggering another context menu
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="line-context-grid">
                {MENU_ITEMS.map((item) => (
                    <div key={item.id} className="line-context-item" onClick={onClose}>
                        <div className="line-context-icon">
                            {item.icon}
                        </div>
                        <span className="line-context-label">{item.label}</span>
                    </div>
                ))}
            </div>
            <div className="line-context-tail"></div>
        </div>,
        document.body
    );
}
