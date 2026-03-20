import { useState } from "react";

const categories = ["All", "Pokémon", "Yu-Gi-Oh", "MTG", "Sports", "One Piece"];

const marketCards = [
  { emoji: "🔥", name: "Charizard Base Set", brand: "Pokémon TCG", price: "$350", bg: "linear-gradient(135deg, #E7363C, #F56438)" },
  { emoji: "⚡", name: "Pikachu V Full Art", brand: "Pokémon TCG", price: "$85", bg: "linear-gradient(135deg, #FCAB20, #F56438)" },
  { emoji: "🐉", name: "Blue-Eyes Ultimate", brand: "Yu-Gi-Oh", price: "$220", bg: "linear-gradient(135deg, #3E446E, #59AC99)" },
  { emoji: "🗡️", name: "Black Lotus Alpha", brand: "MTG", price: "$9,800", bg: "linear-gradient(135deg, #1a1a2e, #3E446E)" },
  { emoji: "🏀", name: "LeBron Rookie PSA 10", brand: "Sports", price: "$4,200", bg: "linear-gradient(135deg, #F56438, #FCAB20)" },
  { emoji: "🏴‍☠️", name: "Luffy Leader Promo", brand: "One Piece", price: "$180", bg: "linear-gradient(135deg, #E7363C, #3E446E)" },
];

const MarketPage = () => {
  const [activeCat, setActiveCat] = useState("All");

  return (
    <div>
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
        <input
          type="text"
          placeholder="Search cards..."
          className="w-full rounded-[10px] outline-none"
          style={{
            padding: "11px 14px 11px 40px",
            background: "#1C1C28",
            border: "1px solid rgba(255,255,255,0.07)",
            fontFamily: "var(--font-tech)", fontSize: 12, color: "#fff", letterSpacing: "0.05em",
          }}
        />
      </div>

      {/* Pills */}
      <div className="flex gap-[6px] overflow-x-auto mb-4 pb-[2px]" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
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

      {/* Card Grid */}
      <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
        {marketCards.map((card, i) => (
          <div
            key={i}
            className="rounded-[14px] p-3 cursor-pointer text-left"
            style={{
              background: "#1C1C28",
              border: "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.2s",
            }}
          >
            <div
              className="rounded-[10px] mb-[10px] flex items-center justify-center relative overflow-hidden"
              style={{ height: 80, fontSize: 36 }}
            >
              <div className="absolute inset-0 opacity-[0.15]" style={{ background: card.bg }} />
              <span className="relative z-10">{card.emoji}</span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 3 }}>
              {card.name}
            </div>
            <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>
              {card.brand}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "#fff", letterSpacing: "0.02em" }}>
              {card.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPage;
