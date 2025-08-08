
import type { CategoryNode } from "@/data/catalog";

export function findCategoryPathBySlug(tree: CategoryNode[], slug: string): CategoryNode[] | null {
  for (const node of tree) {
    if (node.slug === slug) return [node];
    if (node.children) {
      const path = findCategoryPathBySlug(node.children, slug);
      if (path) return [node, ...path];
    }
  }
  return null;
}

export function flattenTree(tree: CategoryNode[]): CategoryNode[] {
  const res: CategoryNode[] = [];
  function dfs(nodes: CategoryNode[]) {
    for (const n of nodes) {
      res.push(n);
      if (n.children) dfs(n.children);
    }
  }
  dfs(tree);
  return res;
}
