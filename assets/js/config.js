/* =============================================================================
   Eclipse Aluminum & Shade — SITE CONFIGURATION
   -----------------------------------------------------------------------------
   This is the only file you need to edit for day-to-day changes:
   phone numbers, the promotional offer, the booking link and the form endpoint.
   Everything else on the site reads from here.
   ========================================================================== */

window.ECLIPSE_CONFIG = {

  /* ---------------------------------------------------------------------------
     1. BUSINESS DETAILS
     ------------------------------------------------------------------------ */
  business: {
    name:         'Eclipse Aluminum & Shade',
    shortName:    'Eclipse',
    tagline:      'Shade. Comfort. Protection.',
    subTagline:   'Built for Florida. Built to Last.',
    phone:        '941-420-2461',
    phoneHref:    'tel:+19414202461',
    // Set this once you have a monitored inbox. Used for the mailto fallback.
    email:        'info@eclipsealuminumandshade.com',
    website:      'www.eclipsealuminumandshade.com',
    stateLicense: 'SCC131151772',
    // Shown in the footer and used for the LocalBusiness structured data.
    serviceArea:  [
      'Sarasota', 'Bradenton', 'Lakewood Ranch', 'Venice', 'Osprey', 'Nokomis',
      'North Port', 'Englewood', 'Port Charlotte', 'Punta Gorda', 'Palmetto', 'Parrish'
    ],
    hours: 'Mon–Fri 8:00am – 5:00pm  ·  Sat by appointment',
    social: {
      // Leave a value empty ('') to hide that icon.
      facebook:  '',
      instagram: '',
      google:    ''
    }
  },

  /* ---------------------------------------------------------------------------
     2. THE OFFER
     -----------------------------------------------------------------------------
     The conversion research behind this offer is written up in
     docs/OFFER-RESEARCH.md. Change the numbers here and every mention of the
     offer across the page updates with it.

     `deadline` drives the live countdown. Use YYYY-MM-DD. Set it to null to
     hide the countdown entirely and keep the rest of the offer.

     `slotsRemaining` powers the scarcity line. Set to null to hide it.
     Only ever put a true number here — a fake one will cost you trust.
     ------------------------------------------------------------------------ */
  offer: {
    enabled:        true,
    eyebrow:        'This month only',
    headline:       'See it on your home before you buy it.',
    subhead:        'Book a free design consultation and we’ll build a photo-realistic 3D rendering of your home with your new shade on it — so you know exactly what you’re getting.',
    renderingValue: 499,          // "$499 value" — the free 3D rendering
    dollarsOff:     500,          // "$500 off your project"
    minimumProject: 3500,         // $500 off applies to projects at or above this
    deadline:       null,         // e.g. '2026-09-30' to switch the countdown on
    slotsRemaining: null,         // e.g. 6 to switch the scarcity line on
    ctaPrimary:     'Claim My Free 3D Design',
    ctaSecondary:   'Get My Instant Price Range',
    // The four bullets in the offer stack. Keep them benefit-led.
    // `valueText` overrides the auto-generated "$N value" chip when a different
    // phrasing reads better. Omit it and the chip falls back to `value`.
    stack: [
      { value: 499, label: 'Custom 3D rendering of your home',   note: 'See your exact shade, color and placement before a single bracket goes up.' },
      { value: 500, valueText: 'Save $500',
                    label: '$500 off your project',              note: 'Applied at contract signing on projects of $3,500 or more.' },
      { value: 0,   label: 'On-site design & laser measurement', note: 'A real designer at your home, not a guess over the phone.' },
      { value: 0,   label: 'Written, itemized quote',            note: 'Good for 30 days. No pressure, no obligation, no surprise line items.' }
    ],
    guarantee: {
      title: 'The No-Pressure Promise',
      body:  'No high-pressure sales pitch, no “today-only” gimmicks at your kitchen table. We measure, we design, we hand you a written price. You decide on your own time.'
    },
    financing: {
      enabled: true,
      // Illustrative only — replace with the real terms your lender approves you for.
      apr: 9.99,
      months: 120,
      disclaimer: 'Illustrative payment example only. Financing is subject to credit approval through our third-party lending partners; terms and rates vary. Not a commitment to lend.'
    }
  },

  /* ---------------------------------------------------------------------------
     3. ONLINE BOOKING  ("live schedule")
     -----------------------------------------------------------------------------
     Paste your scheduling link below and the "Book" buttons switch from
     opening the contact form to opening your real, live calendar.

     provider: 'calendly'  → https://calendly.com/your-name/design-consultation
               'acuity'    → https://app.acuityscheduling.com/schedule.php?owner=XXXX
               'hubspot'   → https://meetings.hubspot.com/your-name/consultation
               'google'    → your Google Appointment Schedule booking page URL
               'iframe'    → any other scheduler that allows embedding
               'none'      → booking buttons fall back to the contact form

     Every provider below is embedded in an iframe except Calendly, which gets
     its official inline widget for the best mobile experience. If your provider
     blocks embedding, the modal automatically offers a "open in a new tab" link,
     so a visitor never hits a dead end.
     ------------------------------------------------------------------------ */
  booking: {
    provider: 'none',
    url:      '',      // e.g. 'https://calendly.com/eclipse-shade/design-consultation'
    // Optional: pre-fill the scheduler with what we already know about the lead.
    // Calendly + HubSpot support this via query params; harmless elsewhere.
    prefill:  true,
    modalTitle:    'Book your free design consultation',
    modalSubtitle: 'Pick any time that works — you’ll get instant confirmation and a reminder text.',
    // Shown inside the modal when provider is 'none', so the page never looks broken.
    fallbackNote:  'Our live calendar is being set up. Send the form below and we’ll call you within one business day to lock in a time — or call us right now.'
  },

  /* ---------------------------------------------------------------------------
     4. CONTACT FORM DELIVERY
     -----------------------------------------------------------------------------
     Where the form posts. Pick whichever is easiest for you:

       'formspree'  → endpoint: 'https://formspree.io/f/XXXXXXXX'   (free tier works)
       'netlify'    → no endpoint needed; deploy on Netlify and it just works
       'web3forms'  → endpoint: your access key from web3forms.com
       'custom'     → endpoint: your own URL that accepts a JSON POST
       'mailto'     → opens the visitor's email client (last resort — leaks leads)

     Until one is configured, the form runs in DEMO mode: it validates properly,
     shows the success screen, and logs the payload to the browser console so you
     can see exactly what will be sent. Nothing is silently lost, and the phone
     number is always shown as a backup.
     ------------------------------------------------------------------------ */
  form: {
    provider: 'demo',
    endpoint: '',
    // Where lead notifications should say they came from.
    subject:  'New website lead — Eclipse Aluminum & Shade',
    successTitle:   'Got it — you’re on the list.',
    successBody:    'We’ll call you from 941-420-2461 within one business day to schedule your free design consultation. Keep an eye out.',
    // Set to true to require consent before the form will submit (recommended if
    // you plan to text your leads — see docs/SETUP.md on TCPA consent).
    requireSmsConsent: true
  },

  /* ---------------------------------------------------------------------------
     5. REVIEWS
     -----------------------------------------------------------------------------
     Deliberately empty. The reviews section stays hidden until you paste real
     ones in — never publish invented testimonials. Copy them verbatim from
     Google, Facebook or Angi, with the reviewer's first name and last initial.

       { name: 'Karen M.', where: 'Lakewood Ranch', stars: 5,
         text: 'They measured on Tuesday and I had the rendering by Friday…' }
     ------------------------------------------------------------------------ */
  reviews: {
    headline: 'Trusted across Sarasota & Manatee',
    items: []
  },

  /* ---------------------------------------------------------------------------
     6. ANALYTICS  (optional)
     -----------------------------------------------------------------------------
     Drop in your IDs and the tags load automatically. Leave blank to load nothing
     — no third-party scripts run unless you put an ID here.
     ------------------------------------------------------------------------ */
  analytics: {
    googleAnalyticsId: '',   // 'G-XXXXXXXXXX'
    googleAdsId:       '',   // 'AW-XXXXXXXXX'
    metaPixelId:       '',   // '123456789012345'
    // Fires on estimate completion and form submit if the tags above are present.
    trackEvents: true
  }
};
