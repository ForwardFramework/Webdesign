export interface Lead {
  name: string;
  email: string;
  phone?: string;
  timeframe?: string;
  intent?: string;
  address?: string;
  message?: string;
  consent: boolean;
  variant: string;
  guideSlug?: string;
  guideTitle?: string;
  page?: string;
  receivedAt: string;
  userAgent?: string;
}

/**
 * Lead delivery.
 *
 * Deliberately pluggable and deliberately NOT dependent on a third-party SDK:
 * whichever of these is configured gets used, and if none is, the lead is
 * logged so nothing is silently lost during setup.
 *
 *   LEAD_WEBHOOK_URL   — POST the JSON anywhere (Zapier, Make, a CRM endpoint)
 *   RESEND_API_KEY     — email via Resend, to LEAD_NOTIFY_EMAIL
 *   (neither)          — server log only, and the API says so in its response
 */
export async function deliverLead(lead: Lead): Promise<{ delivered: boolean; via: string }> {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const notify = process.env.LEAD_NOTIFY_EMAIL;

  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`Lead webhook responded ${res.status}`);
    return { delivered: true, via: 'webhook' };
  }

  if (resendKey && notify) {
    const rows = Object.entries(lead)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5B7379;font-size:13px">${k}</td><td style="padding:4px 0;font-size:14px"><strong>${String(v)}</strong></td></tr>`)
      .join('');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || 'leads@resend.dev',
        to: notify,
        subject: `New ${lead.variant} lead — ${lead.name}`,
        html: `<h2 style="font-family:Georgia,serif">New lead from the website</h2><table>${rows}</table>`,
        reply_to: lead.email,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return { delivered: true, via: 'email' };
  }

  console.warn('[leads] No delivery method configured — lead logged only:', JSON.stringify(lead));
  return { delivered: false, via: 'log' };
}

/**
 * Minimal in-process rate limit. Adequate for a single-instance deploy; swap for
 * Upstash/Redis if the site is ever scaled horizontally, since this map does not
 * survive across instances.
 */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function validateLead(body: Record<string, unknown>): { ok: true; lead: Omit<Lead, 'receivedAt' | 'userAgent'> } | { ok: false; error: string } {
  const s = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '');

  // Honeypot: a filled hidden field means a bot. Accept silently upstream.
  if (s('company')) return { ok: false, error: 'spam' };

  const name = s('name');
  const email = s('email');
  if (name.length < 2 || name.length > 120) return { ok: false, error: 'Please enter your name.' };
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: 'Please enter a valid email address.' };

  const cap = (v: string, n: number) => (v.length > n ? v.slice(0, n) : v);

  return {
    ok: true,
    lead: {
      name: cap(name, 120),
      email: cap(email, 200),
      phone: cap(s('phone'), 40) || undefined,
      timeframe: cap(s('timeframe'), 60) || undefined,
      intent: cap(s('intent'), 60) || undefined,
      address: cap(s('address'), 200) || undefined,
      message: cap(s('message'), 2000) || undefined,
      consent: s('consent') === 'yes',
      variant: cap(s('variant') || 'contact', 40),
      guideSlug: cap(s('guideSlug'), 100) || undefined,
      guideTitle: cap(s('guideTitle'), 200) || undefined,
      page: cap(s('page'), 200) || undefined,
    },
  };
}
