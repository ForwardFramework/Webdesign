/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LEAD ROUTER  →  info@topdogexteriors.com
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Every form on the site posts here. This function validates, screens for spam,
 *  and emails the lead to the business — with the homeowner set as Reply-To so
 *  hitting reply in the inbox answers the customer directly.
 *
 *  ENVIRONMENT VARIABLES (set in Netlify → Site settings → Environment):
 *    RESEND_API_KEY   required — API key from https://resend.com
 *    LEAD_TO          optional — defaults to info@topdogexteriors.com
 *    LEAD_FROM        optional — defaults to website@topdogexteriors.com
 *                                (must be on a domain verified in Resend)
 *    LEAD_BCC         optional — a second address, e.g. a CRM inbound address
 *
 *  Works on Netlify as-is. See docs/FORMS.md for the Vercel and Cloudflare
 *  equivalents and for the zero-code Netlify Forms fallback.
 */

import type { Context } from '@netlify/functions';

const TO = process.env.LEAD_TO || 'info@topdogexteriors.com';
const FROM = process.env.LEAD_FROM || 'Top Dog Exteriors Website <website@topdogexteriors.com>';
const BCC = process.env.LEAD_BCC;

/** Fields we accept. Anything else in the payload is ignored. */
const FIELDS = [
  'name', 'phone', 'email', 'zip', 'service', 'message', 'consent',
  'source', 'page', 'address', 'estimate_summary', 'topic',
] as const;

type Lead = Partial<Record<(typeof FIELDS)[number], string>>;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

function validate(lead: Lead): string[] {
  const errors: string[] = [];
  if (!lead.name || lead.name.trim().length < 2) errors.push('name');

  const digits = (lead.phone ?? '').replace(/\D/g, '');
  if (digits.length !== 10 && !(digits.length === 11 && digits.startsWith('1'))) errors.push('phone');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email ?? '')) errors.push('email');
  if (lead.zip && !/^\d{5}$/.test(lead.zip.trim())) errors.push('zip');

  return errors;
}

function buildEmail(lead: Lead) {
  const rows: [string, string][] = [
    ['Name', lead.name ?? ''],
    ['Phone', lead.phone ?? ''],
    ['Email', lead.email ?? ''],
    ['ZIP', lead.zip ?? ''],
    ['Service', lead.service ?? lead.topic ?? ''],
    ['Property address', lead.address ?? ''],
    ['Texting consent', lead.consent === 'yes' ? 'Yes' : 'Not given'],
    ['Submitted from', lead.page ?? ''],
    ['Form', lead.source ?? ''],
  ].filter(([, v]) => v.trim() !== '');

  const html = `
<!doctype html>
<html><body style="margin:0;background:#f7f9fa;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#04202f">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #dfe5ea;border-radius:12px;overflow:hidden">
        <tr>
          <td style="background:#04202f;padding:20px 24px;border-bottom:4px solid #38b6ff">
            <div style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-.02em">New website lead</div>
            <div style="color:#94a2ae;font-size:13px;margin-top:4px">Top Dog Exteriors · topdogexteriors.com</div>
          </td>
        </tr>
        <tr><td style="padding:8px 24px 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
            ${rows
              .map(
                ([label, value]) => `
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #eff2f5;color:#64748b;width:150px;vertical-align:top">${escapeHtml(label)}</td>
              <td style="padding:12px 0;border-bottom:1px solid #eff2f5;font-weight:600">${escapeHtml(value)}</td>
            </tr>`
              )
              .join('')}
          </table>

          ${
            lead.message?.trim()
              ? `<div style="margin-top:20px">
                   <div style="color:#64748b;font-size:13px;margin-bottom:6px">Project details</div>
                   <div style="background:#f7f9fa;border:1px solid #eff2f5;border-radius:8px;padding:14px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</div>
                 </div>`
              : ''
          }

          ${
            lead.estimate_summary?.trim()
              ? `<div style="margin-top:20px">
                   <div style="color:#64748b;font-size:13px;margin-bottom:6px">Instant roof estimate</div>
                   <div style="background:#fff5ee;border:1px solid #ffe6d5;border-radius:8px;padding:14px;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(lead.estimate_summary)}</div>
                 </div>`
              : ''
          }

          <div style="margin-top:24px">
            <a href="tel:${escapeHtml((lead.phone ?? '').replace(/\D/g, ''))}"
               style="display:inline-block;background:#38b6ff;color:#04283c;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px;font-size:15px">
              Call ${escapeHtml(lead.name?.split(' ')[0] ?? 'them')} now
            </a>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#94a2ae;line-height:1.6">
            Reply to this email to answer the customer directly — their address is set as Reply-To.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim();

  const text = [
    'NEW WEBSITE LEAD — Top Dog Exteriors',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    lead.message?.trim() ? `\nProject details:\n${lead.message}` : '',
    lead.estimate_summary?.trim() ? `\nInstant roof estimate:\n${lead.estimate_summary}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const who = lead.service ?? lead.topic ?? 'Website';
  const where = lead.zip ? ` (${lead.zip})` : '';
  const subject = `New lead: ${lead.name ?? 'Unknown'} — ${who}${where}`;

  return { html, text, subject };
}

export default async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  const respond = (status: number, body: Record<string, unknown>, redirect: string) =>
    wantsJson
      ? Response.json(body, { status })
      : new Response(null, { status: 303, headers: { Location: redirect } });

  let lead: Lead = {};
  let honeypot = '';
  let renderedAt = 0;

  try {
    const contentType = request.headers.get('content-type') ?? '';
    const raw: Record<string, string> = {};

    if (contentType.includes('application/json')) {
      Object.assign(raw, await request.json());
    } else {
      const data = await request.formData();
      for (const [key, value] of data.entries()) {
        if (typeof value === 'string') raw[key] = value;
      }
    }

    honeypot = raw.company ?? '';
    renderedAt = Number(raw.rendered_at ?? 0);
    for (const field of FIELDS) {
      // Cap length so a bot cannot post a novel into the inbox.
      if (raw[field] != null) lead[field] = String(raw[field]).slice(0, 4000);
    }
  } catch {
    return respond(400, { ok: false, error: 'Could not read the submission.' }, '/contact?error=1');
  }

  /* ── Spam screening ─────────────────────────────────────────────────────
     Both checks return 200 so bots get no signal about why they failed.     */
  if (honeypot.trim() !== '') {
    return respond(200, { ok: true }, '/thank-you');
  }
  if (renderedAt > 0 && Date.now() - renderedAt < 3000) {
    return respond(200, { ok: true }, '/thank-you');
  }

  const errors = validate(lead);
  if (errors.length > 0) {
    return respond(422, { ok: false, error: 'Some fields need attention.', fields: errors }, '/contact?error=1');
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fail loudly rather than pretending the lead was delivered. A silently
    // dropped lead is worse than an error the homeowner can act on.
    console.error('[lead] RESEND_API_KEY is not set — lead was NOT delivered:', JSON.stringify(lead));
    return respond(
      500,
      { ok: false, error: 'Email delivery is not configured on this deployment.' },
      '/contact?error=1'
    );
  }

  const { html, text, subject } = buildEmail(lead);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        ...(BCC ? { bcc: [BCC] } : {}),
        reply_to: lead.email,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[lead] Resend rejected the message:', response.status, detail);
      return respond(502, { ok: false, error: 'Could not send the message.' }, '/contact?error=1');
    }
  } catch (error) {
    console.error('[lead] Network error sending lead:', error);
    return respond(502, { ok: false, error: 'Could not send the message.' }, '/contact?error=1');
  }

  return respond(200, { ok: true }, '/thank-you');
};

export const config = { path: '/api/lead' };
