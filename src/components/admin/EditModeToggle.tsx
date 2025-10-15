import { useAdminEditMode } from '@/contexts/AdminEditModeContext';
import { Button } from '@/components/ui/button';
import { Pencil, Check } from 'lucide-react';

export function EditModeToggle() {
  const { isEditMode, isAdmin, toggleEditMode } = useAdminEditMode();

  if (!isAdmin) return null;

  return (
    <Button
      variant={isEditMode ? "default" : "outline"}
      size="sm"
      onClick={toggleEditMode}
      className="fixed bottom-4 right-4 z-50 shadow-lg"
    >
      {isEditMode ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Exit Edit Mode
        </>
      ) : (
        <>
          <Pencil className="w-4 h-4 mr-2" />
          Edit Mode
        </>
      )}
    </Button>
  );
}
