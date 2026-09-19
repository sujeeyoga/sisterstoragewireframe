import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { isApprovedAdminRoute } from '@/config/adminAssistantRoutes';

export interface AnswerCardData {
  title?: string;
  summary?: string | null;
  stats?: { label: string; value: string; note?: string | null }[] | null;
  checks?: { label: string; status: 'ok' | 'warn' | 'fail'; detail?: string | null }[] | null;
  steps?: string[] | null;
  caution?: string | null;
  actions?: { label: string; href: string }[] | null;
}

const STATUS_META = {
  ok: { Icon: CheckCircle2, pill: 'Complete', tone: 'text-success' },
  warn: { Icon: Circle, pill: 'Needs a look', tone: 'text-caution' },
  fail: { Icon: XCircle, pill: 'Problem', tone: 'text-destructive' },
} as const;

/** Only allow approved admin routes, plus the storefront home. */
function safeHref(href: unknown): string | null {
  if (typeof href !== 'string') return null;
  if (href === '/') return '/';
  return isApprovedAdminRoute(href) ? href : null;
}

export function AssistantAnswerCard({
  card,
  onNavigate,
}: {
  card: AnswerCardData;
  onNavigate?: () => void;
}) {
  const stats = (card.stats ?? []).slice(0, 3);
  const checks = card.checks ?? [];
  const steps = card.steps ?? [];
  const actions = (card.actions ?? [])
    .map((a) => ({ label: a.label, href: safeHref(a.href) }))
    .filter((a): a is { label: string; href: string } => Boolean(a.href))
    .slice(0, 3);

  return (
    <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
      {card.title && <h3 className="text-base font-semibold leading-snug">{card.title}</h3>}
      {card.summary && (
        <p className="mt-1 text-sm text-muted-foreground">{card.summary}</p>
      )}

      {stats.length > 0 && (
        <div className="mt-3 grid gap-3 rounded-lg bg-muted/60 p-3 sm:grid-cols-2">
          {stats.map((s, i) => (
            <div key={i} className="min-w-0">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold">{s.value}</p>
              {s.note && <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>}
            </div>
          ))}
        </div>
      )}

      {checks.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-lg border">
          <p className="border-b bg-muted/40 px-3 py-2 text-sm font-medium">Checks completed</p>
          {checks.map((c, i) => {
            const meta = STATUS_META[c.status] ?? STATUS_META.ok;
            const { Icon } = meta;
            return (
              <Collapsible key={i} className="border-b last:border-b-0">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Icon className={`h-4 w-4 shrink-0 ${meta.tone}`} />
                  <span className="min-w-0 flex-1 truncate text-sm">{c.label}</span>
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success-soft-foreground">
                    {meta.pill}
                  </span>
                  {c.detail && (
                    <CollapsibleTrigger
                      aria-label="Show detail"
                      className="rounded p-1 text-muted-foreground hover:bg-muted"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                  )}
                </div>
                {c.detail && (
                  <CollapsibleContent className="px-3 pb-2 pl-9 text-xs text-muted-foreground">
                    {c.detail}
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })}
        </div>
      )}

      {steps.length > 0 && (
        <ol className="mt-4 space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">{step}</span>
            </li>
          ))}
        </ol>
      )}

      {card.caution && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-caution-soft px-3 py-2 text-sm text-caution-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
          <span>{card.caution}</span>
        </div>
      )}

      {actions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((a, i) => (
            <Button
              key={`${a.href}-${i}`}
              asChild
              size="sm"
              variant={i === 0 ? 'default' : 'outline'}
              className="gap-1"
            >
              <Link to={a.href} onClick={onNavigate}>
                <ArrowUpRight className="h-4 w-4" />
                {a.label}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssistantAnswerCard;
