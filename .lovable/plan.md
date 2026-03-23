

# CardeX - Major Feature Update

Comprehensive update adding internal navigation, sub-pages, and UI enhancements across the entire app.

## Overview

11 changes spanning navigation architecture, 5 new pages, and updates to 6 existing files. The core change is expanding the Page type to include sub-pages and threading an `onNavigate` callback through all page components.

---

## Architecture Change: Navigation

**File: `src/pages/Index.tsx`**
- Expand `Page` type to include: `"home" | "index" | "scanner" | "trade" | "profile" | "settings" | "card-library" | "graded-library" | "trades-history" | "wishlist"`
- Replace `MarketPage` import with `IndexPage`
- Add imports for all 5 new sub-pages
- Pass `onNavigate` prop to all page components
- Sub-pages render with a back button that calls `onNavigate` to return to parent

## File Changes

### 1. `src/components/cardex/BottomNav.tsx`
- Rename "Market" label to "Index"
- Replace cart icon SVG with magnifying glass/search SVG

### 2. `src/components/cardex/pages/IndexPage.tsx` (NEW)
- Replaces MarketPage in the bottom nav
- Header: "INDEX" / "Card Search"
- Large search input, empty initial state (no default charizard query)
- Category pills: Pokemon | MTG | Yu-Gi-Oh | Sports | One Piece
- Uses `usePokemonCards`/`useScryfallCards` when user types 2+ chars
- Grid results with real images, prices
- ML section below for Pokemon category
- Reuses tile components from MarketPage (extract shared components or duplicate)

### 3. `src/components/cardex/pages/HomePage.tsx`
- Accept `onNavigate` prop
- Remove "View All" button
- Hero card becomes clickable -> `onNavigate("card-library")`
- Replace "View All" with "Wishlist" button -> `onNavigate("wishlist")`
- Use `useFeaturedPokemonCards()` for Recent Collection with real images
- Remove static items (Blue-Eyes, Black Lotus)

### 4. `src/components/cardex/pages/ProfilePage.tsx`
- Accept `onNavigate` prop
- Stats: rename "Collections" to "Wishlist"
- Each stat card clickable with `cursor:pointer` and `>` arrow:
  - Total Cards -> `card-library`
  - Graded Cards -> `graded-library`
  - Wishlist -> `wishlist`
  - Trades Done -> `trades-history`
- Settings row click -> `onNavigate("settings")`

### 5. `src/components/cardex/pages/SettingsPage.tsx` (NEW)
- Back button -> `onNavigate("profile")`
- Language selector: EN | ES | PT (localStorage `cardex-lang`)
- Toggle rows: Notification Preferences, Display & Theme, Privacy & Security, Data Export, Help & Support
- CardeX design system styling throughout

### 6. `src/components/cardex/pages/CardLibraryPage.tsx` (NEW)
- Back button -> `onNavigate("profile")`
- Uses `usePokemonCards("charizard")` or similar to show collection
- Each row: thumbnail, name, set, USD/EUR price
- Skeleton loading states

### 7. `src/components/cardex/pages/GradedLibraryPage.tsx` (NEW)
- Back button -> `onNavigate("profile")`
- Shows graded cards (mock filter or API query for graded cards)
- Each card shows grade badge (PSA/BGS), thumbnail, prices

### 8. `src/components/cardex/pages/TradesHistoryPage.tsx` (NEW)
- Back button -> `onNavigate("profile")`
- Mock trade history data with dates, cards traded, result (favorable/unfavorable), value differences

### 9. `src/components/cardex/pages/WishlistPage.tsx` (NEW)
- Back button -> `onNavigate("home")`
- Uses `usePokemonCards` for real card images
- "+ Add to Wishlist" button
- List of desired cards with thumbnails and prices

### 10. `src/components/cardex/pages/TradePage.tsx`
- Accept `onNavigate` prop
- "Propose Trade" button opens a confirmation modal/overlay
- Modal shows: your card vs their card, value difference, verdict
- "Confirm Trade" and "Cancel" buttons
- Success state: "Trade Proposed!" message with checkmark

### 11. `src/components/cardex/pages/ScannerPage.tsx`
- Accept `onNavigate` prop
- Add LiDAR toggle at top next to title
- When ON: scanner border glows bright green (intense box-shadow), "LIDAR ACTIVE" label
- When OFF: current normal state
- Visual toggle with green color when active

---

## Technical Details

- All sub-pages share a reusable back button pattern (arrow + label, calls `onNavigate`)
- `Page` type union expanded in Index.tsx, BottomNav type stays as 5 main tabs
- Bottom nav `active` prop maps sub-pages to parent tab (e.g. "settings" highlights "profile")
- No routing changes needed - all navigation is state-driven within the phone shell
- IndexPage will largely mirror MarketPage's tile components but with empty initial state
- Trade modal uses absolute positioning within the phone shell

