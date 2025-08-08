
import React from "react";
import { Link } from "react-router-dom";
import { categoryTree } from "@/data/catalog";
import { findCategoryPathBySlug } from "@/lib/catalog";

interface BreadcrumbsProps {
  productName: string;
  primaryCategorySlug?: string;
}

const Breadcrumbs = ({ productName, primaryCategorySlug }: BreadcrumbsProps) => {
  const path = primaryCategorySlug ? findCategoryPathBySlug(categoryTree, primaryCategorySlug) ?? [] : [];

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs">
      <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-[hsl(var(--primary))]">Home</Link>
        </li>
        <li className="text-foreground/40">/</li>
        <li>
          <Link to="/shop" className="hover:text-[hsl(var(--primary))]">Shop</Link>
        </li>
        {path.map((node, i) => (
          <React.Fragment key={node.slug}>
            <li className="text-foreground/40">/</li>
            <li>
              <Link to={`/shop?category=${encodeURIComponent(node.slug)}`} className="hover:text-[hsl(var(--primary))]">
                {node.label}
              </Link>
            </li>
          </React.Fragment>
        ))}
        <li className="text-foreground/40">/</li>
        <li className="text-foreground">{productName}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
