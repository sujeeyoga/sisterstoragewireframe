import { Loader2, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EmailTemplatePreviewProps {
  html: string | null;
  loading: boolean;
  error: string | null;
}

export const EmailTemplatePreview = ({ html, loading, error }: EmailTemplatePreviewProps) => {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Preview</span>
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={device === "desktop" ? "default" : "outline"}
            onClick={() => setDevice("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={device === "mobile" ? "default" : "outline"}
            onClick={() => setDevice("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 flex justify-center">
        {loading ? (
          <div className="flex h-[500px] items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Rendering preview…
          </div>
        ) : error ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-destructive text-center px-6">
            {error}
          </div>
        ) : (
          <iframe
            title="Email preview"
            srcDoc={html ?? ""}
            className="h-[700px] w-full rounded-md border bg-background"
            style={{ maxWidth: device === "mobile" ? 390 : "100%" }}
          />
        )}
      </div>
    </div>
  );
};
