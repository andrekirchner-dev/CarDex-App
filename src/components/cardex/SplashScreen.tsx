const SplashScreen = () => (
  <div
    className="absolute inset-0 z-[999] flex flex-col items-center justify-center gap-0 bg-black"
    style={{
      borderRadius: 52,
      animation: "splashOut 0.5s ease 2.6s both",
    }}
  >
    {/* Icon */}
    <div
      className="mb-5 flex items-center justify-center"
      style={{
        width: 80, height: 80,
        animation: "iconPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
      }}
    >
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect x="4" y="8" width="36" height="48" rx="4" stroke="#E7363C" strokeWidth="2.5" fill="none" />
        <rect x="20" y="4" width="36" height="48" rx="4" stroke="#FCAB20" strokeWidth="2.5" fill="none" />
        <circle cx="38" cy="20" r="6" stroke="#59AC99" strokeWidth="2" fill="none" />
        <path d="M12 44l8-12 6 8 4-4 8 8" stroke="#F56438" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>

    {/* Logo */}
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 52,
        letterSpacing: "0.08em",
        background: "linear-gradient(90deg, #E7363C, #F56438, #FCAB20, #59AC99)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "logoReveal 0.6s ease 0.5s both",
      }}
    >
      CARDEX
    </span>

    {/* Subtitle */}
    <span
      style={{
        fontFamily: "var(--font-tech)",
        fontSize: 10,
        letterSpacing: "0.3em",
        color: "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
        marginTop: 6,
        animation: "logoReveal 0.4s ease 0.8s both",
      }}
    >
      Professional Card Index
    </span>

    {/* Color lines */}
    <div
      className="flex flex-col gap-[3px] mt-[22px] w-[240px]"
      style={{ animation: "logoReveal 0.4s ease 1s both" }}
    >
      <div className="h-[2px] rounded-[1px]" style={{ background: "#E7363C" }} />
      <div className="h-[2px] rounded-[1px]" style={{ background: "#F56438" }} />
      <div className="h-[2px] rounded-[1px]" style={{ background: "#59AC99" }} />
    </div>

    {/* Progress bar */}
    <div
      className="mt-7 w-[160px] h-[3px] rounded-[2px] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.08)", animation: "logoReveal 0.3s ease 1.2s both" }}
    >
      <div
        className="h-full rounded-[2px]"
        style={{
          background: "linear-gradient(90deg, #E7363C, #FCAB20)",
          animation: "barGrow 1.2s ease 1.2s both",
        }}
      />
    </div>
  </div>
);

export default SplashScreen;
