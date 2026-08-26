import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RotateCcw, Save, Send, AlertTriangle } from "lucide-react";
import type { EmailTemplateDefinition } from "@/lib/emailTemplateCatalog";
import { EmailTemplatePreview } from "./EmailTemplatePreview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { renderMockEmail } from "@/lib/mockEmailRender";

interface Props {
  template: EmailTemplateDefinition;
  savedOverride: { subject: string | null; blocks: Record<string, string> } | null;
  storageAvailable: boolean;
  onSaved: () => void;
  /** "split" = editor + preview with a draggable splitter, otherwise a single pane. */
  variant?: "split" | "editor" | "preview";
}

/** Renders {{token}} occurrences inside helper text as monospace chips. */
const HelperText = ({ text }: { text: string }) => (
  <p className="et-helper">
    {text.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
      /^\{\{[^}]+\}\}$/.test(part) ? (
        <span key={i} className="et-chip">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    )}
  </p>
);

export const EmailTemplateEditor = ({
  template,
  savedOverride,
  storageAvailable,
  onSaved,
  variant = "split",
}: Props) => {
  const { toast } = useToast();
  const defaults = useMemo(() => {
    const d: Record<string, string> = {};
    template.blocks.forEach((b) => (d[b.key] = b.defaultValue));
    return d;
  }, [template]);

  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [html, setHtml] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewIsMock, setPreviewIsMock] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setSubject(savedOverride?.subject ?? template.defaultSubject);
    setBlocks({ ...defaults, ...(savedOverride?.blocks ?? {}) });
  }, [template.key, savedOverride, defaults, template.defaultSubject]);

  const renderPreview = useCallback(async () => {
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          type: template.key,
          to: "preview@sisterstorage.com",
          data: template.sampleData,
          preview: true,
          previewSubject: subject,
          previewBlocks: blocks,
        },
      });
      if (error) throw error;
      if (!data?.html) throw new Error("No preview returned");
      setHtml(data.html);
      setPreviewIsMock(false);
    } catch (e: any) {
      // Backend unavailable (no admin session, function down): fall back to a
      // locally rendered sample so the panel still shows the real layout.
      setHtml(
        renderMockEmail({
          templateKey: template.key,
          subject,
          blocks,
          data: template.sampleData,
        })
      );
      setPreviewIsMock(true);
      setPreviewError(e?.message || "Could not reach the email service.");
    } finally {
      setPreviewLoading(false);
    }
  }, [template.key, template.sampleData, subject, blocks]);

  useEffect(() => {
    const timer = setTimeout(renderPreview, 400);
    return () => clearTimeout(timer);
  }, [renderPreview]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("email_template_overrides")
        .upsert(
          {
            template_key: template.key,
            subject: subject.trim() || null,
            blocks,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "template_key" }
        );
      if (error) throw error;
      toast({ title: "Saved", description: `${template.name} copy updated.` });
      onSaved();
    } catch (e: any) {
      toast({
        title: "Could not save",
        description: e?.message || "Email copy storage is not available yet.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSubject(template.defaultSubject);
    setBlocks({ ...defaults });
    if (!storageAvailable) return;
    try {
      await (supabase as any)
        .from("email_template_overrides")
        .delete()
        .eq("template_key", template.key);
      toast({ title: "Reset", description: "Default wording restored." });
      onSaved();
    } catch {
      /* ignore */
    }
  };

  const handleTestSend = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(testEmail.trim())) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          type: template.key,
          to: testEmail.trim(),
          data: template.sampleData,
          previewSubject: subject,
          previewBlocks: blocks,
        },
      });
      if (error) throw error;
      toast({ title: "Test sent", description: `Sent to ${testEmail.trim()}` });
    } catch (e: any) {
      toast({ title: "Test send failed", description: e?.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const editorPane = (
    <div className="et-panel et-pane">
      <div className="et-scroll">
        <div className="et-editor">
            <div className="flex items-center gap-3">
              <h2 className="et-panel-title">{template.name}</h2>
              <span className="et-badge">
                {template.audience === "customer" ? "Customer" : "Internal"}
              </span>
            </div>
            <p className="mt-2 text-[14px]" style={{ color: "#5F6270" }}>
              {template.trigger}
            </p>
            <div className="mt-4">
              <p className="et-meta-label">Recipient</p>
              <p className="et-meta-value">{template.recipient}</p>
            </div>

            {!storageAvailable && (
              <div className="et-warning">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" style={{ color: "#E88A00" }} />
                <div>
                  <p className="font-semibold">Saving temporarily unavailable</p>
                  <p>You can continue editing, previewing and sending test emails.</p>
                </div>
              </div>
            )}

            <div className="mt-5 space-y-5">
              <div>
                <label className="et-label" htmlFor="et-subject">
                  Subject line
                </label>
                <input
                  id="et-subject"
                  className="et-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                {template.subjectHelp && <HelperText text={template.subjectHelp} />}
              </div>

              {template.blocks.length === 0 && (
                <p className="text-[14px]" style={{ color: "#5F6270" }}>
                  This email has no editable text blocks — only the subject line can be changed.
                </p>
              )}

              {template.blocks.map((block) => (
                <div key={block.key}>
                  <label className="et-label" htmlFor={`et-${block.key}`}>
                    {block.label}
                  </label>
                  {block.multiline ? (
                    <textarea
                      id={`et-${block.key}`}
                      className="et-textarea"
                      value={blocks[block.key] ?? ""}
                      onChange={(e) => setBlocks((b) => ({ ...b, [block.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      id={`et-${block.key}`}
                      className="et-input"
                      value={blocks[block.key] ?? ""}
                      onChange={(e) => setBlocks((b) => ({ ...b, [block.key]: e.target.value }))}
                    />
                  )}
                  {block.helpText && <HelperText text={block.helpText} />}
                </div>
              ))}
            </div>

          <div className="et-footer">
              <button type="button" className="et-btn-secondary" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                Reset to default
              </button>
              <button
                type="button"
                className="et-btn-primary"
                onClick={handleSave}
                disabled={saving || !storageAvailable}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save copy
              </button>
            </div>

          <div className="et-subpanel">
            <p className="et-eyebrow">Send a test</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                className="et-input"
                type="email"
                placeholder="you@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <button
                type="button"
                className="et-btn-primary flex-shrink-0"
                onClick={handleTestSend}
                disabled={sending}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const previewPane = (
    <EmailTemplatePreview
      html={html}
      loading={previewLoading}
      error={previewError}
      isMock={previewIsMock}
      onRetry={renderPreview}
    />
  );

  if (variant === "editor") return editorPane;
  if (variant === "preview") return previewPane;

  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="et-editor-preview">
      <ResizablePanel defaultSize={52} minSize={30} className="et-col">
        {editorPane}
      </ResizablePanel>
      <ResizableHandle withHandle className="et-handle" />
      <ResizablePanel defaultSize={48} minSize={28} className="et-col">
        {previewPane}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
