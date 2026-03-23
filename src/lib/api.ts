// ============================================================
// CarDex – API Service Layer
// ============================================================
// APIs integradas:
//   🟡 Pokémon TCG    – pokemontcg.io        (grátis, key opcional)
//   🟣 Scryfall       – scryfall.com/docs/api (grátis, sem key – MTG)
//   🟢 TCGDex         – tcgdex.net            (grátis, sem key)
//   🇧🇷 Mercado Livre  – mercadolibre.com      (grátis, sem key)
//   🔵 PokeTrace      – poketrace.com         (grátis 250/dia, key opcional)
// ============================================================

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────

export interface PokemonCard {
  id: string;
  name: string;
  images: { small: string; large: string };
  set: { name: string; series: string };
  rarity?: string;
  cardmarket?: {
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
    };
  };
  tcgplayer?: {
    prices?: {
      holofoil?: { market?: number };
      normal?: { market?: number };
      reverseHolofoil?: { market?: number };
    };
  };
}

export interface ScryfallCard {
  id: string;
  name: string;
  set_name: string;
  set: string;
  rarity: string;
  image_uris?: { small: string; normal: string; large: string };
  card_faces?: Array<{ image_uris?: { small: string; normal: string } }>;
  prices: {
    usd?: string | null;
    usd_foil?: string | null;
    eur?: string | null;
    eur_foil?: string | null;
  };
  purchase_uris?: { tcgplayer?: string; cardmarket?: string };
}

export interface TCGDexCard {
  id: string;
  localId: string;
  name: string;
  image?: string;
  set?: { name: string; id: string };
  rarity?: string;
}

export interface MercadoLivreItem {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  condition: string;
  thumbnail: string;
  permalink: string;
  seller: { id: number; nickname?: string };
}

export interface MercadoLivreResponse {
  results: MercadoLivreItem[];
  paging: { total: number };
}

export interface PokeTraceCard {
  id: string;
  name: string;
  set: string;
  number: string;
  image?: string;
  tcgplayer?: { market?: number; low?: number };
  ebay?: { sold?: number; recent?: number };
  cardmarket?: { trend?: number; low?: number };
}

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────

async function safeFetch<T>(url: string, label: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`[${label}] HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export function getPokemonPrice(card: PokemonCard): { usd: number | null; eur: number | null } {
  const usd =
    card.tcgplayer?.prices?.holofoil?.market ??
    card.tcgplayer?.prices?.normal?.market ??
    card.tcgplayer?.prices?.reverseHolofoil?.market ??
    null;
  const eur =
    card.cardmarket?.prices?.averageSellPrice ??
    card.cardmarket?.prices?.trendPrice ??
    null;
  return { usd, eur };
}

export function getScryfallImage(card: ScryfallCard): string | undefined {
  return (
    card.image_uris?.small ??
    card.card_faces?.[0]?.image_uris?.small
  );
}

export function formatUSD(v: number | null | undefined) {
  return v != null ? `$${v.toFixed(2)}` : null;
}
export function formatEUR(v: number | null | undefined) {
  return v != null ? `€${v.toFixed(2)}` : null;
}
export function formatBRL(v: number | null | undefined) {
  return v != null ? `R$${v.toFixed(2)}` : null;
}

// ──────────────────────────────────────────────────────────────
// POKÉMON TCG  (https://api.pokemontcg.io/v2)
// Preços: USD via TCGPlayer · EUR via CardMarket
// ──────────────────────────────────────────────────────────────

const POKEMON_BASE   = "https://api.pokemontcg.io/v2";
const POKEMON_FIELDS = "id,name,images,set,rarity,cardmarket,tcgplayer";

export async function searchPokemonCards(query: string, pageSize = 20): Promise<PokemonCard[]> {
  const apiKey = import.meta.env.VITE_POKEMON_TCG_API_KEY;
  const headers: Record<string, string> = apiKey ? { "X-Api-Key": apiKey } : {};
  const url = `${POKEMON_BASE}/cards?q=name:*${encodeURIComponent(query)}*&pageSize=${pageSize}&select=${POKEMON_FIELDS}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`[PokémonTCG] HTTP ${res.status}`);
  const data = await res.json();
  return (data.data ?? []) as PokemonCard[];
}

export async function getFeaturedPokemonCards(): Promise<PokemonCard[]> {
  return searchPokemonCards("charizard", 6);
}

// ──────────────────────────────────────────────────────────────
// SCRYFALL  (https://scryfall.com/docs/api)
// Substitui magicthegathering.io — grátis, sem key
// Preços: USD via TCGPlayer · EUR via CardMarket (1x/dia)
// ──────────────────────────────────────────────────────────────

const SCRYFALL_BASE = "https://api.scryfall.com";

export async function searchScryfallCards(query: string, pageSize = 20): Promise<ScryfallCard[]> {
  const q = encodeURIComponent(query);
  const data = await safeFetch<{ data: ScryfallCard[]; has_more: boolean }>(
    `${SCRYFALL_BASE}/cards/search?q=${q}&unique=cards&order=usd&page=1`,
    "Scryfall"
  );
  return (data.data ?? []).slice(0, pageSize);
}

export async function getScryfallCardByName(name: string): Promise<ScryfallCard | null> {
  try {
    return await safeFetch<ScryfallCard>(
      `${SCRYFALL_BASE}/cards/named?fuzzy=${encodeURIComponent(name)}`,
      "Scryfall"
    );
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────────────────────
// TCGDEX  (https://api.tcgdex.net/v2)
// ──────────────────────────────────────────────────────────────

const TCGDEX_BASE = "https://api.tcgdex.net/v2/en";

export async function searchTCGDexCards(query: string): Promise<TCGDexCard[]> {
  const data = await safeFetch<TCGDexCard[]>(
    `${TCGDEX_BASE}/cards?name=${encodeURIComponent(query)}`,
    "TCGDex"
  );
  return Array.isArray(data) ? data.slice(0, 20) : [];
}

// ──────────────────────────────────────────────────────────────
// MERCADO LIVRE  (https://developers.mercadolivre.com.br)
// 🇧🇷  Preços em BRL — endpoint público, sem autenticação
// Site MLB = Brasil · MLA = Argentina · MLM = México
// ──────────────────────────────────────────────────────────────

const ML_BASE = "https://api.mercadolibre.com";

export async function searchMercadoLivre(
  query: string,
  limit = 10
): Promise<MercadoLivreItem[]> {
  const data = await safeFetch<MercadoLivreResponse>(
    `${ML_BASE}/sites/MLB/search?q=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`,
    "MercadoLivre"
  );
  return data.results ?? [];
}

/**
 * Calcula estatísticas de preço BRL a partir dos resultados do ML.
 * Remove outliers grosseiros (itens 10x acima ou abaixo da mediana).
 */
export function calcMLStats(
  items: MercadoLivreItem[]
): { avg: number; low: number; count: number } | null {
  if (!items.length) return null;
  const prices = items.map((i) => i.price).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  const filtered = prices.filter((p) => p <= median * 10 && p >= median * 0.1);
  if (!filtered.length) return null;
  const avg = filtered.reduce((s, v) => s + v, 0) / filtered.length;
  return { avg, low: filtered[0], count: filtered.length };
}

// ──────────────────────────────────────────────────────────────
// POKETRACE  (https://poketrace.com/docs)
// 🔵  Grátis 250 calls/dia · Key → VITE_POKETRACE_API_KEY
// Agrega: TCGPlayer (🇺🇸) + eBay + CardMarket (🇪🇺)
// ──────────────────────────────────────────────────────────────

const POKETRACE_KEY  = import.meta.env.VITE_POKETRACE_API_KEY ?? "";
const POKETRACE_BASE = "https://api.poketrace.com/v1";

export async function searchPokeTrace(query: string): Promise<PokeTraceCard[] | null> {
  if (!POKETRACE_KEY) return null;
  return safeFetch<PokeTraceCard[]>(
    `${POKETRACE_BASE}/cards?name=${encodeURIComponent(query)}&limit=20`,
    "PokeTrace",
    { headers: { "X-API-Key": POKETRACE_KEY } }
  );
}
