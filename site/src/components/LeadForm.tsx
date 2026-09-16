'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { brokerage, show } from '@/config/site';

type Variant = 'guide' | 'contact' | 'valuation' | 'inline';

const TIMEFRAMES = ['Just researching', '0–3 months', '3–6 months', '6–12 months', '12+ months'];
const INTENTS = [
  { value: 'buying', label: 'Buying a home' },
  { value: 'new-construction', label: 'Building new' },
  { value: 'selling', label: 'Selling a home' },
  { value: 'relocating', label: 'Relocating to Florida' },
  { value: 'investing', label: 'Investing' },
];

export function LeadForm({
  variant = 'contact',
  guideSlug,
  guideTitle,
  heading,
  sub,
  cta = 'Send it over',
  compact = false,
  headingLevel = 3,
}: {
  variant?: Variant;
  guideSlug?: string;
  guideTitle?: string;
  heading?: string;
  sub?: string;
  cta?: string;
  compact?: boolean;
  /** Keeps the document outline valid wherever the form is placed. */
  headingLevel?: 2 | 3;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, variant, guideSlug, guideTitle, page: window.location.pathname }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Something went wrong');
      setState('done');
      setMessage(json.message ?? '');
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-3xl border border-gulf-200 bg-gulf-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gulf-700 text-2xl text-white" aria-hidden="true">✓</div>
        <p className="mt-4 font-display text-xl font-semibold text-gulf-900">
          {variant === 'guide' ? 'Check your inbox' : "Thanks — that's come through"}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          {message ||
            (variant === 'guide'
              ? `The ${guideTitle ?? 'guide'} is on its way. The full text is also right here on the site — nothing is hidden behind the form.`
              : 'Caitlin will get back to you personally, usually the same day.')}
        </p>
      </div>
    );
  }

  const Heading = (headingLevel === 2 ? 'h2' : 'h3') as 'h2' | 'h3';

  const inputCls =
    'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gulf-500 focus:outline-none focus:ring-2 focus:ring-gulf-500/30';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-ink-soft';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      {(heading || sub) && (
        <div className="mb-5">
          {heading && <Heading className="font-display text-2xl font-semibold text-gulf-900">{heading}</Heading>}
          {sub && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{sub}</p>}
        </div>
      )}

      {/* Honeypot — bots fill it, humans never see it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company-website">Do not fill this in</label>
        <input id="company-website" type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div>
          <label className={labelCls} htmlFor="lead-name">Name</label>
          <input id="lead-name" name="name" required autoComplete="name" className={`mt-1.5 ${inputCls}`} placeholder="Your name" />
        </div>
        <div>
          <label className={labelCls} htmlFor="lead-email">Email</label>
          <input id="lead-email" name="email" type="email" required autoComplete="email" className={`mt-1.5 ${inputCls}`} placeholder="you@example.com" />
        </div>
      </div>

      {variant !== 'guide' && (
        <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
          <div>
            <label className={labelCls} htmlFor="lead-phone">Phone <span className="font-normal normal-case tracking-normal text-ink-muted">(optional)</span></label>
            <input id="lead-phone" name="phone" type="tel" autoComplete="tel" className={`mt-1.5 ${inputCls}`} placeholder="(941) 555-0123" />
          </div>
          <div>
            <label className={labelCls} htmlFor="lead-timeframe">Timeframe</label>
            <select id="lead-timeframe" name="timeframe" className={`mt-1.5 ${inputCls}`} defaultValue="Just researching">
              {TIMEFRAMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      )}

      {(variant === 'contact' || variant === 'valuation') && (
        <fieldset>
          <legend className={labelCls}>What brings you here?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTENTS.map((i) => (
              <label key={i.value} className="cursor-pointer">
                <input type="radio" name="intent" value={i.value} className="peer sr-only" defaultChecked={i.value === (variant === 'valuation' ? 'selling' : 'buying')} />
                <span className="chip peer-checked:chip-active peer-focus-visible:ring-2 peer-focus-visible:ring-gulf-500">{i.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {variant === 'valuation' && (
        <div>
          <label className={labelCls} htmlFor="lead-address">Property address</label>
          <input id="lead-address" name="address" className={`mt-1.5 ${inputCls}`} placeholder="Street, village, ZIP" />
        </div>
      )}

      {variant !== 'guide' && (
        <div>
          <label className={labelCls} htmlFor="lead-message">Anything else? <span className="font-normal normal-case tracking-normal text-ink-muted">(optional)</span></label>
          <textarea id="lead-message" name="message" rows={3} className={`mt-1.5 ${inputCls} resize-y`} placeholder="Villages you're curious about, must-haves, questions…" />
        </div>
      )}

      {/*
        Express written consent, kept unticked by default. Pre-ticked consent is
        not consent, and Florida's own telephone solicitation rules plus the TCPA
        both expect an affirmative, separate opt-in for calls and texts.
      */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-gulf-50/60 p-3.5">
        <input type="checkbox" name="consent" value="yes" className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/25 text-gulf-700 focus:ring-gulf-500" />
        <span className="text-xs leading-relaxed text-ink-soft">
          I agree to be contacted about my enquiry by email, phone or text, including by automated means.
          Consent is not a condition of any purchase, and I can opt out at any time. See the{' '}
          <Link href="/privacy" className="font-medium text-gulf-700 underline underline-offset-2">privacy policy</Link>.
        </span>
      </label>

      {state === 'error' && (
        <p role="alert" className="rounded-xl bg-coral-50 px-4 py-3 text-sm text-coral-700">{message}</p>
      )}

      <button type="submit" disabled={state === 'sending'} className="btn-coral w-full">
        {state === 'sending' ? 'Sending…' : cta}
      </button>

      <p className="text-center text-[0.7rem] leading-relaxed text-ink-muted">
        Sent to {show(brokerage.registeredName, brokerage.tradeName)}. Your details are never sold or shared with
        third-party advertisers.
      </p>
    </form>
  );
}
