// Mock AI Processing Unit tailored for the LINE Group Travel Assistant

import { TRAVEL_ASSISTANT_PROMPT } from '../lib/ai/prompts';

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
};

export type ParsedSummary = {
    confirmedItinerary: string[];
    estimatedBudget: string;
    pendingItems: string[];
    bookingCards: BookingCard[];
};

/**
 * Mocks the AI extraction logic based on the last 20 messages.
 * In a real app, this would send \`TRAVEL_ASSISTANT_PROMPT\` + \`messages\` to an LLM.
 */
export async function summarizeMessages(messages: ChatMessage[]): Promise<ParsedSummary> {
    // Simulate network delay for AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Analyze the messages to mock varying outputs
    const allText = messages.map(m => m.text.toLowerCase()).join(" ");

    const summary: ParsedSummary = {
        confirmedItinerary: [],
        estimatedBudget: "目前資訊不足",
        pendingItems: [],
        bookingCards: []
    };

    if (allText.includes("越後湯澤") || allText.includes("滑雪")) {
        summary.confirmedItinerary.push("越後湯澤滑雪行程");
        // Inject a mocked Hotel booking card
        summary.bookingCards.push({
            type: 'hotel',
            title: '松泉閤花月 (Shosenkaku Kagetsu)',
            rating: 4.6,
            price: 'NT$ 7,495 / 晚',
            imageUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
            actions: [
                { label: '查看詳情', url: 'https://www.klook.com/zh-TW/hotels/detail/558686-shosenkaku-kagetsu/?spm=SearchResult.SearchResult_LIST&clickId=93be432246' },
                { label: '立即預訂', url: 'https://www.klook.com/zh-TW/hotels/detail/558686-shosenkaku-kagetsu/?spm=SearchResult.SearchResult_LIST&clickId=93be432246' }
            ]
        });

        // Inject a mocked Experience booking card for Ski Lesson
        summary.bookingCards.push({
            type: 'experience',
            title: '湯澤滑雪場中文私人滑雪課程',
            rating: 5.0,
            price: '3小時NT$ 13,750起',
            imageUrl: 'https://images.pexels.com/photos/848682/pexels-photo-848682.jpeg?auto=compress&cs=tinysrgb&w=800',
            actions: [
                { label: '看體驗', url: 'https://www.klook.com/zh-TW/activity/128393-echigo-yuzawa-ski-lesson/?ad_feed_id=560&aid=api%7C13179%7CYZYzcMjK1B&openExternalBrowser=1&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=13179&utm_term=' }
            ]
        });
    }
    if (allText.includes("富士山")) {
        summary.confirmedItinerary.push("河口湖看富士山");
    }

    if (allText.includes("逛街") && allText.includes("滑雪")) {
        summary.pendingItems.push("行程衝突：有人想滑雪，有人想逛街，需協調時間");
    }

    if (allText.includes("燒肉") || allText.includes("和牛")) {
        summary.pendingItems.push("晚餐找燒肉餐廳");
        // Inject a mocked Restaurant booking card
        summary.bookingCards.push({
            type: 'restaurant',
            title: '燒肉さかえや',
            rating: 4.2,
            price: 'NT$ 1,200 / 人',
            imageUrl: 'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=800',
            actions: [
                { label: '查看詳情', url: 'https://www.google.com/maps/place/Yakiniku+Sakaeya/@36.93705,138.5193099,11z/data=!4m6!3m5!1s0x601e023aeb29086d:0x607e4cf5fcac68d7!8m2!3d36.9372269!4d138.8109907!16s%2Fg%2F1tkf11f3?entry=tts&g_ep=EgoyMDI1MTIwOC4wIPu8ASoASAFQAw%3D%3D&skid=e9aec243-5bdb-4431-9059-9ed103ea5390' }
            ]
        });
    }

    // Always include a flight recommendation if we're going to Japan
    if (allText.includes("日本") || allText.includes("東京")) {
        summary.bookingCards.push({
            type: 'flight',
            title: '台北 (TPE) ⇌ 東京 (NRT) 來回機票',
            rating: 0, // Flights don't necessarily have ratings in this context
            price: 'NT$ 7,887 起',
            imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop',
            actions: [
                { label: '查看航班', url: 'https://travel.line.me/flights/list?roundType=1&cabinClass=1&numOfAdult=1&numOfChildren=0&numOfBaby=0&linePointsRebateOnly=1&departureAirports=&departureCities=TPE&departureDates=1772668800000&arrivalAirports=&arrivalCities=TYO&departureAirports=&departureCities=TYO&departureDates=1773273600000&arrivalAirports=&arrivalCities=TPE' }
            ]
        });
    }

    // Fallback defaults if no keywords matched
    if (summary.confirmedItinerary.length === 0) {
        summary.confirmedItinerary.push("尚未確認具體行程");
    }
    if (summary.pendingItems.length === 0) {
        summary.pendingItems.push("無特別待定事項");
    }

    // Determine budget based on mentions
    if (allText.includes("省錢")) {
        summary.estimatedBudget = "TWD 30,000 / 人 (小資方案)";
    } else {
        summary.estimatedBudget = "TWD 45,000 - 60,000 / 人 (依實際住宿為準)";
    }

    return summary;
}
