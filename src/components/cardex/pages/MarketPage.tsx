import { useState, useMemo } from "react";
import { usePokemonCards, useMTGCards, useFeaturedPokemonCards } from "@/hooks/useCardSearch";
import { getPokemonPrice, formatUSD, type PokemonCard, type MTGCard } from "@/lib/api";

// ──────────────────────────────────────────────────────────────
// TIPOS E CONFIGS
// ──────────────────────────────────────────────────────────────

type Category = "All" | "Pokémon" | "Yu-Gi-Oh" | "MTG" | "Sports" | "One Piece";
const categories: Category[] = ["All", "Pokémon", "Yu-Gi-Oh", "MTG", "Sports", "One Piece"];

// Cartas estáticas para categorias sem API gratuita disponível
const staticYugioh = [
  { id: "ygo1", name: "Blue-Eyes White Dragon", brand: "Yu-Gi-Oh", price: "$320", emoji: "🐉", bg: "linear-gradient(135deg, #3E446E, #59AC99)" },
  { id: "ygo2", name: "Dark Magician", brand: "Yu-Gi-Oh", price: "$180", emoji: "🧙", bg: "linear-gradient(135deg, #3E446E, #6B3FA0)" },
  { id: "ygo3", name: "Exodia the Forbidden One", brand: "Yu-Gi-Oh", price: "$450", emoji: "💀", bg: "linear-gradient(135deg, #2a1a4e, #3E446E)" },
];
const staticSports = [
  { id: "sp1", name: "LeBron Rookie PSA 10", brand: "Sports", price: "$4,200", emoji: "🏀", bg: "linear-gradient(135deg, #F56438, #FCAB20)" },
  { id: "sp2", name: "Michael Jordan RC BGS 9", brand: "Sports", price: "$6,800", emoji: "🏆", bg: "linear-gradient(135deg, #E7363C, #F56438)" },
];
const staticOnePiece = [
  { id: "op1", name: "Luffy Leader Promo", brand: "One Piece", price: "$180", emoji: "🏴‍☠️", bg: "linear-gradient(135deg, #E7363C, #3E446E)" },
  { id: "op2", name: "Shanks Secret Rare", brand: "One Piece", price: "$420", emoji: "⚔️", bg: "linear-gradient(135deg, #3E446E, #E7363C)" },
];

// ──────────────────────────────────────────────────────────────
// SUB-COMPONENTES
// ──────────────────────────────────────────────────────────────

/** Skeleton de loading para grid de cartas */
function CardSkeleton() {
  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="w-full"
        style={{
          height: 80,
          background: "linear-gradient(90deg, #1C1C28 25%, #252535 50%, #1C1C28 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div className="p-3">
        <div className="h-3 rounded mb-2" style={{ background: "rgba(255,255,255,0.06)", width: "80%" }} />
        <div className="h-2 rounded mb-3" style={{ background: "rgba(255,255,255,0.04)", width: "50%" }} />
        <div className="h-4 rounded" style={{ background: "rgba(255,255,255,0.06)", width: "40%" }} />
      </div>
    </div>
  );
}

/** Card de carta Pokémon com imagem real da API */
function PokemonCardTile({ card }: { card: PokemonCard }) {
  const price = getPokemonPrice(card);
  return (
    <div
      className="rounded-[14px] cursor-pointer overflow-hidden"
      style={{
        background: "#1C1C28",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      {/* Imagem real da carta */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 100, background: "rgba(255,255,255,0.03)" }}
      >
        {card.images?.small ? (
          <img
            src={card.images.small}
            alt={card.name}
            loading="lazy"
            decoding="async"
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: 36 }}>🃏</span>
        )}
        {card.rarity && (
          <div
            className="absolute top-1 right-1 rounded px-1"
            style={{
              fontFamily: "var(--font-tech)",
              fontSize: 8,
              letterSpacing: "0.06em",
              background: "rgba(0,0,0,0.6)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {card.rarity.toUpperCase().slice(0, 6)}
          </div>
        )}
      </div>

      <div className="p-3">
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.3,
            marginBottom: 3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {card.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-tech)",
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 7,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.set?.name ?? "Pokémon TCG"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            color: price != null ? "#fff" : "rgba(255,255,255,0.3)",
            letterSpacing: "0.02em",
          }}
        >
          {formatUSD(price)}
        </div>
      </div>
    </div>
  );
}

/** Card de carta MTG */
function MTGCardTile({ card }: { card: MTGCard }) {
  const price = card.prices?.usd ? `$${parseFloat(card.prices.usd).toFixed(2)}` : "N/A";
  return (
    <div
      className="rounded-[14px] cursor-pointer overflow-hidden"
      style={{
        background: "#1C1C28",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 100, background: "rgba(255,255,255,0.03)" }}
      >
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            loading="lazy"
            decoding="async"
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: 36 }}>🃏</span>
        )}
      </div>
      <div className="p-3">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {card.name}
        </div>
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {card.setName ?? card.set ?? "MTG"}
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: card.prices?.usd ? "#fff" : "rgba(255,255,255,0.3)", letterSpacing: "0.02em" }}>
          {price}
        </div>
      </div>
    </div>
  );
}

/** Card estático (Yu-Gi-Oh / Sports / One Piece) */
function StaticCardTile({ card }: { card: { id: string; name: string; brand: string; price: string; emoji: string; bg: string } }) {
  return (
    <div
      className="rounded-[14px] cursor-pointer"
      style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)", transition: "transform 0.15s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
    >
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

/** Mensagem de erro inline */
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="col-span-2 text-center py-8">
      <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
        {message}
      </div>
    </div>
  );
}

/** Mensagem de nenhum resultado */
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-2 text-center py-8">
      <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
        SEM RESULTADOS
      </div>
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4, letterSpacing: "0.04em" }}>
        Nenhuma carta encontrada para "{query}"
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────

const MarketPage = () => {
  const [activeCat, setActiveCat] = useState<Category>("Pokémon");
  const [searchInput, setSearchInput] = useState("");

  // Queries (hooks só ativam quando há 2+ caracteres na query)
  const defaultQuery = searchInput.trim().length >= 2 ? searchInput.trim() : "charizard";
  const pokemonQuery = usePokemonCards(
    (activeCat === "All" || activeCat === "Pokémon") ? defaultQuery : ""
  );
  const mtgQuery = useMTGCards(
    activeCat === "MTG" ? (searchInput.trim().length >= 2 ? searchInput.trim() : "black lotus") : ""
  );

  // Indicador de loading global
  const isLoading = pokemonQuery.isLoading || mtgQuery.isLoading;
  const hasError = pokemonQuery.isError || mtgQuery.isError;

  // Conteúdo do grid dependendo da categoria
  const gridContent = useMemo(() => {
    if (activeCat === "Pokémon" || activeCat === "All") {
      if (isLoading) return Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />);
      if (pokemonQuery.isError) return [<ErrorMessage key="err" message="Erro ao buscar cartas Pokémon. Tente novamente." />];
      if (!pokemonQuery.data?.length) return [<EmptyState key="empty" query={searchInput} />];
      return pokemonQuery.data.map((card) => <PokemonCardTile key={card.id} card={card} />);
    }
    if (activeCat === "MTG") {
      if (isLoading) return Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />);
      if (mtgQuery.isError) return [<ErrorMessage key="err" message="Erro ao buscar cartas MTG. Tente novamente." />];
      if (!mtgQuery.data?.length) return [<EmptyState key="empty" query={searchInput} />];
      return mtgQuery.data.map((card) => <MTGCardTile key={card.id} card={card} />);
    }
    if (activeCat === "Yu-Gi-Oh") return staticYugioh.map((c) => <StaticCardTile key={c.id} card={c} />);
    if (activeCat === "Sports") return staticSports.map((c) => <StaticCardTile key={c.id} card={c} />);
    if (activeCat === "One Piece") return staticOnePiece.map((c) => <StaticCardTile key={c.id} card={c} />);
    return [];
  }, [activeCat, isLoading, pokemonQuery, mtgQuery, searchInput]);

  return (
    <div>
      {/* Header */}
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.2em", color: "#F56438", textTransform: "uppercase", marginBottom: 6 }}>
        Browse
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: "0.02em", color: "#fff", lineHeight: 0.95, marginBottom: 14 }}>
        MARKETPLACE
      </h1>

      {/* Search */}
      <div className="relative mb-[14px]">
        <svg className="absolute left-[13px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {/* Spinner de loading no campo de busca */}
        {isLoading && (
          <div
            className="absolute right-[13px] top-1/2 -translate-y-1/2"
            style={{
              width: 14, height: 14, borderRadius: "50%",
              border: "2px solid rgba(252,171,32,0.3)",
              borderTopColor: "#FCAB20",
              animation: "spin 0.7s linear infinite",
            }}
          />
        )}
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={
            activeCat === "Pokémon" || activeCat === "All"
              ? "Buscar carta Pokémon..."
              : activeCat === "MTG"
              ? "Buscar carta MTG..."
              : "Buscar carta..."
          }
          className="w-full rounded-[10px] outline-none"
          style={{
            padding: "11px 14px 11px 40px",
            background: "#1C1C28",
            border: `1px solid ${isLoading ? "rgba(252,171,32,0.3)" : "rgba(255,255,255,0.07)"}`,
            fontFamily: "var(--font-tech)", fontSize: 12, color: "#fff", letterSpacing: "0.05em",
            transition: "border-color 0.2s",
          }}
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-[6px] overflow-x-auto mb-4 pb-[2px]" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCat(cat); setSearchInput(""); }}
            className="flex-shrink-0 cursor-pointer"
            style={{
              padding: "5px 14px", borderRadius: 6,
              fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
              background: activeCat === cat ? "#FCAB20" : "rgba(255,255,255,0.04)",
              color: activeCat === cat ? "#000" : "rgba(255,255,255,0.4)",
              border: `1px solid ${activeCat === cat ? "#FCAB20" : "rgba(255,255,255,0.07)"}`,
              transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* API Badge */}
      {(activeCat === "Pokémon" || activeCat === "All") && (
        <div
          className="flex items-center gap-2 mb-3 rounded-[6px] px-3 py-[6px]"
          style={{ background: "rgba(89,172,153,0.08)", border: "1px solid rgba(89,172,153,0.15)" }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#59AC99", flexShrink: 0, boxShadow: "0 0 6px #59AC99" }} />
          <span style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "#59AC99", letterSpacing: "0.08em" }}>
            POKÉMON TCG API · DADOS AO VIVO
          </span>
        </div>
      )}
      {activeCat === "MTG" && (
        <div
          className="flex items-center gap-2 mb-3 rounded-[6px] px-3 py-[6px]"
          style={{ background: "rgba(62,68,110,0.3)", border: "1px solid rgba(62,68,110,0.5)" }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B96E0", flexShrink: 0, boxShadow: "0 0 6px #8B96E0" }} />
          <span style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "#8B96E0", letterSpacing: "0.08em" }}>
            MAGIC: THE GATHERING API · DADOS AO VIVO
          </span>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
        {gridContent}
      </div>

      {/* Resultado count */}
      {!isLoading && (
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", textAlign: "center", marginBottom: 14 }}>
          {(activeCat === "Pokémon" || activeCat === "All") && pokemonQuery.data
            ? `${pokemonQuery.data.length} CARTAS ENCONTRADAS`
            : activeCat === "MTG" && mtgQuery.data
            ? `${mtgQuery.data.length} CARTAS ENCONTRADAS`
            : null}
        </div>
      )}

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MarketPage;
