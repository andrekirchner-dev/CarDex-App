type NavPage = "home" | "market" | "scanner" | "trade" | "profile";

const navItems: { id: NavPage; label: string; icon: JSX.Element; center?: boolean }[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg className="nav-svg" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "market",
    label: "Market",
    icon: (
      <svg className="nav-svg" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    id: "scanner",
    label: "Scan",
    center: true,
    icon: (
      <svg className="nav-svg" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    id: "trade",
    label: "Trade",
    icon: (
      <svg className="nav-svg" viewBox="0 0 24 24">
        <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" />
        <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg className="nav-svg" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const BottomNav = ({ active, onNavigate }: { active: NavPage; onNavigate: (p: NavPage) => void }) => (
  <div
    className="absolute bottom-0 left-0 right-0 grid grid-cols-5 z-[100]"
    style={{
      height: 82,
      background: "rgba(10,10,15,0.95)",
      backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "10px 0 24px",
    }}
  >
    {navItems.map((item) => {
      const isActive = active === item.id;
      return (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer"
          style={{ padding: "4px 0", transition: "all 0.2s" }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: item.center ? 36 : 28,
              height: item.center ? 36 : 28,
              borderRadius: item.center ? 12 : 8,
              background: item.center
                ? isActive ? "rgba(252,171,32,0.2)" : "rgba(252,171,32,0.08)"
                : isActive ? "rgba(252,171,32,0.12)" : "transparent",
              border: item.center ? `1px solid ${isActive ? "rgba(252,171,32,0.4)" : "rgba(252,171,32,0.15)"}` : "none",
              transition: "all 0.2s",
            }}
          >
            <div style={{
              width: item.center ? 20 : 18,
              height: item.center ? 20 : 18,
            }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? "#FCAB20" : "rgba(255,255,255,0.3)"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "100%", height: "100%" }}
              >
                {item.icon.props.children}
              </svg>
            </div>
          </div>
          <span
            style={{
              fontFamily: "var(--font-tech)",
              fontSize: 9,
              letterSpacing: "0.08em",
              color: isActive ? "#FCAB20" : "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </span>
        </button>
      );
    })}
  </div>
);

export default BottomNav;
