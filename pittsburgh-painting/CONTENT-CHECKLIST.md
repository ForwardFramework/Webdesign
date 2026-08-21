# ⚠ Do not launch until this list is done

Everything below is a **business fact or a business promise** that the build could not invent.
The site ships with reasonable defaults so it looks and reads complete — but several of these
are commitments you'd be making to customers in writing, and a couple are legal exposure.

Each item is also flagged inline in the source with a `<!-- VERIFY -->` comment. To find them all:

```bash
grep -rn "VERIFY" _src/ build.py
```

---

## 🔴 Must fix — these are false or unverified as shipped

| # | Item | Where | What to do |
|---|---|---|---|
| 1 | **All 10 testimonials are placeholders** | `_src/reviews.html`, `_src/home.html`, `_src/estimate.html` | Replace every one with a **verbatim** Google or Facebook review, real first name + last initial, real neighborhood. Publishing invented reviews is an FTC problem and shoppers cross-check your Google profile anyway. |
| 2 | **Stats are invented** — "500+ homes", "12 years", "4.9★", "5 yr warranty" | `_src/home.html` (`data-count`) | Replace with real numbers. If you don't track homes painted, drop that stat rather than guess. |
| 3 | **"5-year written workmanship warranty"** | home, offer, exterior, about | Confirm the actual term and get the wording from whatever you put on your contract. If there is no written warranty yet, either write one or change this to what you really offer. |
| 4 | **"$1,000 off" terms** | `_src/offer.html`, promo bar | Minimum job size? Expiry date? One per property? Combinable? The offer page states terms — make them yours. |
| 5 | **"Free color consultation + digital rendering ($350 value)"** | home, offer, estimate, gallery | Confirm you can actually deliver this on every estimate. If it's exteriors only, scope the copy to exteriors. |
| 6 | **Price ranges** — $4,500–$12,000 exterior, $450–$900/room interior, $3,000–$6,500 cabinets | FAQs on home, exterior, interior, cabinets | These are plausible market ranges, not your numbers. Correct them or delete the FAQ. Publishing a range you won't honor costs you trust on the walk-through. |
| 7 | **Insurance / licensing** | footer, About, FAQs | Add carrier, coverage amounts and your PA Home Improvement Contractor (HIC) registration number. PA requires the HIC number on advertising. |
| 8 | **Brian's bio** | `_src/about.html` | Written generically. Replace with his real story, years in the trade, and background. This is one of the highest-read blocks on any contractor site. |
| 9 | **All 33 photos are placeholders** | `assets/img/` | See `assets/img/README.md`. The before/after pairs matter most. |
| 10 | **Form goes nowhere** | `estimate.html`, `offer.html`, homepage form | No endpoint is configured — submissions currently show an inline thank-you and are **not delivered anywhere**. See README § *Wiring up the form*. |

## 🟡 Should fix before you spend money on ads

| # | Item | Where |
|---|---|---|
| 11 | **Domain** — `pittsburghpaintingpps.com` is a placeholder in canonical URLs, sitemap and JSON-LD | `build.py` → `SITE` |
| 12 | **Facebook URL** is the generic facebook.com | `build.py` → `footer()` and JSON-LD `sameAs` |
| 13 | **Google Business Profile link** — the Reviews page says "read our Google reviews" with no link | `_src/reviews.html` |
| 14 | **Service-area list** — 64 neighborhoods listed; confirm crews actually travel to all of them | `_src/areas.html`, `_src/home.html` |
| 15 | **SMS consent wording** on the estimate form must match your carrier's compliance requirements if you text leads | `_src/estimate.html` |
| 16 | **Privacy policy** is a sensible template, not legal advice. Have it checked if you run Google Ads lead forms or an SMS program. | `_src/privacy.html` |
| 17 | **Referral bonus** is referenced on the thank-you page but never defined | `_src/thankyou.html` |
| 18 | **Volume terms for investors** are implied on the renovations page | `_src/renovations.html` |
| 19 | **Permitting practice** — the renovations FAQ says you pull permits; confirm | `_src/renovations.html` |
| 20 | **Payment schedule** — the renovations FAQ describes milestone billing; confirm | `_src/renovations.html` |
| 21 | **Analytics + conversion tracking** are stubbed and fire nothing | See README § *Tracking* |

## 🟢 Nice to have

- Build the lead magnet PDF (*The Pittsburgh Homeowner's Exterior Paint Checklist*) referenced in `PLAN.md`. The email-capture UI isn't built yet — it's the obvious next addition, and it catches the ~60% of visitors who won't book today.
- Replace `assets/logo-mark.svg` with a vectorised version of the real goat logo. The current mark is a hand-drawn approximation for favicon and header use.
- Add real Google review markup (`AggregateRating`) to the JSON-LD **only once you have real counts** — Google penalises invented ratings.
