/**
 * Offline "mock backend" renderer for the admin Email Templates preview.
 *
 * The real preview is rendered by the `send-email` edge function. When that call
 * can't run (no admin session, backend unavailable, local UI review), we render
 * a close visual approximation here so the panel still shows what customers
 * receive instead of an empty canvas.
 *
 * Keep the markup in sync with supabase/functions/_shared/email-templates/*.
 */

const PINK = "#FC0079";
const INK = "#121426";
const MUTED = "#5F6270";
const BORDER = "#EFE7EC";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const nl2br = (v: string) => esc(v).replace(/\n/g, "<br />");

const money = (n: unknown) => `$${Number(n ?? 0).toFixed(2)}`;

/** Replaces {{token}} placeholders using the template's sample data. */
export const applyTokens = (text: string, data: Record<string, any>) =>
  String(text ?? "").replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
    const value = key
      .split(".")
      .reduce((acc: any, part: string) => (acc == null ? acc : acc[part]), data);
    return value == null || value === "" ? match : String(value);
  });

const shell = (previewText: string, body: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:24px 12px;background:#F5F5F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(previewText)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid ${BORDER};">
      <tr>
        <td style="background:${PINK};padding:26px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:800;letter-spacing:0.04em;color:#FFFFFF;">SISTER STORAGE</div>
        </td>
      </tr>
      <tr><td style="padding:32px;">${body}</td></tr>
    </table>
    <p style="max-width:600px;margin:16px auto 0;text-align:center;font-size:12px;color:#9A9AA5;">
      Sister Storage &middot; sisterstorageinc@gmail.com
    </p>
  </body>
</html>`;

const heading = (text: string) =>
  `<h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:${INK};">${esc(text)}</h1>`;

const paragraph = (text: string) =>
  `<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${MUTED};">${nl2br(text)}</p>`;

const button = (label: string, href = "#") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;">
     <tr><td style="background:${PINK};border-radius:999px;">
       <a href="${esc(href)}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;">${esc(label)}</a>
     </td></tr>
   </table>`;

const footer = (text: string) =>
  `<hr style="border:none;border-top:1px solid ${BORDER};margin:26px 0 18px;" />
   <p style="margin:0;font-size:13px;line-height:1.6;color:#8A8A95;">${nl2br(text)}</p>`;

const itemRows = (items: any[] = []) =>
  items
    .map(
      (item) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${INK};">
          ${esc(item.name)}<span style="color:${MUTED};"> &times; ${esc(item.quantity ?? 1)}</span>
        </td>
        ${
          item.price != null
            ? `<td align="right" style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${INK};">${money(
                Number(item.price) * Number(item.quantity ?? 1)
              )}</td>`
            : ""
        }
      </tr>`
    )
    .join("");

const totalsRow = (label: string, value: string, bold = false) =>
  `<tr>
     <td style="padding:6px 0;font-size:${bold ? 15 : 14}px;font-weight:${bold ? 700 : 400};color:${
       bold ? INK : MUTED
     };">${esc(label)}</td>
     <td align="right" style="padding:6px 0;font-size:${bold ? 15 : 14}px;font-weight:${
       bold ? 700 : 400
     };color:${bold ? INK : MUTED};">${esc(value)}</td>
   </tr>`;

const addressBlock = (address: any) =>
  !address
    ? ""
    : `<div style="margin:0 0 22px;padding:16px 18px;background:#FFF1F7;border-radius:12px;font-size:14px;line-height:1.6;color:${INK};">
         <strong style="display:block;margin-bottom:4px;">Shipping to</strong>
         ${esc(address.name)}<br />${esc(address.address)}<br />
         ${esc(address.city)}, ${esc(address.state)} ${esc(address.postal_code)}<br />${esc(address.country)}
       </div>`;

const trackingBlock = (data: Record<string, any>) =>
  `<div style="margin:0 0 22px;padding:18px;border:1px solid ${BORDER};border-radius:12px;">
     <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">Tracking number</p>
     <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:${PINK};">${esc(data.trackingNumber)}</p>
     <p style="margin:0;font-size:14px;color:${MUTED};">Carrier: ${esc(data.carrier)}${
       data.estimatedDelivery ? `<br />Estimated delivery: ${esc(data.estimatedDelivery)}` : ""
     }</p>
   </div>`;

interface MockRenderArgs {
  templateKey: string;
  subject: string;
  blocks: Record<string, string>;
  data: Record<string, any>;
}

/** Renders a sample email that mirrors what the live backend would produce. */
export const renderMockEmail = ({ templateKey, subject, blocks, data }: MockRenderArgs): string => {
  const b = (key: string, fallback = "") => applyTokens(blocks[key] ?? fallback, data);
  const subjectLine = applyTokens(subject, data);

  switch (templateKey) {
    case "order_confirmation": {
      const items = data.items ?? [];
      return shell(
        subjectLine,
        heading(b("headline", "Thank You for Your Order!")) +
          paragraph(`Hi ${data.customerName ?? "there"},`) +
          paragraph(b("bodyText")) +
          `<p style="margin:0 0 8px;font-size:14px;color:${MUTED};">Order <strong style="color:${INK};">#${esc(
            data.orderNumber
          )}</strong> &middot; ${esc(data.orderDate)}</p>` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 14px;">${itemRows(
            items
          )}</table>` +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">
             ${totalsRow("Subtotal", money(data.subtotal))}
             ${totalsRow("Shipping", Number(data.shipping ?? 0) === 0 ? "Free" : money(data.shipping))}
             ${totalsRow("Tax", money(data.tax))}
             ${totalsRow("Total", money(data.total), true)}
           </table>` +
          addressBlock(data.shippingAddress) +
          footer(b("footerText"))
      );
    }

    case "shipping_notification":
      return shell(
        subjectLine,
        heading(b("headline", "Your Order Has Shipped!")) +
          paragraph(`Hi ${data.customerName ?? "there"},`) +
          paragraph(b("bodyText")) +
          trackingBlock(data) +
          button(b("ctaText", "Track Your Package")) +
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${itemRows(
            data.items ?? []
          )}</table>` +
          addressBlock(data.shippingAddress) +
          footer(b("footerText"))
      );

    case "delayed_tracking":
      return shell(
        subjectLine,
        heading(b("headline", "Your Package is On The Way!")) +
          paragraph(`Hi ${data.customerName ?? "there"},`) +
          paragraph(b("apologyMessage")) +
          paragraph(`Your order #${data.orderNumber} ${b("bodyText")}`) +
          trackingBlock(data) +
          button(b("ctaText", "Track Your Package")) +
          addressBlock(data.shippingAddress) +
          footer("Thank you for shopping with Sister Storage!")
      );

    case "announcement":
    case "promotional": {
      const sub = b("subheadline");
      return shell(
        subjectLine,
        heading(b("headline")) +
          (sub ? paragraph(sub) : "") +
          paragraph(`Hi ${data.customerName ?? "there"},`) +
          paragraph(b("bodyText")) +
          button(b("ctaText", "Shop Now"), b("ctaLink", "https://sisterstorage.com/shop")) +
          footer(b("footerText", "Thank you for being part of Sister Storage."))
      );
    }

    case "admin_welcome":
      return shell(
        subjectLine,
        heading("Welcome to the Sister Storage Admin Panel") +
          paragraph("An admin account has been created for you. Here are your sign-in details:") +
          `<div style="margin:0 0 22px;padding:16px 18px;background:#FFF1F7;border-radius:12px;font-size:14px;line-height:1.7;color:${INK};">
             Email: <strong>${esc(data.email)}</strong><br />
             Temporary password: <strong>${esc(data.temporaryPassword)}</strong>
           </div>` +
          button("Open Admin Panel", data.loginUrl) +
          footer("Please change your password after your first sign-in.")
      );

    case "admin_promotion":
      return shell(
        subjectLine,
        heading("Admin Access Granted") +
          paragraph(
            `Your account (${data.email}) now has admin access to the Sister Storage dashboard.`
          ) +
          button("Open Admin Panel", data.loginUrl) +
          footer("If you weren't expecting this, contact sisterstorageinc@gmail.com.")
      );

    default:
      return shell(subjectLine, heading(subjectLine) + paragraph(b("bodyText")));
  }
};
