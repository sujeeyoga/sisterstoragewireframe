import { useEffect } from 'react';

export const useCodeProtection = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    // Disable keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I / Cmd+Option+I (Dev Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };

    // Console warning message
    const consoleMessage = () => {
      console.clear();
      console.log(
        '%c⚠️ Stop!',
        'color: #FB0657; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 0 #000;'
      );
      console.log(
        '%cThis browser feature is intended for developers. If someone told you to copy-paste something here to enable a feature or "hack" someone\'s account, it is a scam.',
        'color: #666; font-size: 14px;'
      );
      console.log(
        '%cSister Storage - sisterstoragecanada.com',
        'color: #FB0657; font-size: 12px;'
      );
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Show console message after a brief delay
    const timeoutId = setTimeout(consoleMessage, 1000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [enabled]);
};
