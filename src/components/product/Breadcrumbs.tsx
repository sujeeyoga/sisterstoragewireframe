
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryTree } from "@/data/catalog";
import { findCategoryPathBySlug } from "@/lib/catalog";

interface BreadcrumbsProps {
  productName: string;
  primaryCategorySlug?: string;
}

const Breadcrumbs = ({ productName, primaryCategorySlug }: BreadcrumbsProps) => {
  const path = primaryCategorySlug ? findCategoryPathBySlug(categoryTree, primaryCategorySlug) ?? [] : [];
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <nav aria-label="Breadcrumb" className="text-xs">
          <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-[hsl(var(--primary))]">Home</Link>
        </li>
        <li className="text-foreground/40">/</li>
        <li>
          <Link to="/shop" className="hover:text-[hsl(var(--primary))]">Shop</Link>
        </li>
        {path.flatMap((node, i) => [
          <li key={`sep-${i}`} className="text-foreground/40">/</li>,
          <li key={`cat-${node.slug}`}>
            <Link to={`/shop?category=${encodeURIComponent(node.slug)}`} className="hover:text-[hsl(var(--primary))]">
              {node.label}
            </Link>
          </li>
        ])}

        <li className="text-foreground/40">/</li>
        <li className="text-foreground">{productName}</li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
