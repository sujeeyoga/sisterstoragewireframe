import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type NetworkInformation = {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
  downlink?: number;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  };
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

function evaluate(): boolean {
  const connection = getConnection();
  // No Network Information API (e.g. iOS Safari) -> assume fast, never downgrade blindly.
  if (!connection) return false;
  if (connection.saveData) return true;
  const effectiveType = connection.effectiveType;
  if (effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g") {
    return true;
  }
  if (typeof connection.downlink === "number" && connection.downlink > 0 && connection.downlink < 1.5) {
    return true;
  }
  return false;
}

/**
 * Detects low-bandwidth conditions so heavy media can be swapped for lighter variants.
 * `isSlowMobile` is only true on phones, where data cost/speed matters most.
 */
export function useConnectionQuality() {
  const isMobile = useIsMobile();
  const [isSlowConnection, setIsSlowConnection] = useState<boolean>(() => evaluate());

  useEffect(() => {
    const connection = getConnection();
    if (!connection?.addEventListener) return;
    const onChange = () => setIsSlowConnection(evaluate());
    connection.addEventListener("change", onChange);
    onChange();
    return () => connection.removeEventListener?.("change", onChange);
  }, []);

  return {
    isSlowConnection,
    isSlowMobile: Boolean(isMobile) && isSlowConnection,
  };
}

export default useConnectionQuality;
