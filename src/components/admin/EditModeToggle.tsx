import { useAdminEditMode } from '@/contexts/AdminEditModeContext';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function EditModeToggle() {
  const { isAdmin } = useAdminEditMode();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on admin pages
  if (!isAdmin || location.pathname.startsWith('/admin')) return null;

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => navigate('/admin')}
      className="fixed bottom-6 right-6 z-[9999] shadow-2xl min-h-[56px] min-w-[56px] touch-manipulation hover:scale-105 active:scale-95 transition-transform"
      aria-label="Go to Admin Panel"
    >
      <Settings className="w-5 h-5 md:mr-2" />
      <span className="hidden md:inline">Admin Panel</span>
    </Button>
  );
}
