# Before this site goes live

I built the whole site, but a few facts I could not verify from what I was given.
Every one of them is in **`site/config.py`** marked `# VERIFY`. Fix these, run
`python3 site/build.py`, and you're done.

None of these break the site — it builds and runs correctly as-is. But several of
them directly affect how well you rank locally, so they're worth an hour.

---

## 1. The logo is in — as a redrawn vector. Job photos still needed.

**Logo: done.** The whole site is now built on your roofline mark and its blue
palette. Because the logo reached me as a picture rather than a file, I rebuilt
it as vector artwork traced from your image — the layered eave and gable, the
chimney, the two-pane window, the cyan-to-deep-blue gradient, and "Acosta Pro /
Aluminum Screen" set in Poppins Bold, which is a very close match to your
lettering.

It is a faithful recreation, not the original file. If you have the vector your
designer produced (`.ai`, `.eps`, or `.svg`), use it — drop it in and you get
the exact curves and letterforms:

| File | Where it appears |
|---|---|
| `site/static/img/brand/acosta-pro-logo.svg` | Header — dark wordmark for white backgrounds |
| `site/static/img/brand/acosta-pro-logo-light.svg` | Footer — white wordmark for navy backgrounds |
| `site/static/img/brand/acosta-pro-logo-stacked.svg` | Stacked lockup, matching your original layout |

Any format works — `.svg`, `.png`, `.webp`. The build reads the real pixel
dimensions and adjusts the header height to the logo's actual proportions, so a
square mark and a wide wordmark both sit correctly. If you supply only one file
and no light version, the footer automatically puts it on a white chip so it
stays legible.

All the brand assets are generated from one shared definition of the mark in
`site/make_brand.py` — logo lockups, favicon, app icons and the social card.
Edit the geometry or colors there and run `python3 site/make_brand.py` to
regenerate every size at once.

**Job photos: still needed.** Drop them in `site/static/img/gallery/` using
exactly these basenames — `.jpg`, `.webp` or `.png`, whichever you have:

```
pool-cage-rescreen-01     pool-cage-rescreen-02     pool-cage-rescreen-03
lanai-enclosure-01        lanai-enclosure-02        lanai-enclosure-03
screen-door-01            screen-door-02
window-screen-01
storm-repair-01           storm-repair-02
aluminum-work-01
```

Then edit the `GALLERY` list in `site/content_pages.py` so the **alt text
matches what's actually in each photo**. The alt text I wrote is a plausible
guess — it needs to describe the real image, both for screen readers and
because Google Images is a live lead source for this trade. Before/after pairs
convert best if you have them.

Photos should be roughly 4:3, 1600px wide, and compressed to under ~250KB each
(https://squoosh.app is free). Page speed is a ranking factor.

**Social share image** — `site/static/img/brand/og-default.png` is now your
mark on the brand navy. A real photo of your best job would do more work when
someone shares a link; replace it at 1200×630.

---

## 2. Business facts to confirm — `site/config.py`

| Field | I used | Why it matters |
|---|---|---|
| `city` / `postal` / `latitude` / `longitude` | Sarasota, 34232 | Inferred from your 941 area code. **Set these to your real base city.** Local rankings are distance-weighted from this point. |
| `founded` | 2019 | Shows in structured data. Use the real year. |
| `hours` / `hours_human` | Mon–Fri 7–6, Sat 8–4 | Must match your Google Business Profile exactly. |
| `payment` | Cash, check, card, Zelle | Remove anything you don't take. |
| `license` | *(empty)* | Add your Florida license number. It shows in structured data and it's a real trust signal. |
| `email` | *(empty, hidden)* | Add one and it appears in the footer and contact page automatically. |
| `has_storefront` | `False` | Correct if you work out of a truck. If you have a shop customers can visit, set `True` and fill in `street`. |

**`SITE_URL`** is set to `https://www.acostaproaluminumscreen.com`. Change it to
your real domain **before you deploy** — it's used in every canonical tag, the
sitemap and all structured data. Getting it wrong is the one thing here that
actively hurts.

**`PROFILES`** now carries your Google Business Profile, which feeds the
`sameAs` structured data and puts a "Verify all 14 on Google" link on the
reviews page, the homepage and in the footer. That is how search engines and AI
tools connect this website to your review corpus — done.

Two follow-ups on it:

- **A canonical Maps URL would be a slightly stronger signal.** You gave me a
  `share.google/...` link, which is a Google-owned redirect and works fine. The
  direct form is marginally better because it names the place entity outright
  rather than pointing at a redirect. To get it: open your business on Google
  Maps in a desktop browser and copy the address bar — it looks like
  `https://www.google.com/maps/place/Acosta+Pro+Aluminum+Screen/@27.33,-82.53,17z/...`.
  Paste that over the `url` in `PROFILES` and rebuild. Not urgent.
- **Facebook and Instagram are stubbed out**, commented, right below it in
  `site/config.py`. Uncomment and add the URLs and they appear in the footer
  automatically, with their own icons and labels.

---

## 3. Claims I wrote that you should sign off on

I kept marketing claims to things I could support from your reviews, but read
these and confirm they're true:

- **"Licensed and insured"** — appears in the trust bar, About page and FAQ.
  Remove it everywhere if it's not current.
- **"We warranty our workmanship"** — FAQ, "Paying and warranty". Adjust to your
  actual terms.
- **"Free estimates"** — used heavily throughout. It's the site's main hook.
- **"Deposit on material-heavy jobs"** — FAQ. Change if you work differently.
- **Turnaround times** (lanai 1 day, pool cage 1–2 days) — used on the homepage,
  services hub and every service page. These are the industry norm; confirm they
  match your crew.
- **Service radius, 45 miles** — `service_radius_mi` in config.
- **Neighborhood lists** on the 8 city pages (`site/content_areas.py`) — these
  are real neighborhoods, but check you actually take jobs in all of them.

---

## 4. The contact form isn't connected yet

The form is built and validates, but it has nowhere to send to. Right now,
submitting it shows a message telling the customer to call instead — deliberately,
so a lead is never silently lost.

Pick one:

- **Netlify** — deploy to Netlify and it works immediately, no config. Submissions
  appear in your Netlify dashboard. (The form already carries `data-netlify`.)
- **Formspree** — sign up free, then set `FORM_ENDPOINT` in `config.py` to your
  form URL.
- **Web3Forms** — same idea, free tier is generous.

Whichever you pick, **send a test submission** and confirm it reaches you. Also
set the success redirect to `/thank-you/` — that page already exists.

---

## 5. Reviews

All 14 reviews are on `/reviews/`, owner replies removed as you asked. Two notes:

- **Two reviews were cut off** by Google's "… More" truncation (Gonzalez Aguila
  and Yani Gonzalez). I trimmed them at the last complete sentence rather than
  invent an ending. If you can get the full text from your Google dashboard, paste
  it into `site/content_reviews.py`.
- **Dates are approximate.** Google gave relative times ("3 months ago"), so I
  converted them against 2026-08-31. They're within a few weeks. Exact dates from
  your dashboard would be better since they appear in structured data.

---

## 6. After launch — the part that actually moves the needle

The site is the foundation; these are what rank it.

1. **Google Business Profile.** Add the website URL. Make sure the business name,
   phone and hours match this site character-for-character — inconsistent NAP data
   is the most common reason local businesses under-rank.
2. **Google Search Console.** Add the property, submit `sitemap.xml`, and check
   the Rich Results report a week later for structured-data errors.
3. **Bing Webmaster Tools.** Free, five minutes, and it feeds ChatGPT's search
   index — which matters more every month.
4. **Keep asking for reviews.** 14 at 5.0 is a genuinely strong position. Getting
   to 40+ while holding 5.0 will do more for your rankings than anything else on
   this list. The `aggregateRating` in the code updates automatically when you add
   reviews to `content_reviews.py`.
5. **Directory listings.** Yelp, Angi, Nextdoor, BBB, HomeAdvisor. Use the
   identical name, address and phone every time.
6. **Add photos to your Google Business Profile monthly.** Google measurably
   favors active profiles.
