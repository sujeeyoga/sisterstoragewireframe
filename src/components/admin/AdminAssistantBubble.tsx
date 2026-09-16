import { useState } from 'react';
import { X, MessageCircle, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminAssistantChat } from './AdminAssistantChat';
import assistantMark from '@/assets/admin-assistant-mark.png';

export function AdminAssistantBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[min(34rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
          <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2">
            <img
              src={assistantMark}
              alt=""
              width={24}
              height={24}
              loading="lazy"
              className="h-6 w-6"
            />
            <span className="text-sm font-semibold">Admin Assistant</span>
            <div className="ml-auto flex items-center gap-1">
              <Link
                to="/admin/assistant"
                onClick={() => setOpen(false)}
                aria-label="Open full page"
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 p-2">
            <AdminAssistantChat onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Ask the admin assistant'}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:opacity-90"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </>
  );
}

export default AdminAssistantBubble;
