// ============================================================
// CarDex – API Service Layer
// ============================================================
// Todas as chamadas externas ficam aqui, centralizadas.
// O TanStack Query (já instalado no projeto) gerencia cache.
//
// APIs integradas:
//   • Pokémon TCG  – pokemontcg.io     (gratuita, sem key)
//   • Magic: TG   – magicthegathering.io (gratuita, sem key)
//   • TCGDex      – tcgdex.net          (gratuita, sem key)
//   • PriceCharting – pricecharting.com (requer key → VITE_PRICECHARTING_API_KEY)
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
    };
  };
}

export interface MTGCard {
  id: string;
  name: string;
  imageUrl?: string;
  set: string;
  setName: string;
  type?: string;
  rarity?: string;
  prices?: { usd?: string; usdFoil?: string };
}

export interface TCGDexCard {
  id: string;
  localId: string;
  name: string;
  image?: string;
  set?: { name: string; id: string };
  rarity?: string;
}

export interface PriceChartingProduct {
  id: string;
  "product-name": string;
  "console-name": string;
  "price-new"?: number;
  "price-used"?: number;
  "price-cib"?: number;
}

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────

async function safeFetch<T>(url: string, label: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`[${label}] HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

/** Extrai o melhor preço disponível de uma carta Pokémon */
export function getPokemonPrice(card: PokemonCard): number | null {
  return (
    card.tcgplayer?.prices?.holofoil?.market ??
    card.tcgplayer?.prices?.normal?.market ??
    card.cardmarket?.prices?.averageSellPrice ??
    card.cardmarket?.prices?.trendPrice ??
    null
  );
}

/** Formata um número para USD */
export function formatUSD(value: number | null | undefined): string {
  if (value == null) return "N/A";
  return `$${value.toFixed(2)}`;
}

// ──────────────────────────────────────────────────────────────
// POKÉMON TCG  (https://api.pokemontcg.io/v2)
// ──────────────────────────────────────────────────────────────

const POKEMON_BASE = "https://api.pokemontcg.io/v2";
const POKEMON_FIELDS =
  "id,name,images,set,rarity,cardmarket,tcgplayer";

/**
 * Busca cartas Pokémon por nome.
 * Sem API key → 1000 req/dia. Com key (VITE_POKEMON_TCG_API_KEY) → 20 000 req/dia.
 */
export async function searchPokemonCards(
  query: string,
  pageSize = 20
): Promise<PokemonCard[]> {
  const apiKey = import.meta.env.VITE_POKEMON_TCG_API_KEY;
  const headers: Record<string, string> = apiKey
    ? { "X-Api-Key": apiKey }
    : {};

  const url = `${POKEMON_BASE}/cards?q=name:*${encodeURIComponent(query)}*&pageSize=${pageSize}&select=${POKEMON_FIELDS}`;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`[PokémonTCG] HTTP ${res.status}`);
  const data = await res.json();
  return (data.data ?? []) as PokemonCard[];
}

/** Cartas em destaque (sem query → busca Charizard + Pikachu no início) */
export async function getFeaturedPokemonCards(): Promise<PokemonCard[]> {
  return searchPokemonCards("charizard", 6);
}

// ──────────────────────────────────────────────────────────────
// MAGIC: THE GATHERING  (https://api.magicthegathering.io/v1)
// ──────────────────────────────────────────────────────────────

const MTG_BASE = "https://api.magicthegathering.io/v1";

/**
 * Busca cartas MTG por nome.
 * Gratuita, sem API key. Rate limit: ~1000 req/hora.
 */
export async function searchMTGCards(
  query: string,
  pageSize = 20
): Promise<MTGCard[]> {
  const data = await safeFetch<{ cards: MTGCard[] }>(
    `${MTG_BASE}/cards?name=${encodeURIComponent(query)}&pageSize=${pageSize}`,
    "MTG"
  );
  return data.cards ?? [];
}

// ──────────────────────────────────────────────────────────────
// TCGDEX  (https://api.tcgdex.net/v2)
// ──────────────────────────────────────────────────────────────

const TCGDEX_BASE = "https://api.tcgdex.net/v2/en";

/**
 * Busca cartas via TCGDex (Pokémon, multi-idioma).
 * Gratuita, sem API key. Ótimo para cartas internacionais.
 */
export async function searchTCGDexCards(
  query: string
): Promise<TCGDexCard[]> {
  const data = await safeFetch<TCGDexCard[]>(
    `${TCGDEX_BASE}/cards?name=${encodeURIComponent(query)}`,
    "TCGDex"
  );
  return Array.isArray(data) ? data.slice(0, 20) : [];
}

// ──────────────────────────────────────────────────────────────
// PRICECHARTING  (https://www.pricecharting.com/api-documentation)
// ──────────────────────────────────────────────────────────────
// ⚠️  Requer API key → crie uma em pricecharting.com/api
//     e adicione ao .env:  VITE_PRICECHARTING_API_KEY=sua_key
// ──────────────────────────────────────────────────────────────

const PRICE_API_KEY = import.meta.env.VITE_PRICECHARTING_API_KEY ?? "";

/**
 * Busca produtos (cartas, games) com preços reais no PriceCharting.
 * Retorna null se a key não estiver configurada.
 */
export async function searchPriceCharting(
  query: string
): Promise<PriceChartingProduct[] | null> {
  if (!PRICE_API_KEY) {
    console.warn(
      "[PriceCharting] API key não configurada. " +
        "Adicione VITE_PRICECHARTING_API_KEY no arquivo .env"
    );
    return null;
  }

  // ⚠️  A API do PriceCharting pode bloquear chamadas diretas do browser (CORS).
  //     Se necessário, redirecione via proxy ou Supabase Edge Function.
  const data = await safeFetch<{ products: PriceChartingProduct[] }>(
    `https://api.pricecharting.com/api/products?t=${PRICE_API_KEY}&q=${encodeURIComponent(query)}`,
    "PriceCharting"
  );
  return data.products ?? [];
}

/**
 * Busca preço de um produto específico por ID no PriceCharting.
 */
export async function getPriceChartingProduct(
  id: string
): Promise<PriceChartingProduct | null> {
  if (!PRICE_API_KEY) return null;
  return safeFetch<PriceChartingProduct>(
    `https://api.pricecharting.com/api/product?id=${id}&t=${PRICE_API_KEY}`,
    "PriceCharting"
  );
}
