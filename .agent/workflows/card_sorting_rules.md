---
description: How to sort booking cards in the AI summary recommendation list
---
For all future updates regarding the AI travel assistant recommended booking cards (資訊圖卡), follow this strict sorting order:

1. **Category Order**: 
   機票 (Flight) -> 交通 (Transportation) -> 住宿 (Hotel) -> 體驗/餐廳 (Experience/Restaurant)
2. **Geographical/Itinerary Order**:
   Within each category, order the locations chronologically according to the AI's suggested itinerary. For the default Japan trip, this is:
   越後湯澤 (North/First) -> 富士山河口湖 (South/Second) -> 東京市區 (Center/Last)

**Expected Default Order Implementation:**
1. 台北 (TPE) ⇌ 東京 (NRT) 來回機票
2. JR 東京廣域周遊券
3. 越後湯澤車站
4. 松泉閤花月 (Shosenkaku Kagetsu)
5. cottage Di MUSiCA
6. 新宿西鐵酒店
7. 湯澤滑雪場中文私人滑雪課程
8. 燒肉さかえや
9. 富士山・河口湖美景觀光 自行車租借河口湖巡游

*Note: This specific order and logic is implemented in `src/lib/ai/TravelConcierge.ts` before `generate_flex_message`.*
