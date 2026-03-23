// ============================================================
// CarDex – Hooks de Busca de Cartas
// ============================================================
// Usa TanStack Query (já instalado) para:
//   ✅ Cache automático (5 min stale, 30 min em memória)
//   ✅ Deduplicação de requests idênticos
//   ✅ Retry automático em erros de rede
//   ✅ Loading / error states prontos para usar
// ============================================================

import { useQuery } from "@tanstack/react-query";
import {
  searchPokemonCards,
  searchMTGCards,
  searchTCGDexCards,
  searchPriceCharting,
  getFeaturedPokemonCards,
  type PokemonCard,
  type MTGCard,
  type TCGDexCard,
} from "@/lib/api";
import { useDebounce } from "./useDebounce";

// ──────────────────────────────────────────────────────────────
// CONFIG DE CACHE
// ──────────────────────────────────────────────────────────────
const STALE_TIME = 5 * 60 * 1_000;   // 5 min → não refaz request
const GC_TIME    = 30 * 60 * 1_000;  // 30 min → mantém em memória

// ──────────────────────────────────────────────────────────────
// POKEMON TCG
// ──────────────────────────────────────────────────────────────

/** Busca cartas Pokémon por nome (com debounce de 400ms) */
export function usePokemonCards(query: string) {
  const q = useDebounce(query.trim(), 400);

  return useQuery<PokemonCard[]>({
    queryKey: ["pokemon", "search", q],
    queryFn: () => searchPokemonCards(q),
    enabled: q.length >= 2,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
}

/** Cartas em destaque para a HomePage (Charizard por padrão) */
export function useFeaturedPokemonCards() {
  return useQuery<PokemonCard[]>({
    queryKey: ["pokemon", "featured"],
    queryFn: getFeaturedPokemonCards,
    staleTime: 15 * 60 * 1_000, // 15 min – muda pouco
    gcTime: 60 * 60 * 1_000,
    retry: 2,
  });
}

// ──────────────────────────────────────────────────────────────
// MAGIC: THE GATHERING
// ──────────────────────────────────────────────────────────────

/** Busca cartas MTG por nome (com debounce de 400ms) */
export function useMTGCards(query: string) {
  const q = useDebounce(query.trim(), 400);

  return useQuery<MTGCard[]>({
    queryKey: ["mtg", "search", q],
    queryFn: () => searchMTGCards(q),
    enabled: q.length >= 2,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
}

// ──────────────────────────────────────────────────────────────
// TCGDEX
// ──────────────────────────────────────────────────────────────

/** Busca cartas via TCGDex (com debounce de 400ms) */
export function useTCGDexCards(query: string) {
  const q = useDebounce(query.trim(), 400);

  return useQuery<TCGDexCard[]>({
    queryKey: ["tcgdex", "search", q],
    queryFn: () => searchTCGDexCards(q),
    enabled: q.length >= 2,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
}

// ──────────────────────────────────────────────────────────────
// PRICECHARTING
// ──────────────────────────────────────────────────────────────

/** Busca preços reais no PriceCharting (requer VITE_PRICECHARTING_API_KEY) */
export function usePriceCharting(query: string) {
  const q = useDebounce(query.trim(), 500);

  return useQuery({
    queryKey: ["pricecharting", q],
    queryFn: () => searchPriceCharting(q),
    enabled: q.length >= 2,
    staleTime: 10 * 60 * 1_000, // preços mudam menos
    gcTime: GC_TIME,
    retry: 1,
  });
}

// ──────────────────────────────────────────────────────────────
// HOOK UNIFICADO DE MERCADO
// ──────────────────────────────────────────────────────────────

export type MarketCategory = "All" | "Pokémon" | "Yu-Gi-Oh" | "MTG" | "Sports" | "One Piece";

/**
 * Hook principal do MarketPage.
 * Seleciona a API correta de acordo com a categoria ativa.
 */
export function useMarketSearch(query: string, category: MarketCategory) {
  const q = query.trim();

  // Pokémon TCG → ativo para "All", "Pokémon" e "One Piece" (via TCGDex)
  const isPokemon = category === "All" || category === "Pokémon";
  const isMTG = category === "MTG";
  const isOnepiece = category === "One Piece";

  const pokemonResult = usePokemonCards(isPokemon && q.length >= 2 ? q : "");
  const mtgResult = useMTGCards(isMTG && q.length >= 2 ? q : "");
  const tcgdexResult = useTCGDexCards(isOnepiece && q.length >= 2 ? q : "");

  return { pokemonResult, mtgResult, tcgdexResult };
}
