# Form handling — where the leads go

Every enquiry reaches **info@topdogexteriors.com**. Two mechanisms are built in, and
**`src/data/forms.ts` picks between them with one constant**:

| `leadDelivery` | What handles the submission | Setup needed |
|---|---|---|
| `'netlify-forms'` **(default)** | Netlify captures it and emails you | Two clicks in the Netlify UI |
| `'function'` | `netlify/functions/lead.mts` sends a formatted email via Resend | Resend account, verified domain, API key, and a real build |

The default is Netlify Forms because it needs no build step, which is what lets the site
be deployed by dragging a folder onto Netlify. Switch to `'function'` when you want the
nicer email and no dependence on Netlify's form product.

Both send the same fields:

| Location | `source` value sent with the lead |
|---|---|
| Homepage hero | `homepage-hero` |
| Every service page | `service-<slug>` |
| Every service-area page | `area-<slug>` |
| Contact page | `contact-page` or `contact-<topic>` |
| Instant roof quote | `instant-roof-quote` (includes the full estimate) |
| Financing page | `financing` |
| Equipment rental | `equipment-rental` |

---

## Setup — Netlify Forms (the default)

**Form detection is off by default on new Netlify sites**, and it only runs at deploy
time. So the order matters:

1. Deploy the site once.
2. **Forms → Usage and configuration → Form detection → Enable form detection.**
3. **Deploy again.** This is the step people miss. Detection scans the HTML as it is
   deployed, so a site deployed before the toggle was flipped has no known forms and
   its submissions are rejected.
4. **Forms → Notifications → Add notification → Email notification**, sent to
   `info@topdogexteriors.com`.

Every form on the site shares the name **`lead`**, so all enquiries collect in one
place; the `source` and `page` fields say which page produced each one. Submissions are
also stored in the Netlify dashboard, which is a useful backup if an email is ever lost.

### Verify it works

Submit a test lead from the live site, then check **Forms → lead**. If the submission is
not there:

- Confirm form detection is enabled **and** that you deployed after enabling it.
- View source on the live page and confirm the form still carries
  `name="lead"`, `data-netlify="true"` and `<input type="hidden" name="form-name">`.
- Netlify only parses url-encoded bodies. `src/scripts/lead-form.ts` sends
  `application/x-www-form-urlencoded` for exactly this reason — a multipart body is
  accepted and then silently dropped, which looks like success on the page.

### The spam trap

The hidden `company` field is declared to Netlify via `data-netlify-honeypot`. Bots fill
it, humans never see it, and Netlify discards anything that arrives with it set. The
site additionally rejects forms completed in under three seconds.

---

## Setup — the Resend function

Set `leadDelivery = 'function'` in `src/data/forms.ts` first. This route requires a
git-connected deploy, because the function has to be built.

1. **Create a Resend account** at <https://resend.com> and verify `topdogexteriors.com`
   as a sending domain. Resend walks you through the DNS records (SPF, DKIM); they
   take a few minutes to propagate.
2. **Create an API key** at <https://resend.com/api-keys>.
3. **In Netlify → Site configuration → Environment variables**, add:

   | Key | Value |
   |---|---|
   | `RESEND_API_KEY` | your `re_…` key |
   | `LEAD_TO` | `info@topdogexteriors.com` *(optional — this is the default)* |
   | `LEAD_FROM` | `Top Dog Exteriors Website <website@topdogexteriors.com>` |
   | `LEAD_BCC` | *(optional)* a CRM inbound address |

4. **Deploy from git.** `netlify/functions/lead.mts` is picked up automatically and
   claims `/api/lead`. A drag-and-drop deploy will not work here — nothing builds the
   function.

> **The `LEAD_FROM` domain must be verified in Resend.** Sending "from" a homeowner's own
> Gmail address would be spoofing and will be rejected — which is why the customer's
> address goes in `Reply-To` instead.

### Verify it works

Submit a test lead from the live site. If nothing arrives:

- Netlify → **Functions → lead → Logs**. A missing `RESEND_API_KEY` logs a loud error
  and returns a 500 to the visitor rather than silently swallowing the lead.
- Check the Resend dashboard's **Emails** tab for delivery status.

---

## Deploying somewhere else

The function is a standard `Request → Response` handler, so porting it is mostly moving
the file.

### Vercel

```bash
mkdir -p api
cp netlify/functions/lead.mts api/lead.ts
```

Then remove the `import type { Context }` line and the trailing `export const config`
block, and change the signature to `export async function POST(request: Request)`.
Set the same environment variables in **Project Settings → Environment Variables**.

### Cloudflare Pages

Copy to `functions/api/lead.ts` and change the export to
`export const onRequestPost = ({ request, env }) => …`, reading keys from `env` rather
than `process.env`.

### No-code fallback: Netlify Forms

If you would rather not run a function at all, Netlify can capture submissions natively:

1. Add `data-netlify="true"` and `<input type="hidden" name="form-name" value="lead">`
   to each form, and change `action` to `/thank-you`.
2. In **Netlify → Forms → Notifications**, add an email notification to
   `info@topdogexteriors.com`.

You lose the formatted email and the `Reply-To` wiring, but it takes two minutes and has
no API key to expire.

---

## Spam protection

Three layers, none of which put a CAPTCHA in front of a paying customer:

1. **Honeypot** — a visually hidden `company` field. Bots fill it; humans never see it.
2. **Time-to-submit trap** — a form completed in under three seconds was not typed by a
   person.
3. **Server-side validation** — name, phone (10 digits), email and ZIP are re-validated
   in the function, never trusting the browser.

Both spam checks return `200 OK` so bots get no feedback about why they failed.

If spam ever does get through, add Cloudflare Turnstile or hCaptcha to the function
rather than tightening these heuristics — they are deliberately generous, because a
false positive costs a real job.

---

## Without JavaScript

Every form is a real `POST` to `/api/lead` with a real `action`, so it works with JS
disabled — the visitor lands on `/thank-you`. The JavaScript only upgrades that to an
inline async submit so nobody loses their place on the page.
