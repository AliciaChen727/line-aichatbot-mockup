// Mock AI Processing Unit tailored for the LINE Group Travel Assistant

import { TRAVEL_ASSISTANT_PROMPT } from '../lib/ai/prompts';
import { processGroupChat } from '../lib/ai/TravelConcierge';

export type ChatMessage = {
    id: string;
    senderName: string;
    senderId: string;
    avatarId: string;
    text: string;
    timestamp: string;
    isMe: boolean;
    readCount?: number;
};

export type BookingCard = {
    type: 'flight' | 'hotel' | 'restaurant' | 'experience';
    title: string;
    rating: number;
    price: string;
    imageUrl: string;
    actions: { label: string, url: string }[];
    linePointsReward?: number;
};

export type ParsedSummary = {
    confirmedItinerary: string[];
    estimatedBudget: string;
    pendingItems: string[];
    bookingCards: BookingCard[];
    conflictResolutionDraft?: {
        reason: string;
    };
};

/**
 * Mocks the AI extraction logic based on the last 20 messages.
 * Uses the travel concierge orchestration to analyze intent, conflicts, and memory.
 */
export async function summarizeMessages(messages: ChatMessage[]): Promise<ParsedSummary> {
    // Simulate network delay for AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Delegate to the new Orchestration Logic Flow
    const summary = await processGroupChat(messages);

    return summary;
}
