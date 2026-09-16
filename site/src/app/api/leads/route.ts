import { NextResponse } from 'next/server';
import { deliverLead, rateLimit, validateLead, type Lead } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!rateLimit(`lead:${ip}`)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again in a minute.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const result = validateLead(body);
  if (!result.ok) {
    // Honeypot hits get a success response so bots do not learn anything.
    if (result.error === 'spam') return NextResponse.json({ ok: true, message: 'Thanks!' });
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const lead: Lead = {
    ...result.lead,
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent')?.slice(0, 300) ?? undefined,
  };

  try {
    const { delivered, via } = await deliverLead(lead);
    return NextResponse.json({
      ok: true,
      message:
        lead.variant === 'guide'
          ? 'Your guide is on its way. The full text is also on this page — nothing is hidden behind the form.'
          : 'Thanks — Caitlin will be in touch personally, usually the same day.',
      delivered,
      via,
    });
  } catch (err) {
    console.error('[leads] delivery failed:', err);
    // The visitor did their part. Never show them a failure caused by our config.
    return NextResponse.json({
      ok: true,
      message: 'Thanks — your details came through. If you do not hear back within a day, please call or email directly.',
      delivered: false,
    });
  }
}
