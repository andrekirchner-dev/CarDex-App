import { useState } from "react";
import SplashScreen from "@/components/cardex/SplashScreen";
import PhoneShell from "@/components/cardex/PhoneShell";
import BottomNav from "@/components/cardex/BottomNav";
import HomePage from "@/components/cardex/pages/HomePage";
import MarketPage from "@/components/cardex/pages/MarketPage";
import ScannerPage from "@/components/cardex/pages/ScannerPage";
import TradePage from "@/components/cardex/pages/TradePage";
import ProfilePage from "@/components/cardex/pages/ProfilePage";

const pages = ["home", "market", "scanner", "trade", "profile"] as const;
type Page = (typeof pages)[number];

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("home");

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage />;
      case "market": return <MarketPage />;
      case "scanner": return <ScannerPage />;
      case "trade": return <TradePage />;
      case "profile": return <ProfilePage />;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "radial-gradient(ellipse at 30% 0%, #1a1025 0%, #0A0A0F 60%)" }}>
      <PhoneShell>
        <SplashScreen />
        {/* Notch */}
        <div className="h-[44px] flex-shrink-0 flex items-center justify-between px-7 relative z-10">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>9:41</span>
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-[24px]" />
          <div className="flex items-center gap-[5px]">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 00-6 0zm-4-4l2 2a7.07 7.07 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.34C7 21.4 7.6 22 8.33 22h7.34c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-[90px]" style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}>
          {renderPage()}
        </div>

        <BottomNav active={activePage} onNavigate={setActivePage} />
      </PhoneShell>
    </div>
  );
};

export default Index;
