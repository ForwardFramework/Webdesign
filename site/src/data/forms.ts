/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WHERE LEADS GO
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Two delivery mechanisms are built in. Both send every enquiry to
 *  info@topdogexteriors.com; they differ in what has to be set up first.
 *
 *  'netlify-forms'  (default)
 *    Netlify captures the submission itself. Nothing to install, no API key,
 *    no build step — which is what makes the drag-and-drop deploy work. Two
 *    clicks of setup in the Netlify UI:
 *      1. Forms → Usage and configuration → Form detection → Enable
 *         (off by default on new sites — the site must be deployed once more
 *         after enabling, because detection runs at deploy time)
 *      2. Forms → Notifications → add an email notification to
 *         info@topdogexteriors.com
 *    Submissions are also kept in the Netlify dashboard as a backup record.
 *
 *  'function'
 *    netlify/functions/lead.mts sends a formatted HTML email through Resend,
 *    with the homeowner as Reply-To. Nicer email, no submission cap, no
 *    dependence on Netlify's form product — but it needs a Resend account, a
 *    verified sending domain, a RESEND_API_KEY, and a real build (so: a
 *    git-connected deploy, not drag-and-drop).
 *
 *  Switching is this one constant. See docs/FORMS.md.
 */
export const leadDelivery: 'netlify-forms' | 'function' = 'netlify-forms';

/**
 * The Netlify Forms identifier. Every form on the site shares it, so all
 * enquiries collect in one place regardless of which page they came from —
 * the `source` and `page` fields say where.
 */
export const formName = 'lead';

/**
 * Where the browser posts.
 *
 * Netlify Forms is matched on the `form-name` field in the body, and the POST
 * has to land on a real page of the site — `/` is the convention. The function
 * claims its own path.
 */
export const formAction = leadDelivery === 'function' ? '/api/lead' : '/';

/** Bots fill this field; humans never see it. Netlify screens on it too. */
export const honeypotField = 'company';
