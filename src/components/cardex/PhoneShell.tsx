import { ReactNode } from "react";

const PhoneShell = ({ children }: { children: ReactNode }) => (
  <div
    className="relative flex flex-col overflow-hidden"
    style={{
      width: 390,
      height: 844,
      background: "linear-gradient(160deg, #1e1e2e 0%, #12121A 50%, #0D0D18 100%)",
      borderRadius: 52,
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.8), 0 40px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 80px rgba(231,54,60,0.08)",
    }}
  >
    {children}
  </div>
);

export default PhoneShell;
