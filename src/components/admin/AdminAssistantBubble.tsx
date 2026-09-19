import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { AdminAssistantChat } from './AdminAssistantChat';

export function AdminAssistantBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[min(38rem,calc(100vh-7rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl shadow-2xl">
          <AdminAssistantChat
            onNavigate={() => setOpen(false)}
            onClose={() => setOpen(false)}
            fullPageLink
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Ask the store assistant'}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:opacity-90"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </>
  );
}

export default AdminAssistantBubble;
