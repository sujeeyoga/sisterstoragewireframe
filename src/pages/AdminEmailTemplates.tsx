import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { EMAIL_TEMPLATES } from "@/lib/emailTemplateCatalog";
import { EmailTemplateEditor } from "@/components/admin/email-templates/EmailTemplateEditor";
import { EmailTemplateList } from "@/components/admin/email-templates/EmailTemplateList";
import { Mail, Info } from "lucide-react";

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
      <div className="et-scope">
        <div className="et-shell">
          <header className="mb-6 flex items-start gap-4">
            <span className="et-icon-tile">
              <Mail className="h-6 w-6" />
            </span>
            <div>
              <h1 className="et-title">Email Templates</h1>
              <p className="et-subtitle">
                Manage the emails your customers receive — preview, edit the wording, send a test.
              </p>
            </div>
          </header>

          <div className="et-workspace">
            <EmailTemplateList
              templates={EMAIL_TEMPLATES}
              selected={selected}
              edited={overrides}
              onSelect={setSelected}
            />

            <EmailTemplateEditor
              key={template.key}
              template={template}
              savedOverride={overrides[template.key] ?? null}
              storageAvailable={storageAvailable}
              onSaved={loadOverrides}
            />
          </div>

          {!storageAvailable && (
            <div className="et-status">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#858895" }} />
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "#121426" }}>
                    Saving unavailable
                  </p>
                  <p className="text-[13px]" style={{ color: "#5F6270" }}>
                    Email copy storage is temporarily unavailable. Editing and previewing still work.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailTemplates;
