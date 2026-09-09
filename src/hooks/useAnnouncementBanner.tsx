import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SETTING_KEY = 'announcement_banner';

export const DEFAULT_ANNOUNCEMENT_MESSAGE =
  "We're restocking! More items coming soon.";

export interface AnnouncementBannerSettings {
  enabled: boolean;
  message: string;
  buttonLabel: string;
  buttonLink: string;
}

export const DEFAULT_ANNOUNCEMENT: AnnouncementBannerSettings = {
  enabled: false,
  message: DEFAULT_ANNOUNCEMENT_MESSAGE,
  buttonLabel: '',
  buttonLink: '',
};

const normalize = (value: any): AnnouncementBannerSettings => ({
  enabled: Boolean(value?.enabled),
  message:
    typeof value?.message === 'string' && value.message.trim()
      ? value.message
      : DEFAULT_ANNOUNCEMENT_MESSAGE,
  buttonLabel: typeof value?.buttonLabel === 'string' ? value.buttonLabel : '',
  buttonLink: typeof value?.buttonLink === 'string' ? value.buttonLink : '',
});

export const useAnnouncementBanner = () => {
  const query = useQuery({
    queryKey: ['announcement-banner'],
    queryFn: async (): Promise<{
      settings: AnnouncementBannerSettings;
      readable: boolean;
    }> => {
      try {
        const { data, error } = await (supabase as any)
          .from('store_settings')
          .select('setting_value')
          .eq('setting_key', SETTING_KEY)
          .maybeSingle();

        if (error) return { settings: DEFAULT_ANNOUNCEMENT, readable: false };
        if (!data) return { settings: DEFAULT_ANNOUNCEMENT, readable: true };
        return { settings: normalize(data.setting_value), readable: true };
      } catch {
        return { settings: DEFAULT_ANNOUNCEMENT, readable: false };
      }
    },
    staleTime: 1000 * 60,
  });

  return {
    banner: query.data?.settings ?? DEFAULT_ANNOUNCEMENT,
    settingReadable: query.data?.readable ?? false,
    isLoading: query.isLoading,
  };
};

export const useSaveAnnouncementBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: AnnouncementBannerSettings) => {
      const { error } = await (supabase as any)
        .from('store_settings')
        .upsert(
          {
            setting_key: SETTING_KEY,
            setting_value: settings,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'setting_key' }
        );

      if (error) throw error;
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement-banner'] });
    },
  });
};
