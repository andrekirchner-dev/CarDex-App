const recentCards = [
  { emoji: "🔥", name: "Charizard VMAX", meta: "Pokémon · PSA 10", price: "$485", badge: "+12.3%", badgeType: "green" as const },
  { emoji: "⚡", name: "Pikachu Illustrator", meta: "Pokémon · BGS 9.5", price: "$2,100", badge: "+8.7%", badgeType: "green" as const },
  { emoji: "🐉", name: "Blue-Eyes White Dragon", meta: "Yu-Gi-Oh · PSA 9", price: "$320", badge: "-3.2%", badgeType: "red" as const },
  { emoji: "⚔️", name: "Black Lotus", meta: "MTG · BGS 8.5", price: "$8,500", badge: "HOLD", badgeType: "gold" as const },
];

const badgeColors = {
  green: { bg: "rgba(89,172,153,0.15)", color: "#59AC99", border: "rgba(89,172,153,0.25)" },
  red: { bg: "rgba(231,54,60,0.15)", color: "#E7363C", border: "rgba(231,54,60,0.25)" },
  gold: { bg: "rgba(252,171,32,0.15)", color: "#FCAB20", border: "rgba(252,171,32,0.25)" },
};

const HomePage = () => (
  <div>
    <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.2em", color: "#F56438", textTransform: "uppercase", marginBottom: 6 }}>
      Portfolio Overview
    </div>
    <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: "0.02em", color: "#fff", lineHeight: 0.95, marginBottom: 4 }}>
      MY COLLECTION
    </h1>

    {/* Hero Card */}
    <div
      className="relative overflow-hidden rounded-[20px] p-5 mb-[14px]"
      style={{
        background: "linear-gradient(135deg, #E7363C 0%, #F56438 50%, #FCAB20 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.15em", color: "rgba(0,0,0,0.5)", textTransform: "uppercase", marginBottom: 6, position: "relative" }}>
        Total Value
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "#000", letterSpacing: "0.02em", lineHeight: 1, position: "relative" }}>
        $11,405
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.45)", marginTop: 2, position: "relative" }}>
        R$ 57,025.00
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 relative">
        {[
          { val: "127", key: "Cards" },
          { val: "14", key: "Sets" },
          { val: "23", key: "Graded" },
          { val: "89%", key: "Value" },
        ].map((s) => (
          <div key={s.key} className="rounded-[10px] p-2 text-center" style={{ background: "rgba(0,0,0,0.15)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#000", letterSpacing: "0.02em" }}>{s.val}</div>
            <div style={{ fontFamily: "var(--font-tech)", fontSize: 8, color: "rgba(0,0,0,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>{s.key}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Collection */}
    <div className="flex items-center gap-2 mb-[10px]" style={{ fontFamily: "var(--font-tech)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
      Recent Collection
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>

    <div className="rounded-[16px] p-[14px]" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)" }}>
      {recentCards.map((card, i) => (
        <div
          key={i}
          className="flex items-center justify-between cursor-pointer"
          style={{
            padding: "11px 0",
            borderBottom: i < recentCards.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
            transition: "opacity 0.15s",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 38, height: 38, borderRadius: 10, fontSize: 20,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {card.emoji}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{card.name}</div>
              <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>{card.meta}</div>
            </div>
          </div>
          <div className="text-right">
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#fff", letterSpacing: "0.02em" }}>{card.price}</div>
            <span
              className="inline-flex items-center rounded-[4px]"
              style={{
                padding: "2px 8px",
                fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.05em", fontWeight: 700,
                background: badgeColors[card.badgeType].bg,
                color: badgeColors[card.badgeType].color,
                border: `1px solid ${badgeColors[card.badgeType].border}`,
              }}
            >
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="flex gap-2 mt-[14px]">
      <button
        className="flex-1 inline-flex items-center justify-center gap-[7px] rounded-[10px] border-none cursor-pointer"
        style={{
          fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase",
          background: "linear-gradient(135deg, #E7363C, #F56438)", color: "#fff",
          padding: "12px 20px", boxShadow: "0 4px 20px rgba(231,54,60,0.35)",
        }}
      >
        + Add Card
      </button>
      <button
        className="inline-flex items-center justify-center gap-[7px] rounded-[10px] cursor-pointer"
        style={{
          fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase",
          background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
          padding: "11px 16px", border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        View All
      </button>
    </div>
  </div>
);

export default HomePage;
