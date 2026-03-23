

# CardeX — Multi-Game Search, Card Detail Modal & Price Charts

## Summary
Add Yu-Gi-Oh, One Piece, and Lorcana game support with real APIs, expand IndexPage tabs, and create a full card detail modal with price charts using recharts.

## Files to Change

### 1. `src/lib/api.ts`
- Add `YuGiOhCard` interface + `searchYuGiOhCards()` using YGOPRODeck API
- Add `OnePieceCard` and `LorcanaCard` type aliases extending `CardMarketTCGCard`
- Add `searchOnePieceCards()` using CardMarket with game `"one-piece"`
- Add `searchLorcanaCards()` using CardMarket with game `"lorcana"`
- Add `generatePriceHistory(currentPrice)` utility returning 12-month mock data
- Expand `searchCardMarketCards` game param type to include `"one-piece"`

### 2. `src/hooks/useCardSearch.ts`
- Import new types and functions
- Add `useYuGiOhCards(query)`, `useOnePieceCards(query)`, `useLorcanaCards(query)` hooks

### 3. `src/components/cardex/CardDetailModal.tsx` (NEW)
- `UnifiedCard` interface with id, name, images, game, set, rarity, prices, priceHistory
- Full-screen modal overlay (black/90, backdrop-blur) with slide-up animation
- Sections: card image, info, market prices grid, 12-month recharts LineChart, grading estimates with PSA population
- Close button, external PSA Registry link

### 4. `src/components/cardex/pages/IndexPage.tsx`
- New tab order: `["Pokémon", "MTG", "One Piece", "Lorcana", "Yu-Gi-Oh", "Sports"]`
- Wire One Piece/Lorcana tabs to CardMarket hooks, Yu-Gi-Oh to YGOPRODeck hook
- Add `SPORTS_CARDS` static data array with 8 items (always visible when Sports selected)
- New tile components: `YuGiOhTile`, `CardMarketGameTile`, `SportsTile`
- Add `selectedCard` state + normalize card data to `UnifiedCard` on click
- Render `<CardDetailModal>` when card selected
- All tiles become clickable with `onClick` to open detail modal

## Technical Notes
- `searchCardMarketCards` game type union needs `"one-piece"` added
- Sports tab shows static cards immediately (no search required)
- Yu-Gi-Oh tile uses `card_images[0].image_url_small` for thumbnail
- Price history generated via `generatePriceHistory()` from the card's primary price
- Modal uses `useEffect` + animation class for slide-up entrance
- recharts `LineChart` with amber stroke, dark theme, 160px height

