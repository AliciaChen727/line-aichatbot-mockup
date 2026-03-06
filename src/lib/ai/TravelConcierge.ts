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
                type: 'flight', title: '台北 (TPE) ⇌ 東京 (NRT) 來回機票', rating: 0, price: 'NT$ 7,858 起',
                imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop',
                actions: [{ label: '查看航班', url: 'https://travel.line.me/flights/list?roundType=1&cabinClass=1&numOfAdult=1&numOfChildren=0&numOfBaby=0&linePointsRebateOnly=1&departureAirports=&departureCities=TPE&departureDates=1773360000000&arrivalAirports=&arrivalCities=TYO&departureAirports=&departureCities=TYO&departureDates=1773964800000&arrivalAirports=&arrivalCities=TPE' }],
                linePointsReward: 3
            });
        }

        if (query.includes("越後湯澤") || query.includes("滑雪")) {
            results.push(
                {
                    type: 'experience', title: '越後湯澤車站', rating: 4.8, price: '',
                    imageUrl: '/echigo_yuzawa.jpg',
                    actions: [{ label: '查看詳情', url: 'https://travel.line.me/poi/5ed7da59fa3c974c9401b9b2?liff.referrer=https%3A%2F%2Ftravel.line.me%2F' }]
                },
                {
                    type: 'hotel', title: '松泉閤花月 (Shosenkaku Kagetsu)', rating: 4.6, price: 'NT$ 7,495 / 晚',
                    imageUrl: '/shosenkaku_kagetsu.jpg',
                    actions: [{ label: '查看詳情', url: 'https://www.klook.com/zh-TW/hotels/detail/558686-shosenkaku-kagetsu/?spm=SearchResult.SearchResult_LIST&clickId=93be432246' }, { label: '立即預訂', url: 'https://www.klook.com/zh-TW/hotels/detail/558686-shosenkaku-kagetsu/?spm=SearchResult.SearchResult_LIST&clickId=93be432246' }],
                    linePointsReward: 8
                },
                {
                    type: 'experience', title: '湯澤滑雪場中文私人滑雪課程', rating: 5.0, price: '3小時NT$ 13,750起',
                    imageUrl: 'https://images.pexels.com/photos/848682/pexels-photo-848682.jpeg?auto=compress&cs=tinysrgb&w=800',
                    actions: [{ label: '看體驗', url: 'https://travel.line.me/experiences/list?keyword=%E6%B9%AF%E6%BE%A4%E6%BB%91%E9%9B%AA%E5%A0%B4%E4%B8%AD%E6%96%87%E7%A7%81%E4%BA%BA%E6%BB%91%E9%9B%AA%E8%AA%B2%E7%A8%8B' }, { label: '立即預訂', url: 'https://www.klook.com/zh-TW/activity/128393-echigo-yuzawa-ski-lesson/?ad_feed_id=560&aid=api%7C13179%7CpQ9U5JhPlA&openExternalBrowser=1&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=13179&utm_term=' }],
                    linePointsReward: 5
                }
            );
        }

        if (query.includes("富士山") || query.includes("河口湖")) {
            results.push(
                {
                    type: 'hotel', title: 'cottage Di MUSiCA', rating: 4.5, price: 'NT$ 7,179 / 晚',
                    imageUrl: '/cottage_di_musica.jpg',
                    actions: [{ label: '查看詳情', url: 'https://travel.line.me/hotels/61f5353c6452b9154cd7e06e?checkinDate=2026-03-13&checkoutDate=2026-03-14&numOfAdult=2&numOfChildren=0&numOfRoom=1' }, { label: '立即預訂', url: 'https://www.booking.com/hotel/jp/di-musica.html?aid=1535049&label=cuSbpNO3Wb&cid=line&openExternalBrowser=1&chal_t=1772786398808&force_referer=https%3A%2F%2Ftravel.line.me%2F' }],
                    linePointsReward: 3
                },
                {
                    type: 'experience', title: '富士山・河口湖美景觀光 自行車租借河口湖巡游', rating: 4.8, price: 'NT$ 301 起',
                    imageUrl: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800',
                    actions: [{ label: '查看詳情', url: 'https://travel.line.me/experiences/list?keyword=%E5%AF%8C%E5%A3%AB%E5%B1%B1%E3%83%BB%E6%B2%B3%E5%8F%A3%E6%B9%96%E7%BE%8E%E6%99%AF%E8%A7%80%E5%85%89+%E8%87%AA%E8%A1%8C%E8%BB%8A%E7%A7%9F%E5%80%9F%E6%B2%B3%E5%8F%A3%E6%B9%96%E5%B7%A1%E6%B8%B8' }, { label: '立即預訂', url: 'https://www.klook.com/zh-TW/activity/174871-mt-fuji-rental-bike-at-lake-kawaguchi/?ad_feed_id=560&aid=api%7C13179%7CILf7zGfJpx&openExternalBrowser=1&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=13179&utm_term=' }],
                    linePointsReward: 9
                }
            );
        }

        if (query.includes("燒肉")) {
            results.push({
                type: 'restaurant', title: '燒肉さかえや', rating: 4.2, price: 'NT$ 1,200 / 人',
                imageUrl: 'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=800',
                actions: [{ label: '查看詳情', url: 'https://www.google.com/maps?sca_esv=24e12ee2c444327b&rlz=1C5CHFA_enTW1031TW1031&output=search&q=%E7%87%92%E8%82%89%E3%81%95%E3%81%8B%E3%81%88%E3%82%84+google+map&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpUrv6YeyJhXfuYqj4Fj6c1Tg5t_ufWNUvD2V-uX26AFmzd3PgOqQPiZGQbkKtfgZKbvRjqymWX6R2FJ9Zpl8YIzWBe3FGN3hnfYgkxmoQ4QaBhVlbm-tF5GsIWSWz-92DuwziCG5EK_QZ1HE0r3jbhqD4WZR1MBiBiN47-GAZzb4Q2akc9ubvF0nUIG3cD7hTgNpx8Q&entry=mc&ved=1t:200715&ictx=111' }]
            });
        }

        if (query.includes("交通") || query.includes("分流")) {
            results.push({
                type: 'experience', title: 'JR 東京廣域周遊券', rating: 0, price: 'TWD 3,135',
                imageUrl: '/twp_new.jpg',
                actions: [{ label: '查看詳情', url: 'https://travel.line.me/experiences/list?keyword=JR+%E6%9D%B1%E4%BA%AC%E5%BB%A3%E5%9F%9F%E5%91%A8%E9%81%8A%E5%88%B8&id=658c65b178f6130007ec29a1' }, { label: '立即預訂', url: 'https://www.kkday.com/zh-tw/product/158964?ud1=I1FEx89mK3&cid=5954&openExternalBrowser=1' }],
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
        baseSummary.bookingCards!.push(...AgentTools.search_travel_inventory("機票", {}));
        baseSummary.bookingCards!.push({
            type: 'hotel', title: '新宿西鐵酒店', rating: 4.8, price: 'NT$ 4,959 / 晚',
            imageUrl: '/nishitetsu_inn.jpg',
            actions: [{ label: '查看詳情', url: 'https://travel.line.me/hotels/61f5349a6452b9154cd625c2?checkinDate=2026-03-11&checkoutDate=2026-03-12&numOfAdult=2&numOfChildren=0&numOfRoom=1' }, { label: '立即預訂', url: 'https://www.agoda.com/zh-tw/nishitetsu-inn-shinjuku/hotel/tokyo-jp.html?cid=1807871&currency=TWD&checkin=2026-03-11&checkout=2026-03-12&numberofchildren=0&mcid=27938&masterroomid=3135656&tag=DV968VSPaZ&hid=234458&adults=2&rooms=1&los=1&pslc=1&ds=pkRigr9ki4sp2GDW' }],
            linePointsReward: 8
        });
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

    // Deduplicate booking cards by title to avoid duplicates if multiple intents triggered
    const uniqueCardsMap = new Map();
    baseSummary.bookingCards!.forEach(card => uniqueCardsMap.set(card.title, card));
    baseSummary.bookingCards = Array.from(uniqueCardsMap.values());

    // User requested explicit sort order
    const exactOrder = [
        "台北 (TPE) ⇌ 東京 (NRT) 來回機票",
        "JR 東京廣域周遊券",
        "越後湯澤車站",
        "松泉閤花月 (Shosenkaku Kagetsu)",
        "cottage Di MUSiCA",
        "新宿西鐵酒店",
        "湯澤滑雪場中文私人滑雪課程",
        "燒肉さかえや",
        "富士山・河口湖美景觀光 自行車租借河口湖巡游"
    ];

    baseSummary.bookingCards.sort((a, b) => {
        const indexA = exactOrder.indexOf(a.title);
        const indexB = exactOrder.indexOf(b.title);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // General Fallback Sorting Rule (Flight > Transport > Hotel > Experience/Restaurant)
        const getTypeWeight = (card: BookingCard) => {
            if (card.type === 'flight') return 1;
            if (card.title.includes('周遊券') || card.title.includes('車票') || card.title.includes('交通')) return 2;
            if (card.type === 'hotel') return 3;
            return 4; // experience or restaurant
        };

        const typeA = getTypeWeight(a);
        const typeB = getTypeWeight(b);
        if (typeA !== typeB) return typeA - typeB;

        // General Fallback Geography Rule: Yuzawa -> Fuji -> Tokyo
        const getLocWeight = (title: string) => {
            if (title.includes("湯澤") || title.includes("新潟") || title.includes("滑雪")) return 1;
            if (title.includes("富士") || title.includes("河口湖")) return 2;
            if (title.includes("東京") || title.includes("新宿")) return 3;
            return 4;
        };
        return getLocWeight(a.title) - getLocWeight(b.title);
    });

    return AgentTools.generate_flex_message("group_consensus_card", baseSummary);
}

