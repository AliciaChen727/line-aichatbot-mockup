import type { ChatMessage, ParsedSummary, BookingCard } from '../../components/Summarizer';

// --- 2. 記憶管理規格 (Memory Interface - Mem0 Based) ---
export const mem0Mock = {
    userLevel: {
        "u1": { allergies: ["sashimi"], budget_flexibility: "low" },
        "u2": { interests: ["skiing", "luxury_spa"] },
        "u3": { interests: ["yakiniku", "wagyu"] },
        "me": { interests: ["sightseeing", "mt_fuji"] }
    },
    groupLevel: {
        "Group_Japan_2026": {
            status: "planning",
            consensus_score: 0.6,
            conflicts: [] as string[]
        }
    }
};

// --- 3. 工具定義 (Tools / Functions Definition) ---
export const AgentTools = {
    search_travel_inventory: (query: string, filters: any): BookingCard[] => {
        const results: BookingCard[] = [];

        if (query.includes("機票")) {
            results.push({
                type: 'flight', title: '台北 (TPE) ⇌ 東京 (NRT) 來回機票', rating: 0, price: 'NT$ 7,887 起',
                imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop',
                actions: [{ label: '查看航班', url: 'https://travel.line.me/flights' }],
                linePointsReward: 2
            });
        }

        if (query.includes("越後湯澤") || query.includes("滑雪")) {
            results.push(
                {
                    type: 'hotel', title: '松泉閤花月 (Shosenkaku Kagetsu)', rating: 4.6, price: 'NT$ 7,495 / 晚',
                    imageUrl: '/shosenkaku_kagetsu.jpg',
                    actions: [{ label: '查看詳情', url: 'https://travel.line.me/hotels' }, { label: '立即預訂', url: 'https://travel.line.me/hotels' }],
                    linePointsReward: 8
                },
                {
                    type: 'experience', title: '湯澤滑雪場中文私人滑雪課程', rating: 5.0, price: '3小時NT$ 13,750起',
                    imageUrl: 'https://images.pexels.com/photos/848682/pexels-photo-848682.jpeg?auto=compress&cs=tinysrgb&w=800',
                    actions: [{ label: '看體驗', url: 'https://travel.line.me/experiences' }],
                    linePointsReward: 5
                }
            );
        }

        if (query.includes("富士山") || query.includes("河口湖")) {
            results.push(
                {
                    type: 'hotel', title: 'cottage Di MUSiCA', rating: 4.5, price: 'NT$ 4,263 / 晚',
                    imageUrl: '/cottage_di_musica.jpg',
                    actions: [{ label: '查看詳情', url: 'https://travel.line.me/hotels' }, { label: '立即預訂', url: 'https://travel.line.me/hotels' }],
                    linePointsReward: 5
                },
                {
                    type: 'experience', title: '富士山・河口湖美景觀光 自行車租借河口湖巡游', rating: 4.8, price: 'NT$ 301 起',
                    imageUrl: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800',
                    actions: [{ label: '查看詳情', url: 'https://travel.line.me/experiences' }],
                    linePointsReward: 9
                }
            );
        }

        if (query.includes("燒肉")) {
            results.push({
                type: 'restaurant', title: '燒肉さかえや', rating: 4.2, price: 'NT$ 1,200 / 人',
                imageUrl: 'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=800',
                actions: [{ label: '查看詳情', url: 'https://travel.line.me/restaurants' }]
            });
        }

        if (query.includes("交通") || query.includes("分流")) {
            results.push({
                type: 'experience', title: 'JR 東京廣域周遊券', rating: 0, price: 'TWD 3,110',
                imageUrl: '/twp_new.jpg',
                actions: [{ label: '查看詳情', url: 'https://travel.line.me/experiences' }, { label: '立即預訂', url: 'https://travel.line.me/experiences' }],
                linePointsReward: 0.5
            });
        }

        return results;
    },

    update_group_memory: (factType: string, content: any) => {
        console.log(`[Mem0] Updating group memory config: ${factType}`, content);
        if (factType === "conflict") {
            mem0Mock.groupLevel.Group_Japan_2026.conflicts.push(content);
            mem0Mock.groupLevel.Group_Japan_2026.consensus_score -= 0.2;
        }
    },

    generate_flex_message: (templateId: string, data: Partial<ParsedSummary>): ParsedSummary => {
        // Fallbacks
        const defaultSummary: ParsedSummary = {
            confirmedItinerary: [],
            estimatedBudget: "目前資訊不足",
            pendingItems: [],
            bookingCards: [],
            conflictResolutionDraft: undefined
        };
        return { ...defaultSummary, ...data };
    },

    sync_to_line_calendar: (eventDetails: any) => {
        console.log("[Calendar] Syncing event...", eventDetails);
        return true;
    }
};

// --- 4. 決策編排邏輯 (Orchestration Logic Flow) ---
export async function processGroupChat(messages: ChatMessage[]): Promise<ParsedSummary> {
    const allText = messages.map(m => m.text.toLowerCase()).join(" ");

    // Step 1 & 2: Intent Classification & Conflict Detection
    const baseSummary: Partial<ParsedSummary> = {
        confirmedItinerary: [],
        pendingItems: [],
        bookingCards: [],
        estimatedBudget: "TWD 45,000 - 60,000 / 人 (依實際住宿為準)"
    };

    let hasConflict = false;

    // Simulate Agent parsing individual preferences via keywords
    if (allText.includes("越後湯澤") || allText.includes("滑雪")) {
        baseSummary.confirmedItinerary!.push("越後湯澤滑雪行程");
        baseSummary.bookingCards!.push(...AgentTools.search_travel_inventory("越後湯澤", {}));
    }

    if (allText.includes("富士山") || allText.includes("河口湖")) {
        baseSummary.confirmedItinerary!.push("河口湖看富士山");
        baseSummary.bookingCards!.push(...AgentTools.search_travel_inventory("富士山", {}));
    }

    if (allText.includes("燒肉") || allText.includes("和牛")) {
        baseSummary.pendingItems!.push("晚餐找燒肉餐廳");
        baseSummary.bookingCards!.push(...AgentTools.search_travel_inventory("燒肉", {}));
    }

    // Agent observes conflicts
    if (baseSummary.confirmedItinerary!.includes("越後湯澤滑雪行程") && baseSummary.confirmedItinerary!.includes("河口湖看富士山")) {
        hasConflict = true;
        AgentTools.update_group_memory("conflict", "skiing (North) vs mt_fuji (South)");
        baseSummary.pendingItems!.push("行程衝突：越後湯澤與河口湖距離較遠，需協調時間或分頭行動");
    }

    // Common flights
    if (allText.includes("日本") || allText.includes("東京")) {
        baseSummary.bookingCards!.unshift(...AgentTools.search_travel_inventory("機票", {}));
    }

    // Step 3: Generation Strategy
    if (hasConflict) {
        // Case B: Low Consensus -> Generate split group proposal
        baseSummary.bookingCards!.push(...AgentTools.search_travel_inventory("交通 分流", {}));
        baseSummary.conflictResolutionDraft = {
            reason: "偵測到行程分歧！由於越後湯澤（新潟）與河口湖（山梨）分處東京的一北一南，建議以東京為核心，規劃V字型放射狀行程。推薦使用 「JR東京廣域周遊券」，一張票即可輕鬆搞定新幹線與特急列車的高昂交通費。\\n\\nDay 1-2越後湯澤：直奔越後湯澤，早晨分頭行動，一組人由專車接送至滑雪場享受粉雪，另一組則在越後湯澤車站悠閒逛街、品嚐清酒，晚上再聚首大啖暖心燒肉。\\nDay3河口湖：返回東京並轉乘直達河口湖，與壯麗的富士山相遇。\\nDay4東京市區：重返東京市區，享受最後的購物衝刺。分進合擊的完美安排，讓滑雪愛好者與觀光族都能盡興而歸！"
        };
    } else {
        // Case A: High Consensus
        if (baseSummary.confirmedItinerary!.length === 0) {
            baseSummary.confirmedItinerary!.push("尚未確認具體行程");
        }
        if (baseSummary.pendingItems!.length === 0) {
            baseSummary.pendingItems!.push("無特別待定事項");
        }
    }

    return AgentTools.generate_flex_message("group_consensus_card", baseSummary);
}

