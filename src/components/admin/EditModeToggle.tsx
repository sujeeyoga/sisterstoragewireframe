import { useAdminEditMode } from '@/contexts/AdminEditModeContext';
import { Button } from '@/components/ui/button';
import { Pencil, Check } from 'lucide-react';

export function EditModeToggle() {
  const { isEditMode, isAdmin, toggleEditMode } = useAdminEditMode();

  if (!isAdmin) return null;

  return (
    <Button
      variant={isEditMode ? "default" : "outline"}
      size="lg"
      onClick={toggleEditMode}
      className="fixed bottom-6 right-6 z-[9999] shadow-2xl min-h-[56px] min-w-[56px] touch-manipulation hover:scale-105 active:scale-95 transition-transform"
      aria-label={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
    >
      {isEditMode ? (
        <>
          <Check className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">Exit Edit Mode</span>
        </>
      ) : (
        <>
          <Pencil className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">Edit Mode</span>
        </>
      )}
    </Button>
  );
}
