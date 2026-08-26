import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { EMAIL_TEMPLATES } from "@/lib/emailTemplateCatalog";
import { EmailTemplateEditor } from "@/components/admin/email-templates/EmailTemplateEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Override = { subject: string | null; blocks: Record<string, string> };

const AdminEmailTemplates = () => {
  const [selected, setSelected] = useState(EMAIL_TEMPLATES[0].key);
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [storageAvailable, setStorageAvailable] = useState(true);

  const loadOverrides = async () => {
    const { data, error } = await (supabase as any)
      .from("email_template_overrides")
      .select("template_key, subject, blocks");

    if (error) {
      setStorageAvailable(false);
      return;
    }
    setStorageAvailable(true);
    const map: Record<string, Override> = {};
    (data ?? []).forEach((row: any) => {
      map[row.template_key] = { subject: row.subject, blocks: row.blocks || {} };
    });
    setOverrides(map);
  };

  useEffect(() => {
    loadOverrides();
  }, []);

  const template = EMAIL_TEMPLATES.find((t) => t.key === selected)!;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-1">
            Every email that goes out to customers — preview it, edit the wording, and send yourself a test.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit">
            <CardContent className="p-2">
              {EMAIL_TEMPLATES.map((t) => {
                const customized = Boolean(overrides[t.key]);
                return (
                  <button
                    key={t.key}
                    onClick={() => setSelected(t.key)}
                    className={cn(
                      "w-full rounded-md px-3 py-2 text-left transition-colors",
                      selected === t.key ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{t.name}</span>
                      {customized && (
                        <Badge variant="outline" className="text-[10px]">
                          Edited
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-2">{t.trigger}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <EmailTemplateEditor
            key={template.key}
            template={template}
            savedOverride={overrides[template.key] ?? null}
            storageAvailable={storageAvailable}
            onSaved={loadOverrides}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailTemplates;
