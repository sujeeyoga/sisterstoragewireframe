import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Megaphone, AlertCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAnnouncementBanner,
  useSaveAnnouncementBanner,
  DEFAULT_ANNOUNCEMENT_MESSAGE,
  type AnnouncementBannerSettings,
} from '@/hooks/useAnnouncementBanner';

export function AnnouncementBannerCard() {
  const { banner, settingReadable, isLoading } = useAnnouncementBanner();
  const save = useSaveAnnouncementBanner();
  const [draft, setDraft] = useState<AnnouncementBannerSettings>(banner);

  useEffect(() => {
    if (!isLoading) setDraft(banner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, banner.enabled, banner.message, banner.buttonLabel, banner.buttonLink]);

  const persist = (next: AnnouncementBannerSettings) => {
    save.mutate(next, {
      onSuccess: () => toast.success('Banner updated'),
      onError: () => toast.error("Couldn't save the banner. Please try again."),
    });
  };

  const handleToggle = (checked: boolean) => {
    const next = { ...draft, enabled: checked };
    setDraft(next);
    persist(next);
  };

  const showPreview = draft.enabled && draft.message.trim().length > 0;
  const hasButton = Boolean(draft.buttonLabel.trim() && draft.buttonLink.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Announcement / Restock Banner
        </CardTitle>
        <CardDescription>
          A message strip across the top of your site. Off means it's hidden completely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="announcement-enabled" className="text-base">
              Show Banner
            </Label>
            <p className="text-sm text-muted-foreground">
              Turns the message on or off for every visitor right away.
            </p>
          </div>
          <Switch
            id="announcement-enabled"
            checked={draft.enabled}
            disabled={isLoading || save.isPending}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="announcement-message">Banner Message</Label>
          <Input
            id="announcement-message"
            value={draft.message}
            placeholder={DEFAULT_ANNOUNCEMENT_MESSAGE}
            onChange={(e) => setDraft({ ...draft, message: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="announcement-button-label">Button Label (optional)</Label>
            <Input
              id="announcement-button-label"
              value={draft.buttonLabel}
              placeholder="Shop now"
              onChange={(e) => setDraft({ ...draft, buttonLabel: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcement-button-link">Button Link (optional)</Label>
            <Input
              id="announcement-button-link"
              value={draft.buttonLink}
              placeholder="/shop"
              onChange={(e) => setDraft({ ...draft, buttonLink: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Live Preview</Label>
          {showPreview ? (
            <div className="overflow-hidden rounded-lg border">
              <div className="w-full bg-[hsl(var(--brand-pink))] text-white">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-sm font-medium">
                  <span>{draft.message}</span>
                  {hasButton && (
                    <span className="font-semibold underline underline-offset-4">
                      {draft.buttonLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Hidden — the banner takes up no space on your site.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => persist(draft)} disabled={save.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {save.isPending ? 'Saving…' : 'Save & Publish'}
          </Button>
        </div>

        {!settingReadable && !isLoading && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Saved settings can't be read right now, so the banner stays hidden on the
              site until this connection recovers.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
