#!/usr/bin/env python3
"""Open any admin route in an authenticated headless browser and screenshot it.

Usage:
  python3 scripts/admin-ui-preview.py [route] [--out DIR] [--width N] [--height N]

Examples:
  python3 scripts/admin-ui-preview.py /admin/email-templates
  python3 scripts/admin-ui-preview.py /admin/branding --width 420 --height 900

Session source (first one that works):
  1. LOVABLE_BROWSER_SUPABASE_* env vars (injected when you are signed in to the preview)
  2. ~/.cache/lovable-auth/session.json (created by `lovable auth-session --json`)

The signed-in user must have an `admin` row in `user_roles`, otherwise the guard
renders "Access Denied".
"""
import argparse, asyncio, json, os, sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = os.environ.get("ADMIN_PREVIEW_BASE_URL", "http://localhost:8080")
CACHE = Path.home() / ".cache" / "lovable-auth" / "session.json"


def load_session():
    key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
    sess = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
    cookies = os.environ.get("LOVABLE_BROWSER_SUPABASE_COOKIES_JSON")
    if key and sess:
        return key, sess, cookies, "env"
    if CACHE.exists():
        minted = json.loads(CACHE.read_text())
        return (
            minted["storage_key"],
            json.dumps(minted["session"]),
            json.dumps(minted.get("cookies") or []),
            "minted session file",
        )
    return None, None, None, None


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("route", nargs="?", default="/admin/email-templates")
    ap.add_argument("--out", default="/tmp/browser/admin-preview")
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--height", type=int, default=1800)
    args = ap.parse_args()

    key, sess, cookies, source = load_session()
    if not key:
        sys.exit(
            "No admin session available.\n"
            "Sign in to the Lovable preview as an admin, or run: lovable auth-session --json"
        )
    print(f"using session from {source}")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    shot = out / (args.route.strip("/").replace("/", "_") or "root") 

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": args.width, "height": args.height})
        errors = []
        page = await context.new_page()
        page.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))

        if cookies:
            parsed = json.loads(cookies)
            for c in parsed:
                c["url"] = BASE
            if parsed:
                await context.add_cookies(parsed)

        await page.goto(BASE, wait_until="domcontentloaded")
        await page.evaluate(
            f"window.localStorage.setItem({json.dumps(key)}, {json.dumps(sess)})"
        )
        await page.goto(BASE + args.route, wait_until="networkidle")
        await page.wait_for_timeout(2500)

        body = (await page.inner_text("body"))[:400]
        await page.screenshot(path=f"{shot}.png")
        print("url:", page.url)
        if "Access Denied" in body:
            print("!! guard blocked: signed-in user lacks the admin role")
        elif "Verifying access" in body:
            print("!! still verifying access - session may be expired")
        print("screenshot:", f"{shot}.png")
        if errors:
            print("console errors:")
            for e in errors[:15]:
                print(" ", e)
        await browser.close()

asyncio.run(main())
