import { unverifiedFields } from '@/config/site';

/**
 * Renders only while `src/config/site.ts` still contains NEEDS_VERIFICATION
 * sentinels. It is deliberately loud and deliberately not dismissible: a real
 * estate site published without a licence number, a registered brokerage name
 * and a working point of contact is a FREC advertising problem, not a cosmetic
 * one. Fill the config and this disappears on its own.
 */
export function PreLaunchBanner() {
  const missing = unverifiedFields();
  if (!missing.length) return null;

  return (
    <div role="alert" className="border-b-2 border-coral-600 bg-coral-500 text-white">
      <div className="container-page py-3">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold">
            <span aria-hidden="true" className="text-lg leading-none">⚠️</span>
            <span>
              Pre-launch: {missing.length} required detail{missing.length === 1 ? '' : 's'} still
              need{missing.length === 1 ? 's' : ''} to be filled in before this site can go live.
            </span>
            <span className="ml-auto shrink-0 text-xs font-normal underline underline-offset-4 group-open:hidden">
              Show list
            </span>
          </summary>
          <div className="mt-3 rounded-2xl bg-white/15 p-4 text-sm">
            <p className="mb-3 leading-relaxed">
              These were left as placeholders rather than guessed. Florida&rsquo;s advertising rule
              (Fla. Admin. Code R. 61J2-10.025) makes several of them legally operative — a fabricated
              licence number or an unregistered brokerage name is a violation. Edit{' '}
              <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-xs">src/config/site.ts</code>.
            </p>
            <ul className="space-y-1 font-mono text-xs">
              {missing.map((m) => (
                <li key={m} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
