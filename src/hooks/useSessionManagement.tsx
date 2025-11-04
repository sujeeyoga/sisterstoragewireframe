import { useEffect, useRef } from "react";

/**
 * Centralized session management hook
 * Ensures consistent session_id across all features (cart tracking, visitor analytics, etc.)
 */
export const useSessionManagement = () => {
  const sessionId = useRef<string>("");
  const visitorId = useRef<string>("");
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Get or create session ID and visitor ID
    const initializeSession = () => {
      // Get or create visitor ID (persists across sessions)
      let storedVisitorId = localStorage.getItem("visitor_id");
      if (!storedVisitorId) {
        storedVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("visitor_id", storedVisitorId);
        console.log("[Session] Created new visitor_id:", storedVisitorId);
      }
      visitorId.current = storedVisitorId;

      // Get or create session ID (unique per session)
      let storedSessionId = localStorage.getItem("visitor_session_id");
      if (!storedSessionId) {
        storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("visitor_session_id", storedSessionId);
        console.log("[Session] Created new session_id:", storedSessionId);
      } else {
        console.log("[Session] Using existing session_id:", storedSessionId);
      }
      sessionId.current = storedSessionId;

      hasInitialized.current = true;
    };

    initializeSession();
  }, []);

  return {
    sessionId: sessionId.current,
    visitorId: visitorId.current,
    hasInitialized: hasInitialized.current,
  };
};
