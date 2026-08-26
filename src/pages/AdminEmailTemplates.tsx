import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { EMAIL_TEMPLATES } from "@/lib/emailTemplateCatalog";
import { EmailTemplateEditor } from "@/components/admin/email-templates/EmailTemplateEditor";
import { EmailTemplateList } from "@/components/admin/email-templates/EmailTemplateList";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Mail, Info } from "lucide-react";

type Override = { subject: string | null; blocks: Record<string, string> };
type Tab = "templates" | "editor" | "preview";

/** Below this width the three panes become tabs instead of resizable columns. */
const SPLIT_MIN_WIDTH = 820;

const useIsSplitLayout = () => {
  const [isSplit, setIsSplit] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= SPLIT_MIN_WIDTH
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${SPLIT_MIN_WIDTH}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsSplit(e.matches);
    setIsSplit(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isSplit;
};

const AdminEmailTemplates = () => {
  const [selected, setSelected] = useState(EMAIL_TEMPLATES[0].key);
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [tab, setTab] = useState<Tab>("templates");
  const isSplit = useIsSplitLayout();

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

  const list = (
    <EmailTemplateList
      templates={EMAIL_TEMPLATES}
      selected={selected}
      edited={overrides}
      onSelect={(key) => {
        setSelected(key);
        if (!isSplit) setTab("editor");
      }}
    />
  );

  const editorProps = {
    template,
    savedOverride: overrides[template.key] ?? null,
    storageAvailable,
    onSaved: loadOverrides,
  };

  return (
    <AdminLayout>
      <div className="et-scope">
        <div className="et-shell">
          <header className="mb-4 flex items-start gap-3">
            <span className="et-icon-tile">
              <Mail className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="et-title">Email Templates</h1>
              <p className="et-subtitle">
                Preview, edit the wording and send a test of the emails customers receive.
              </p>
            </div>
          </header>

          {!isSplit && (
            <div className="et-tabs" role="tablist">
              {(
                [
                  ["templates", "Templates"],
                  ["editor", "Edit"],
                  ["preview", "Preview"],
                ] as [Tab, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  className="et-tab"
                  data-active={tab === key}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="et-frame">
            {isSplit ? (
              <ResizablePanelGroup direction="horizontal" autoSaveId="et-workspace">
                <ResizablePanel defaultSize={27} minSize={16} className="et-col">
                  {list}
                </ResizablePanel>
                <ResizableHandle withHandle className="et-handle" />
                <ResizablePanel defaultSize={73} minSize={40} className="et-col">
                  <EmailTemplateEditor key={template.key} {...editorProps} variant="split" />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : tab === "templates" ? (
              list
            ) : (
              <EmailTemplateEditor
                key={template.key}
                {...editorProps}
                variant={tab === "preview" ? "preview" : "editor"}
              />
            )}
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
