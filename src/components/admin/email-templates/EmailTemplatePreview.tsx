import { useState } from "react";
import { Monitor, RefreshCw, Smartphone, AlertCircle } from "lucide-react";

interface EmailTemplatePreviewProps {
  html: string | null;
  loading: boolean;
  error: string | null;
  /** True when the html came from the local sample renderer, not the backend. */
  isMock?: boolean;
  onRetry?: () => void;
}

export const EmailTemplatePreview = ({
  html,
  loading,
  error,
  isMock = false,
  onRetry,
}: EmailTemplatePreviewProps) => {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const showSkeleton = loading && !html;

  return (
    <div className="et-panel et-pane">
      <div className="et-preview">
        <div className="et-pane-head">
          <div className="flex min-w-0 items-center gap-2">
            <span className="et-eyebrow">Preview</span>
            {isMock && html && <span className="et-badge-sample">Sample</span>}
            {loading && html && (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ color: "#858895" }} />
            )}
          </div>
          <div className="et-toggle">
            <button
              type="button"
              className="et-toggle-btn"
              data-active={device === "desktop"}
              aria-label="Desktop preview"
              onClick={() => setDevice("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="et-toggle-btn"
              data-active={device === "mobile"}
              aria-label="Mobile preview"
              onClick={() => setDevice("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && isMock && html && (
          <div className="et-warning et-warning-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#E88A00" }} />
            <div className="flex-1">
              <p className="font-semibold">Showing a sample render</p>
              <p>Live email service unreachable — this matches the layout customers receive.</p>
              {onRetry && (
                <button type="button" onClick={onRetry} className="mt-1.5 font-semibold underline">
                  Try the live render
                </button>
              )}
            </div>
          </div>
        )}

        {error && !isMock && (
          <div className="et-warning et-warning-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#E88A00" }} />
            <div className="flex-1">
              <p className="font-semibold">Preview didn’t refresh</p>
              <p>
                {html
                  ? "Showing the last version that rendered successfully."
                  : "We couldn’t render this email just now."}
              </p>
              {onRetry && (
                <button type="button" onClick={onRetry} className="mt-1.5 font-semibold underline">
                  Try again
                </button>
              )}
            </div>
          </div>
        )}

        <div className="et-canvas">
          {showSkeleton ? (
            <div className="et-email mx-auto w-full max-w-[620px] p-5">
              <div className="et-skeleton mx-auto h-6 w-40" />
              <div className="et-skeleton mt-5 h-32 w-full" />
              <div className="et-skeleton mt-5 h-5 w-3/4" />
              <div className="et-skeleton mt-3 h-4 w-full" />
              <div className="et-skeleton mt-2 h-4 w-5/6" />
              <div className="et-skeleton mt-5 h-24 w-full" />
            </div>
          ) : (
            <div className="et-email" style={{ maxWidth: device === "mobile" ? 390 : 620 }}>
              <iframe
                title="Email preview"
                srcDoc={html ?? ""}
                className="block h-full min-h-[420px] w-full bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
