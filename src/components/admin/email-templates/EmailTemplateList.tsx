import { ChevronRight, Megaphone, Package, ShieldCheck, Tag, Truck, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { EmailTemplateDefinition } from "@/lib/emailTemplateCatalog";

const ICONS: Record<string, { icon: LucideIcon; bg: string; fg: string }> = {
  order_confirmation: { icon: Package, bg: "#FFE8F2", fg: "#FF007A" },
  shipping_notification: { icon: Truck, bg: "#EEEEFF", fg: "#635BFF" },
  delayed_tracking: { icon: MapPin, bg: "#F0EFFF", fg: "#7367F0" },
  announcement: { icon: Megaphone, bg: "#EAFAEF", fg: "#1FB65B" },
  promotional: { icon: Tag, bg: "#FFF5E5", fg: "#E99800" },
};

const FALLBACK = { icon: ShieldCheck, bg: "#F1EFFF", fg: "#7267F0" };

/** Short, sentence-case description derived from the longer trigger sentence. */
const shortDescription = (trigger: string) => {
  const firstSentence = trigger.split(/(?<=\.)\s/)[0] ?? trigger;
  return firstSentence.length > 78 ? `${firstSentence.slice(0, 75).trimEnd()}…` : firstSentence;
};

interface Props {
  templates: EmailTemplateDefinition[];
  selected: string;
  edited: Record<string, unknown>;
  onSelect: (key: string) => void;
}

export const EmailTemplateList = ({ templates, selected, edited, onSelect }: Props) => (
  <div className="et-panel et-pane">
    <div className="et-panel-header">
      <span className="et-eyebrow">Templates</span>
    </div>
    <div className="et-scroll py-1">
      {templates.map((t) => {
        const { icon: Icon, bg, fg } = ICONS[t.key] ?? FALLBACK;
        return (
          <button
            key={t.key}
            type="button"
            className="et-item"
            data-selected={selected === t.key}
            onClick={() => onSelect(t.key)}
          >
            <span className="et-item-icon" style={{ background: bg, color: fg }}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="et-item-name truncate">{t.name}</span>
                {edited[t.key] && <span className="et-badge-neutral">Edited</span>}
              </span>
              <span className="et-item-desc block">{shortDescription(t.trigger)}</span>
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "#B9BAC4" }} />
          </button>
        );
      })}
    </div>
  </div>
);
