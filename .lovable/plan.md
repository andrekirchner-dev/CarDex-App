

# Fix Card Thumbnail in Recent Collection

## Problem
Line 35-36: The thumbnail wrapper is `width:38, height:38` (square) with `objectFit:"cover"`, which crops the card image.

## Change — `src/components/cardex/pages/HomePage.tsx`

**PokemonCardRow** (line 35-36): Change the thumbnail container from a fixed 38x38 square to a portrait ratio (~45w x 63h, which is 5:7 ≈ 2.5:3.5) and use `object-contain`:
- Container: `width:45, height:63, borderRadius:6` (remove `overflow-hidden` is fine to keep)
- Image: `objectFit:"contain"` instead of `"cover"`

**CardRowSkeleton** (line 15): Update skeleton to match new dimensions: `width:45, height:63, borderRadius:6`

No other changes needed.

