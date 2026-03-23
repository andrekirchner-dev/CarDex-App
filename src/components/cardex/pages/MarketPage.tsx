import { useState, useMemo } from "react";
import { usePokemonCards, useScryfallCards, useMercadoLivrePrice } from "@/hooks/useCardSearch";
import {
  getPokemonPrice, getScryfallImage,
  formatUSD, formatEUR, formatBRL,
  type PokemonCard, type ScryfallCard, type MercadoLivreItem,
} from "@/lib/api";

// ──────────────────────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────────────────────

type Category = "All" | "Pokémon" | "Yu-Gi-Oh" | "MTG" | "Sports" | "One Piece";
const categories: Category[] = ["All", "Pokémon", "Yu-Gi-Oh", "MTG", "Sports", "One Piece"];

const staticCards = {
  "Yu-Gi-Oh": [
    { id: "ygo1", name: "Blue-Eyes White Dragon", brand: "Yu-Gi-Oh", price: "$320", emoji: "🐉", bg: "linear-gradient(135deg,#3E446E,#59AC99)" },
    { id: "ygo2", name: "Dark Magician", brand: "Yu-Gi-Oh", price: "$180", emoji: "🧙", bg: "linear-gradient(135deg,#3E446E,#6B3FA0)" },
    { id: "ygo3", name: "Exodia the Forbidden One", brand: "Yu-Gi-Oh", price: "$450", emoji: "💀", bg: "linear-gradient(135deg,#2a1a4e,#3E446E)" },
  ],
  Sports: [
    { id: "sp1", name: "LeBron Rookie PSA 10", brand: "Sports", price: "$4,200", emoji: "🏀", bg: "linear-gradient(135deg,#F56438,#FCAB20)" },
    { id: "sp2", name: "Michael Jordan RC BGS 9", brand: "Sports", price: "$6,800", emoji: "🏆", bg: "linear-gradient(135deg,#E7363C,#F56438)" },
  ],
  "One Piece": [
    { id: "op1", name: "Luffy Leader Promo", brand: "One Piece", price: "$180", emoji: "🏴‍☠️", bg: "linear-gradient(135deg,#E7363C,#3E446E)" },
    { id: "op2", name: "Shanks Secret Rare", brand: "One Piece", price: "$420", emoji: "⚔️", bg: "linear-gradient(135deg,#3E446E,#E7363C)" },
  ],
};

// ──────────────────────────────────────────────────────────────
// SUB-COMPONENTES — PREÇOS MULTI-MERCADO
// ──────────────────────────────────────────────────────────────

function PriceBadge({ label, value, flag }: { label: string; value: string | null; flag: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-[3px]">
      <span style={{ fontSize: 10 }}>{flag}</span>
      <span style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#fff" }}>{value}</span>
    </div>
  );
}

function MultiPrice({ usd, eur }: { usd?: number | null; eur?: number | null }) {
  const hasAny = usd != null || eur != null;
  if (!hasAny) return (
    <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "rgba(255,255,255,0.25)", letterSpacing: "0.02em" }}>N/A</span>
  );
  return (
    <div className="flex flex-col gap-[2px]">
      {usd != null && <PriceBadge flag="🇺🇸" label="USD" value={formatUSD(usd)} />}
      {eur != null && <PriceBadge flag="🇪🇺" label="EUR" value={formatEUR(eur)} />}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SKELETONS
// ──────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ height: 90, background: "linear-gradient(90deg,#1C1C28 25%,#252535 50%,#1C1C28 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
      <div className="p-3">
        <div style={{ height: 10, width: "80%", borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 6 }} />
        <div style={{ height: 8, width: "50%", borderRadius: 4, background: "rgba(255,255,255,0.04)", marginBottom: 8 }} />
        <div style={{ height: 18, width: "55%", borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
      </div>
    </div>
  );
}

function MLSkeleton() {
  return (
    <div style={{ height: 52, borderRadius: 10, marginBottom: 6, background: "linear-gradient(90deg,#1C1C28 25%,#252535 50%,#1C1C28 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
  );
}

// ──────────────────────────────────────────────────────────────
// CARD TILES
// ──────────────────────────────────────────────────────────────

const tileHover = {
  onMouseEnter: (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
  },
  onMouseLeave: (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = "";
    (e.currentTarget as HTMLElement).style.boxShadow = "";
  },
};

function PokemonCardTile({ card }: { card: PokemonCard }) {
  const { usd, eur } = getPokemonPrice(card);
  return (
    <div className="rounded-[14px] cursor-pointer overflow-hidden" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)", transition: "transform 0.15s, box-shadow 0.15s" }} {...tileHover}>
      <div className="relative flex items-center justify-center overflow-hidden" style={{ height: 90, background: "rgba(255,255,255,0.03)" }}>
        {card.images?.small
          ? <img src={card.images.small} alt={card.name} loading="lazy" decoding="async" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
          : <span style={{ fontSize: 36 }}>🃏</span>}
        {card.rarity && (
          <div className="absolute top-1 right-1 rounded px-1" style={{ fontFamily: "var(--font-tech)", fontSize: 8, letterSpacing: "0.06em", background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.45)" }}>
            {card.rarity.toUpperCase().slice(0, 6)}
          </div>
        )}
      </div>
      <div className="p-3">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{card.name}</div>
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.set?.name ?? "Pokémon TCG"}</div>
        <MultiPrice usd={usd} eur={eur} />
      </div>
    </div>
  );
}

function ScryfallCardTile({ card }: { card: ScryfallCard }) {
  const img = getScryfallImage(card);
  const usd = card.prices.usd ? parseFloat(card.prices.usd) : null;
  const eur = card.prices.eur ? parseFloat(card.prices.eur) : null;
  return (
    <div className="rounded-[14px] cursor-pointer overflow-hidden" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)", transition: "transform 0.15s, box-shadow 0.15s" }} {...tileHover}>
      <div className="relative flex items-center justify-center overflow-hidden" style={{ height: 90, background: "rgba(255,255,255,0.03)" }}>
        {img ? <img src={img} alt={card.name} loading="lazy" decoding="async" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: 36 }}>🃏</span>}
        <div className="absolute top-1 right-1 rounded px-1" style={{ fontFamily: "var(--font-tech)", fontSize: 8, background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.45)" }}>
          {card.rarity?.toUpperCase().slice(0, 4)}
        </div>
      </div>
      <div className="p-3">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{card.name}</div>
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.set_name}</div>
        <MultiPrice usd={usd} eur={eur} />
      </div>
    </div>
  );
}

function StaticCardTile({ card }: { card: { id: string; name: string; brand: string; price: string; emoji: string; bg: string } }) {
  return (
    <div className="rounded-[14px] cursor-pointer" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)", transition: "transform 0.15s" }} {...tileHover}>
      <div className="rounded-[10px] m-3 mb-0 flex items-center justify-center relative overflow-hidden" style={{ height: 80, fontSize: 36 }}>
        <div className="absolute inset-0 opacity-[0.15]" style={{ background: card.bg }} />
        <span className="relative z-10">{card.emoji}</span>
      </div>
      <div className="p-3">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 3 }}>{card.name}</div>
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>{card.brand}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "#fff", letterSpacing: "0.02em" }}>{card.price}</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SEÇÃO MERCADO LIVRE 🇧🇷
// ──────────────────────────────────────────────────────────────

function MLSection({ query, isVisible }: { query: string; isVisible: boolean }) {
  const { data, isLoading, isError } = useMercadoLivrePrice(isVisible ? query : "");

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-[6px] rounded-[6px] px-3 py-[5px]" style={{ background: "rgba(0,156,59,0.08)", border: "1px solid rgba(0,156,59,0.2)" }}>
          <span style={{ fontSize: 12 }}>🇧🇷</span>
          <span style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "#00C853", letterSpacing: "0.1em" }}>MERCADO LIVRE · BRL</span>
          {isLoading && <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid rgba(0,200,83,0.3)", borderTopColor: "#00C853", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />}
          {!isLoading && data?.stats && (
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C853", boxShadow: "0 0 5px #00C853" }} />
          )}
        </div>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        {data?.stats && (
          <span style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
            {data.stats.count} anúncios
          </span>
        )}
      </div>

      {/* Preço médio destaque */}
      {!isLoading && data?.stats && (
        <div className="rounded-[12px] p-3 mb-3 flex items-center justify-between" style={{ background: "rgba(0,156,59,0.07)", border: "1px solid rgba(0,156,59,0.15)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>Preço médio</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#00C853", letterSpacing: "0.04em", lineHeight: 1 }}>
              {formatBRL(data.stats.avg)}
            </div>
          </div>
          <div className="text-right">
            <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>A partir de</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>
              {formatBRL(data.stats.low)}
            </div>
          </div>
        </div>
      )}

      {/* Lista de anúncios */}
      <div className="rounded-[14px] overflow-hidden" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)" }}>
        {isLoading ? (
          <div className="p-3">{Array.from({ length: 4 }, (_, i) => <MLSkeleton key={i} />)}</div>
        ) : isError ? (
          <div className="text-center py-6" style={{ fontFamily: "var(--font-tech)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>⚠️ Erro ao buscar no Mercado Livre</div>
        ) : !data?.items.length ? (
          <div className="text-center py-6" style={{ fontFamily: "var(--font-tech)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Nenhum anúncio encontrado</div>
        ) : (
          data.items.slice(0, 6).map((item: MercadoLivreItem, i: number) => (
            <a
              key={item.id}
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 no-underline"
              style={{
                padding: "10px 14px",
                borderBottom: i < Math.min(data.items.length, 6) - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                transition: "background 0.15s",
                display: "flex",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 overflow-hidden rounded-[6px]" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.05)" }}>
                {item.thumbnail && <img src={item.thumbnail.replace("I.jpg", "O.jpg")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.title}
                </div>
                <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 2, letterSpacing: "0.04em" }}>
                  {item.condition === "new" ? "✦ Novo" : "◈ Usado"}
                </div>
              </div>
              {/* Preço */}
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#00C853", letterSpacing: "0.04em", flexShrink: 0 }}>
                {formatBRL(item.price)}
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// ESTADO VAZIO / ERRO
// ──────────────────────────────────────────────────────────────

function ErrorState({ msg }: { msg: string }) {
  return (
    <div className="col-span-2 text-center py-8">
      <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>{msg}</div>
    </div>
  );
}
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-2 text-center py-8">
      <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>SEM RESULTADOS</div>
      {query && <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>para "{query}"</div>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────

const MarketPage = () => {
  const [activeCat, setActiveCat] = useState<Category>("Pokémon");
  const [searchInput, setSearchInput] = useState("");

  const isPokemon = activeCat === "All" || activeCat === "Pokémon";
  const isMTG     = activeCat === "MTG";
  const defaultQ  = searchInput.trim().length >= 2 ? searchInput.trim() : "";

  const pokemonQ  = usePokemonCards(isPokemon ? (defaultQ || "charizard") : "");
  const scryfallQ = useScryfallCards(isMTG ? (defaultQ || "black lotus") : "");

  const isLoading = pokemonQ.isLoading || scryfallQ.isLoading;

  // Query para o Mercado Livre (busca combinada)
  const mlQuery = defaultQ
    ? defaultQ + (isPokemon ? " pokemon" : isMTG ? " magic" : " carta")
    : isPokemon ? "charizard pokemon" : isMTG ? "magic the gathering black lotus" : "carta colecionável";

  const gridContent = useMemo(() => {
    if (isPokemon) {
      if (isLoading) return Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />);
      if (pokemonQ.isError) return [<ErrorState key="e" msg="Erro ao buscar cartas Pokémon. Tente novamente." />];
      if (!pokemonQ.data?.length) return [<EmptyState key="e" query={searchInput} />];
      return pokemonQ.data.map((c) => <PokemonCardTile key={c.id} card={c} />);
    }
    if (isMTG) {
      if (isLoading) return Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />);
      if (scryfallQ.isError) return [<ErrorState key="e" msg="Erro ao buscar cartas MTG. Tente novamente." />];
      if (!scryfallQ.data?.length) return [<EmptyState key="e" query={searchInput} />];
      return scryfallQ.data.map((c) => <ScryfallCardTile key={c.id} card={c} />);
    }
    const statics = staticCards[activeCat as keyof typeof staticCards] ?? [];
    return statics.map((c) => <StaticCardTile key={c.id} card={c} />);
  }, [activeCat, isLoading, pokemonQ, scryfallQ, searchInput, isPokemon, isMTG]);

  const resultCount = isPokemon ? pokemonQ.data?.length : isMTG ? scryfallQ.data?.length : undefined;

  return (
    <div>
      {/* Header */}
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.2em", color: "#F56438", textTransform: "uppercase", marginBottom: 6 }}>Browse</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: "0.02em", color: "#fff", lineHeight: 0.95, marginBottom: 14 }}>MARKETPLACE</h1>

      {/* Search */}
      <div className="relative mb-[14px]">
        <svg className="absolute left-[13px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {isLoading && <div className="absolute right-[13px] top-1/2 -translate-y-1/2" style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(252,171,32,0.3)", borderTopColor: "#FCAB20", animation: "spin 0.7s linear infinite" }} />}
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={isPokemon ? "Buscar carta Pokémon..." : isMTG ? "Buscar carta MTG..." : "Buscar carta..."}
          className="w-full rounded-[10px] outline-none"
          style={{ padding: "11px 14px 11px 40px", background: "#1C1C28", border: `1px solid ${isLoading ? "rgba(252,171,32,0.3)" : "rgba(255,255,255,0.07)"}`, fontFamily: "var(--font-tech)", fontSize: 12, color: "#fff", letterSpacing: "0.05em", transition: "border-color 0.2s" }}
        />
      </div>

      {/* Pills */}
      <div className="flex gap-[6px] overflow-x-auto mb-4 pb-[2px]" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => { setActiveCat(cat); setSearchInput(""); }} className="flex-shrink-0 cursor-pointer" style={{ padding: "5px 14px", borderRadius: 6, fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", background: activeCat === cat ? "#FCAB20" : "rgba(255,255,255,0.04)", color: activeCat === cat ? "#000" : "rgba(255,255,255,0.4)", border: `1px solid ${activeCat === cat ? "#FCAB20" : "rgba(255,255,255,0.07)"}`, transition: "all 0.15s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* API Badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {isPokemon && (
          <div className="flex items-center gap-[6px] rounded-[6px] px-2 py-[4px]" style={{ background: "rgba(89,172,153,0.08)", border: "1px solid rgba(89,172,153,0.2)" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#59AC99", boxShadow: "0 0 5px #59AC99" }} />
            <span style={{ fontFamily: "var(--font-tech)", fontSize: 8, color: "#59AC99", letterSpacing: "0.08em" }}>POKÉMON TCG API 🇺🇸🇪🇺</span>
          </div>
        )}
        {isMTG && (
          <div className="flex items-center gap-[6px] rounded-[6px] px-2 py-[4px]" style={{ background: "rgba(62,68,110,0.3)", border: "1px solid rgba(62,68,110,0.5)" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#8B96E0", boxShadow: "0 0 5px #8B96E0" }} />
            <span style={{ fontFamily: "var(--font-tech)", fontSize: 8, color: "#8B96E0", letterSpacing: "0.08em" }}>SCRYFALL API 🇺🇸🇪🇺</span>
          </div>
        )}
        <div className="flex items-center gap-[6px] rounded-[6px] px-2 py-[4px]" style={{ background: "rgba(0,156,59,0.08)", border: "1px solid rgba(0,156,59,0.2)" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00C853", boxShadow: "0 0 5px #00C853" }} />
          <span style={{ fontFamily: "var(--font-tech)", fontSize: 8, color: "#00C853", letterSpacing: "0.08em" }}>MERCADO LIVRE 🇧🇷</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-[10px] mb-1">{gridContent}</div>

      {/* Contagem */}
      {!isLoading && resultCount != null && (
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", textAlign: "center", margin: "8px 0" }}>
          {resultCount} CARTAS ENCONTRADAS
        </div>
      )}

      {/* Seção Mercado Livre */}
      <MLSection query={mlQuery} isVisible={true} />

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MarketPage;
