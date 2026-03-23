// ============================================================
// CarDex – Index (Roteamento interno + Lazy Loading)
// ============================================================
// Otimizações de performance aplicadas:
//   ✅ React.lazy → cada página só carrega quando acessada
//   ✅ Suspense com skeleton de loading por página
//   ✅ SplashScreen removida do DOM após a animação (não fica renderizando)
//   ✅ useCallback no handler de navegação (evita re-render do BottomNav)
// ============================================================

import { useState, useCallback, lazy, Suspense, useEffect } from "react";
import PhoneShell from "@/components/cardex/PhoneShell";
import SplashScreen from "@/components/cardex/SplashScreen";
import BottomNav from "@/components/cardex/BottomNav";

// Lazy loading por página → chunk separado por rota
const HomePage    = lazy(() => import("@/components/cardex/pages/HomePage"));
const MarketPage  = lazy(() => import("@/components/cardex/pages/MarketPage"));
const ScannerPage = lazy(() => import("@/components/cardex/pages/ScannerPage"));
const TradePage   = lazy(() => import("@/components/cardex/pages/TradePage"));
const ProfilePage = lazy(() => import("@/components/cardex/pages/ProfilePage"));

const pages = ["home", "market", "scanner", "trade", "profile"] as const;
type Page = (typeof pages)[number];

// Splash dura ~3.1s (animações CSS: splashOut começa em 2.6s + 0.5s)
const SPLASH_DURATION_MS = 3_200;

// ──────────────────────────────────────────────────────────────
// SKELETON DE LOADING DE PÁGINA (exibido enquanto o chunk carrega)
// ──────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ padding: "16px 0" }}>
      {/* Simulação de header */}
      <div style={{ height: 10, width: 80, borderRadius: 4, background: "rgba(245,100,56,0.3)", marginBottom: 8 }} />
      <div style={{ height: 40, width: "60%", borderRadius: 6, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />
      {/* Simulação de cards */}
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 64, borderRadius: 12, marginBottom: 10,
            background: "linear-gradient(90deg, #1C1C28 25%, #252535 50%, #1C1C28 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────
const Index = () => {
  const [activePage, setActivePage] = useState<Page>("home");
  const [splashVisible, setSplashVisible] = useState(true);

  // Remove o SplashScreen do DOM após a animação terminar
  useEffect(() => {
    const t = setTimeout(() => setSplashVisible(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  // useCallback evita que o BottomNav re-renderize sem necessidade
  const handleNavigate = useCallback((page: Page) => {
    setActivePage(page);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "home":    return <HomePage />;
      case "market":  return <MarketPage />;
      case "scanner": return <ScannerPage />;
      case "trade":   return <TradePage />;
      case "profile": return <ProfilePage />;
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "radial-gradient(ellipse at 30% 0%, #1a1025 0%, #0A0A0F 60%)" }}
    >
      <PhoneShell>
        {/* Splash só existe no DOM durante a animação inicial */}
        {splashVisible && <SplashScreen />}

        {/* Notch */}
        <div className="h-[44px] flex-shrink-0 flex items-center justify-between px-7 relative z-10">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>
            9:41
          </span>
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-[24px]" />
          <div className="flex items-center gap-[5px]">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 00-6 0zm-4-4l2 2a7.07 7.07 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
            </svg>
          </div>
        </div>

        {/* Conteúdo da página com Suspense */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-[90px]"
          style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
        >
          <Suspense fallback={<PageSkeleton />}>
            {renderPage()}
          </Suspense>
        </div>

        <BottomNav active={activePage} onNavigate={handleNavigate} />
      </PhoneShell>
    </div>
  );
};

export default Index;
