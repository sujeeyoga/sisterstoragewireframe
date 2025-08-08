
import React from "react";
import { attributeOptions, categoryTree, type CategoryNode } from "@/data/catalog";

export type Filters = {
  category?: string;
  rodCount?: string[];
  size?: string[];
  useCase?: string[];
  bundleSize?: string[];
};

interface ShopFiltersProps {
  filters: Filters;
  onChange: (next: Filters) => void;
}

const ToggleChip = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
      active ? "bg-[hsl(var(--primary))] text-white border-transparent" : "bg-background text-foreground/80 border-border hover:bg-muted"
    }`}
  >
    {children}
  </button>
);

function CategoryList({ nodes, activeSlug, onSelect }: { nodes: CategoryNode[]; activeSlug?: string; onSelect: (slug?: string) => void }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node.slug}>
          <div className="flex items-center gap-2">
            <ToggleChip active={activeSlug === node.slug} onClick={() => onSelect(activeSlug === node.slug ? undefined : node.slug)}>
              {node.label}
            </ToggleChip>
          </div>
          {node.children && (
            <div className="ml-4 mt-2">
              <CategoryList nodes={node.children} activeSlug={activeSlug} onSelect={onSelect} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border rounded-lg p-4">
    <h3 className="text-sm font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const ShopFilters = ({ filters, onChange }: ShopFiltersProps) => {
  const toggleFilterValue = (key: keyof Filters, value: string) => {
    const current = new Set(filters[key] as string[] | undefined);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    onChange({ ...filters, [key]: Array.from(current) });
  };

  return (
    <aside className="grid gap-4 md:grid-cols-4">
      <Section title="Categories">
        <div className="mb-2">
          <ToggleChip active={!filters.category} onClick={() => onChange({ ...filters, category: undefined })}>
            All
          </ToggleChip>
        </div>
        <CategoryList
          nodes={categoryTree}
          activeSlug={filters.category}
          onSelect={(slug) => onChange({ ...filters, category: slug })}
        />
      </Section>

      <Section title="Rod Count">
        <div className="flex flex-wrap gap-2">
          {attributeOptions.rodCount.map((v) => (
            <ToggleChip key={v} active={!!filters.rodCount?.includes(v)} onClick={() => toggleFilterValue("rodCount", v)}>
              {v}
            </ToggleChip>
          ))}
        </div>
      </Section>

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {attributeOptions.size.map((v) => (
            <ToggleChip key={v} active={!!filters.size?.includes(v)} onClick={() => toggleFilterValue("size", v)}>
              {v}
            </ToggleChip>
          ))}
        </div>
      </Section>

      <Section title="Use Case">
        <div className="flex flex-wrap gap-2">
          {attributeOptions.useCase.map((v) => (
            <ToggleChip key={v} active={!!filters.useCase?.includes(v)} onClick={() => toggleFilterValue("useCase", v)}>
              {v}
            </ToggleChip>
          ))}
        </div>
      </Section>

      <Section title="Bundle Size">
        <div className="flex flex-wrap gap-2">
          {attributeOptions.bundleSize.map((v) => (
            <ToggleChip key={v} active={!!filters.bundleSize?.includes(v)} onClick={() => toggleFilterValue("bundleSize", v)}>
              {v}
            </ToggleChip>
          ))}
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <button
          className="px-4 py-2 rounded-full border border-border text-foreground/80 hover:bg-muted"
          onClick={() =>
            onChange({ category: undefined, rodCount: [], size: [], useCase: [], bundleSize: [] })
          }
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
};

export default ShopFilters;
