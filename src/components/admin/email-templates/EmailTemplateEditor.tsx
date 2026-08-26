import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RotateCcw, Save, Send, AlertTriangle } from "lucide-react";
import type { EmailTemplateDefinition } from "@/lib/emailTemplateCatalog";
import { EmailTemplatePreview } from "./EmailTemplatePreview";

interface Props {
  template: EmailTemplateDefinition;
  savedOverride: { subject: string | null; blocks: Record<string, string> } | null;
  storageAvailable: boolean;
  onSaved: () => void;
}

export const EmailTemplateEditor = ({ template, savedOverride, storageAvailable, onSaved }: Props) => {
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
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setSubject(savedOverride?.subject ?? template.defaultSubject);
    setBlocks({ ...defaults, ...(savedOverride?.blocks ?? {}) });
  }, [template.key, savedOverride, defaults, template.defaultSubject]);

  const renderPreview = async () => {
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
    } catch (e: any) {
      setPreviewError(e?.message || "Could not render this preview.");
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(renderPreview, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.key, subject, JSON.stringify(blocks)]);

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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <Badge variant={template.audience === "customer" ? "default" : "secondary"}>
                {template.audience === "customer" ? "Customer" : "Internal"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{template.trigger}</p>
            <p className="text-xs text-muted-foreground">Recipient: {template.recipient}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!storageAvailable && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Saving is temporarily unavailable while the backend storage for email copy is being
                  restored. You can still preview and send tests.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Subject line</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              {template.subjectHelp && (
                <p className="text-xs text-muted-foreground">{template.subjectHelp}</p>
              )}
            </div>

            {template.blocks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                This email has no editable text blocks — only the subject line can be changed.
              </p>
            )}

            {template.blocks.map((block) => (
              <div key={block.key} className="space-y-2">
                <Label>{block.label}</Label>
                {block.multiline ? (
                  <Textarea
                    rows={3}
                    value={blocks[block.key] ?? ""}
                    onChange={(e) => setBlocks((b) => ({ ...b, [block.key]: e.target.value }))}
                  />
                ) : (
                  <Input
                    value={blocks[block.key] ?? ""}
                    onChange={(e) => setBlocks((b) => ({ ...b, [block.key]: e.target.value }))}
                  />
                )}
                {block.helpText && (
                  <p className="text-xs text-muted-foreground">{block.helpText}</p>
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving || !storageAvailable}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save copy
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to default
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Send a test</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              placeholder="you@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <Button onClick={handleTestSend} disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send test
            </Button>
          </CardContent>
        </Card>
      </div>

      <EmailTemplatePreview html={html} loading={previewLoading} error={previewError} />
    </div>
  );
};
