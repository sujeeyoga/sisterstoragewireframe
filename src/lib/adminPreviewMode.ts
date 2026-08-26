/**
 * Dev-only escape hatch so the admin UI can be rendered without a live admin
 * session (useful for design review, screenshots and headless checks).
 *
 * Enabled by visiting an admin route with `?admin_preview=1` while running the
 * Vite dev server. The flag is remembered in sessionStorage for the tab, and is
 * hard-disabled in production builds (`import.meta.env.DEV` is false there), so
 * it can never weaken the real guard on the published site.
 */
const FLAG_KEY = "admin-ui-preview";

export const isAdminPreviewMode = (): boolean => {
  if (!import.meta.env.DEV || typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("admin_preview");
    if (param === "1" || param === "true") {
      sessionStorage.setItem(FLAG_KEY, "1");
      return true;
    }
    if (param === "0" || param === "false") {
      sessionStorage.removeItem(FLAG_KEY);
      return false;
    }
    return sessionStorage.getItem(FLAG_KEY) === "1";
  } catch {
    return false;
  }
};
