import { Link } from 'react-router-dom';
import { MoreHorizontal, Maximize2, RotateCcw, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import assistantMark from '@/assets/admin-assistant-mark.png';

interface AssistantHeaderProps {
  onClear?: () => void;
  onClose?: () => void;
  /** Show an "Open full page" item (used inside the floating bubble). */
  fullPageLink?: boolean;
  onNavigate?: () => void;
}

export function AssistantHeader({
  onClear,
  onClose,
  fullPageLink,
  onNavigate,
}: AssistantHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b bg-background px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary">
        <img src={assistantMark} alt="" width={24} height={24} className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-tight">Store Assistant</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
          Online
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Assistant options"
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {fullPageLink && (
              <DropdownMenuItem asChild>
                <Link to="/admin/assistant" onClick={onNavigate}>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Open full page
                </Link>
              </DropdownMenuItem>
            )}
            {onClear && (
              <DropdownMenuItem onSelect={() => onClear()}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Start a new conversation
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default AssistantHeader;
