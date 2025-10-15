import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminEditModeContextType {
  isEditMode: boolean;
  isAdmin: boolean;
  toggleEditMode: () => void;
  updateSiteText: (id: string, field: string, value: string) => Promise<void>;
  updateHeroImage: (id: string, imageUrl: string, altText?: string) => Promise<void>;
}

const AdminEditModeContext = createContext<AdminEditModeContextType | undefined>(undefined);

export function AdminEditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check admin status on mount
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      setIsAdmin(data?.role === 'admin');
    };
    checkAdmin();
  }, []);

  const toggleEditMode = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can enable edit mode",
        variant: "destructive"
      });
      return;
    }
    const newMode = !isEditMode;
    setIsEditMode(newMode);
    toast({
      title: newMode ? "Edit Mode Enabled" : "Edit Mode Disabled",
      description: newMode 
        ? "Click elements to edit them" 
        : "Changes saved automatically"
    });
  };

  const updateSiteText = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from('site_texts')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update text",
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Saved",
      description: "Text updated successfully"
    });
  };

  const updateHeroImage = async (id: string, imageUrl: string, altText?: string) => {
    const updates: any = { image_url: imageUrl, updated_at: new Date().toISOString() };
    if (altText !== undefined) updates.alt_text = altText;

    const { error } = await supabase
      .from('hero_images')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Saved",
      description: "Image updated successfully"
    });
  };

  return (
    <AdminEditModeContext.Provider value={{
      isEditMode,
      isAdmin,
      toggleEditMode,
      updateSiteText,
      updateHeroImage
    }}>
      {children}
    </AdminEditModeContext.Provider>
  );
}

export function useAdminEditMode() {
  const context = useContext(AdminEditModeContext);
  if (!context) {
    throw new Error('useAdminEditMode must be used within AdminEditModeProvider');
  }
  return context;
}
