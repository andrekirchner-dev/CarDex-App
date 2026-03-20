const metrics = [
  { name: "Centering", val: "9.2", pct: 92 },
  { name: "Edges", val: "8.8", pct: 88 },
  { name: "Surface", val: "9.5", pct: 95 },
  { name: "Corners", val: "8.5", pct: 85 },
];

const diagnostics = [
  "Minor whitening detected on bottom-left corner edge",
  "Surface shows minimal scratching under 10x magnification",
  "Centering measures 52/48 top-bottom, 51/49 left-right",
  "Print quality consistent with 1st edition run standards",
];

const ScannerPage = () => (
  <div>
    <div style={{ fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.2em", color: "#F56438", textTransform: "uppercase", marginBottom: 6 }}>
      AI Grading
    </div>
    <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: "0.02em", color: "#fff", lineHeight: 0.95, marginBottom: 14 }}>
      CARD SCANNER
    </h1>

    {/* Scanner Shell */}
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-[16px] mb-[14px]"
      style={{
        aspectRatio: "0.78",
        background: "#2D3B05",
        border: "2px solid rgba(184,225,13,0.25)",
      }}
    >
      {/* Scan lines overlay */}
      <div className="absolute inset-0" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 6px)",
      }} />

      {/* Tag */}
      <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-[3]" style={{
        fontFamily: "var(--font-tech)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(184,225,13,0.5)",
      }}>
        CARDEX VISION™
      </div>

      {/* Corners */}
      {[
        { top: 14, left: 14, borderTop: "3px solid #B8E10D", borderLeft: "3px solid #B8E10D" },
        { top: 14, right: 14, borderTop: "3px solid #B8E10D", borderRight: "3px solid #B8E10D" },
        { bottom: 14, left: 14, borderBottom: "3px solid #B8E10D", borderLeft: "3px solid #B8E10D" },
        { bottom: 14, right: 14, borderBottom: "3px solid #B8E10D", borderRight: "3px solid #B8E10D" },
      ].map((s, i) => (
        <div key={i} className="absolute" style={{ width: 32, height: 32, ...s }} />
      ))}

      {/* Scan line */}
      <div className="absolute left-[14px] right-[14px] h-[2px] z-[2]" style={{
        background: "linear-gradient(90deg, transparent, #B8E10D, transparent)",
        animation: "scanMove 1.8s ease-in-out infinite",
        boxShadow: "0 0 12px #B8E10D",
      }} />

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] flex items-center justify-center" style={{
        width: 100, height: 100, border: "1px solid rgba(184,225,13,0.2)", borderRadius: "50%",
      }}>
        <div className="absolute" style={{ width: 1, height: 80, background: "rgba(184,225,13,0.3)" }} />
        <div className="absolute" style={{ width: 80, height: 1, background: "rgba(184,225,13,0.3)" }} />
      </div>

      {/* Grade Ring */}
      <div
        className="z-[3] flex flex-col items-center justify-center"
        style={{
          width: 90, height: 90, borderRadius: "50%",
          border: "2px solid #B8E10D",
          background: "rgba(45,59,5,0.9)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: 34, color: "#B8E10D", letterSpacing: "0.04em", lineHeight: 1 }}>9.0</div>
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, color: "#8AAD09", letterSpacing: "0.15em" }}>GRADE</div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-6 z-[3] text-center">
        <div style={{ fontFamily: "var(--font-tech)", fontSize: 11, letterSpacing: "0.15em", color: "#B8E10D", textTransform: "uppercase" }}>
          Analysis Complete
        </div>
      </div>
    </div>

    {/* LCD Box */}
    <div
      className="relative overflow-hidden rounded-[10px] p-3 mb-[14px]"
      style={{ background: "#2D3B05", border: "1px solid rgba(184,225,13,0.2)" }}
    >
      <div className="absolute inset-0" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        pointerEvents: "none",
      }} />
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 9, letterSpacing: "0.15em", color: "#8AAD09", textTransform: "uppercase", marginBottom: 4, position: "relative" }}>
        Estimated Value
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#B8E10D", letterSpacing: "0.04em", lineHeight: 1, position: "relative" }}>
        $485.00
      </div>
      <div style={{ fontFamily: "var(--font-tech)", fontSize: 11, color: "#8AAD09", marginTop: 2, position: "relative" }}>
        Based on recent PSA 9 sales
      </div>
    </div>

    {/* Metrics */}
    <div className="flex items-center gap-2 mb-[10px]" style={{ fontFamily: "var(--font-tech)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
      Condition Metrics
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>

    <div className="rounded-[16px] p-4 mb-[10px]" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)" }}>
      {metrics.map((m) => (
        <div key={m.name} className="mb-3 last:mb-0">
          <div className="flex justify-between items-baseline mb-[5px]">
            <span style={{ fontFamily: "var(--font-tech)", fontSize: 10, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{m.name}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#B8E10D", letterSpacing: "0.02em" }}>{m.val}</span>
          </div>
          <div className="h-1 rounded-[2px] overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-[2px]" style={{ width: `${m.pct}%`, background: "linear-gradient(90deg, #2D3B05, #B8E10D)", transition: "width 0.6s ease" }} />
          </div>
        </div>
      ))}
    </div>

    {/* Diagnostics */}
    <div className="flex items-center gap-2 mb-[10px]" style={{ fontFamily: "var(--font-tech)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
      Diagnostics
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>

    <div className="rounded-[16px] p-4" style={{ background: "#1C1C28", border: "1px solid rgba(255,255,255,0.07)" }}>
      {diagnostics.map((d, i) => (
        <div key={i} className="flex gap-[10px]" style={{ padding: "9px 0", borderBottom: i < diagnostics.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
          <div className="flex-shrink-0 mt-[5px]" style={{ width: 6, height: 6, borderRadius: "50%", background: "#FCAB20" }} />
          <div style={{ fontFamily: "var(--font-tech)", fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.03em", lineHeight: 1.5 }}>{d}</div>
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
        Scan New Card
      </button>
      <button
        className="inline-flex items-center justify-center gap-[7px] rounded-[10px] cursor-pointer"
        style={{
          fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase",
          background: "rgba(89,172,153,0.15)", color: "#59AC99",
          padding: "11px 16px", border: "1px solid rgba(89,172,153,0.3)",
        }}
      >
        Save
      </button>
    </div>
  </div>
);

export default ScannerPage;
