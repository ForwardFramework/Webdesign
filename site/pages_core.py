"""Homepage, about, contact, thank-you, privacy, 404."""
from config import BUSINESS as B, SITE_URL, FORM_ENDPOINT
from content_reviews import REVIEWS, REVIEW_COUNT, RATING_AVG
from content_services import SERVICES
from content_areas import AREAS
from content_pages import home_faqs, GALLERY, DIFFERENTIATORS, PROCESS
from components import (esc, url, icon, star_row, btn_call, btn_quote, trust_bar,
                        review_card, faq_list, cta_band, gallery_strip, TEL1, TEL2,
                        rating_pill, ORG_ID, profile_link)
from assets import img_src

# --------------------------------------------------------------------- home
def home():
    hero_photo = GALLERY[0]
    svc_cards = "".join(f'''<a class="card" href="/services/{s["slug"]}/">
  <span class="card-ico">{icon(s["icon"], 26)}</span>
  <h3>{s["h1"]}</h3>
  <p>{s["summary"]}</p>
  <span class="link-arrow">Learn more{icon("arrow-right", 18)}</span>
</a>''' for s in SERVICES)

    why = "".join(f'''<div class="card">
  <span class="card-ico">{icon(ic, 26)}</span>
  <h3>{t}</h3>
  <p>{d}</p>
</div>''' for ic, t, d in DIFFERENTIATORS)

    steps = "".join(f'<li><h3>{t}</h3><p>{d}</p></li>' for t, d in PROCESS)

    featured = [r for r in REVIEWS if r["featured"]][:6]
    rev = "".join(review_card(r) for r in featured[:3])

    area_pills = "".join(f'<li><a href="/service-areas/{a["slug"]}/">{a["city"]}</a></li>'
                         for a in AREAS)

    body = f'''<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-copy">
      <ul class="hero-badges">
        <li>{icon("star", 15)} {RATING_AVG} from {REVIEW_COUNT} Google reviews</li>
        <li>{icon("shield", 15)} Licensed &amp; insured</li>
        <li>{icon("chat", 15)} Se habla español</li>
      </ul>
      <h1>Pool Cage &amp; Lanai Rescreening in Sarasota, Bradenton &amp; Venice</h1>
      <p class="lede">Acosta Pro rescreens pool cages, rebuilds lanais, and repairs
        screen doors and window screens across Sarasota, Manatee and Charlotte County.
        Free written estimates. Most jobs finished in one to two days &mdash; and we
        take every scrap of old screen with us.</p>
      <div class="hero-actions">
        {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent btn-lg", "hero-call")}
        {btn_quote("Get My Free Estimate", "btn btn-outline-light btn-lg", "hero-quote")}
      </div>
      <p class="hero-proof">{star_row(5, 18)}
        <span><strong>Every single review is five stars.</strong>
        <a href="/reviews/" style="color:#fff">Read all {REVIEW_COUNT} customer reviews &rarr;</a></span></p>
    </div>
    <div class="hero-media">
      <img src="{img_src(hero_photo[0])}" alt="{esc(hero_photo[1])}"
           width="800" height="600" fetchpriority="high" decoding="async">
      <div class="hero-tag">
        <strong>1&ndash;2 days</strong>
        Typical turnaround on a full residential pool cage rescreen
      </div>
    </div>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap">
    <div class="answer-capsule narrow">
      <p class="ac-t">In short</p>
      <p>Acosta Pro Aluminum Screen LLC is a screen and aluminum contractor serving
      Sarasota, Manatee and Charlotte County, Florida. We rescreen pool cages and
      lanais, build and repair patio screen enclosures, fix and replace screen doors
      and window screens, repair storm damage, and fabricate aluminum railings and
      framing. Estimates are free and written. Call
      <a href="tel:{TEL1}">{B["phone_primary"]}</a> or
      <a href="tel:{TEL2}">{B["phone_secondary"]}</a>.</p>
    </div>
  </div>
</section>

<section class="section section-alt" id="services">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">What we do</p>
        <h2>Screen and aluminum work, done once and done right</h2>
      </div>
      <a class="link-arrow" href="/services/">All services{icon("arrow-right", 18)}</a>
    </div>
    <div class="grid g-3">{svc_cards}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split">
      <div class="split-media">
        <img src="{img_src(GALLERY[3][0])}" alt="{esc(GALLERY[3][1])}"
             width="800" height="600" loading="lazy" decoding="async">
      </div>
      <div>
        <p class="eyebrow">Why homeowners keep calling us back</p>
        <h2>Fourteen reviews. Fourteen five-star ratings.</h2>
        <p class="lede">That is not marketing copy, it is the whole record. Every
        customer who has left us a review has given us five stars, and the thing they
        mention most often is not the screen &mdash; it is that we showed up when we
        said we would and left the deck clean.</p>
        <ul class="checks">
          <li>{icon("check-circle", 20)}<span><strong>Free written estimates.</strong>
            Itemized on site, no charge, no pressure.</span></li>
          <li>{icon("check-circle", 20)}<span><strong>The same small crew every time.</strong>
            You are not getting a rotating subcontractor.</span></li>
          <li>{icon("check-circle", 20)}<span><strong>Old screen leaves with us.</strong>
            Spline, screws, offcuts &mdash; all of it.</span></li>
          <li>{icon("check-circle", 20)}<span><strong>English and Spanish.</strong>
            Whichever you would rather do business in.</span></li>
        </ul>
        <div class="hero-actions">{btn_quote("Book a free estimate", "btn btn-primary", "why-quote")}</div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head center">
      <div>
        <p class="eyebrow">Why Acosta Pro</p>
        <h2>Six reasons this job goes smoothly</h2>
      </div>
    </div>
    <div class="grid g-3">{why}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head center">
      <div>
        <p class="eyebrow">How it works</p>
        <h2>From your first call to a clean deck</h2>
      </div>
    </div>
    <ol class="steps">{steps}</ol>
  </div>
</section>

{gallery_strip(GALLERY[:8], "Recent jobs across Sarasota, Manatee &amp; Charlotte County")}

<section class="section section-alt">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow">Customer reviews</p>
        <h2>{RATING_AVG} stars from {REVIEW_COUNT} reviews</h2>
      </div>
      <a class="link-arrow" href="/reviews/">Read every review{icon("arrow-right", 18)}</a>
    </div>
    <div class="grid g-3">{rev}</div>
    <p class="center" style="margin-top:1.75rem">
      {profile_link("google", "btn btn-outline", "Verify these on Google", "home-google")}</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head center">
      <div>
        <p class="eyebrow">Service areas</p>
        <h2>Where we work</h2>
        <p class="lede narrow">Acosta Pro covers Sarasota, Manatee and Charlotte County
        &mdash; roughly a {B["service_radius_mi"]}-mile radius. If you are near the edge
        of it, call and ask.</p>
      </div>
    </div>
    <ul class="pill-list" style="justify-content:center">{area_pills}</ul>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap narrow">
    <div class="sec-head center">
      <div>
        <p class="eyebrow">Common questions</p>
        <h2>What homeowners ask us first</h2>
      </div>
    </div>
    {faq_list(home_faqs(), open_first=True)}
    <p class="center" style="margin-top:1.5rem">
      <a class="link-arrow" href="/faq/">See all 20 questions{icon("arrow-right", 18)}</a></p>
  </div>
</section>

{cta_band()}'''

    return {
        "path": "/", "body": body,
        "title": "Pool Cage & Lanai Rescreening Sarasota FL | Acosta Pro",
        "description": ("Acosta Pro rescreens pool cages, lanais and patio enclosures "
                        "across Sarasota, Bradenton and Venice. Rated 5.0 from 14 reviews. "
                        "Free estimates: 941-565-5576."),
        "faqs": home_faqs(),
        "trail": [("Home", "/")],
        "extra_nodes": [],
    }

# -------------------------------------------------------------------- about
def about():
    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">About us</p>
    <h1>Acosta Pro Aluminum Screen LLC</h1>
    <p class="lede">A small, family-run screen and aluminum contractor working
    Sarasota, Manatee and Charlotte County. Same crew on every job, every time.</p>
    <div class="page-head-actions">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent", "about-call")}
      {btn_quote("Free Estimate", "btn btn-outline-light", "about-quote")}
    </div>
  </div>
</section>
{trust_bar()}

<section class="section">
  <div class="wrap split">
    <div class="prose">
      <div class="answer-capsule">
        <p class="ac-t">Who we are</p>
        <p>Acosta Pro Aluminum Screen LLC is a licensed and insured screen and aluminum
        contractor based in the Sarasota area of Southwest Florida. We specialize in pool
        cage rescreening, lanai and patio enclosures, screen doors, window screens, storm
        damage repair and aluminum fabrication, and we work in English and Spanish.</p>
      </div>

      <h2>What we actually do all day</h2>
      <p>Screen work in Southwest Florida is a specific trade. Ten hours of UV a day,
      salt in the air off the Gulf, and a storm season that tests every fastener on a
      structure. Screen that would last fifteen years in Ohio goes chalky here in five,
      and the screws holding the frame together corrode long before the aluminum does.</p>
      <p>We rescreen pool cages and lanais, build and repair patio enclosures, fix
      sliding and swing screen doors, rebuild window screens, put enclosures back
      together after storms, and fabricate the aluminum railings and framing that hold
      it all up. Most weeks that is exactly the mix &mdash; a cage in Palmer Ranch, a
      door in Venice, a whole-house window screen job in North Port.</p>

      <h2>How we work</h2>
      <p>You get the same crew from the estimate to the walkthrough. We measure on site,
      write the price down, and stick to it. We tell you when a repair beats a
      replacement, even though the replacement pays better &mdash; because the alternative
      is a customer who does not call us again and does not leave a review.</p>
      <p>And we clean up. Old screen, spline, screws, offcuts: it leaves with us, and the
      deck gets swept and blown before we do. It is a low bar and our customers still
      mention it more than anything else, which probably says more about the industry
      than about us.</p>

      <h2>Why the reviews matter here</h2>
      <p>Screen contracting has a low barrier to entry, and Florida homeowners have all
      heard the stories &mdash; the deposit that vanished, the crew that never came back
      for the punch list, the "lifetime" screen that failed in three years. The only real
      answer to that is a track record you can check yourself.</p>
      <p>Ours is {REVIEW_COUNT} Google reviews and {RATING_AVG} stars. Not a single
      customer has rated us anything other than five. You can
      <a href="/reviews/">read every one of them</a>, including the short ones.</p>

      <h2>Licensing, insurance and the questions you should ask</h2>
      <p>We are licensed and insured, and we will hand you the documentation with your
      estimate. You should ask for it &mdash; from us and from anyone else you get a
      quote from. A screen contractor in Florida who cannot produce a current license and
      a certificate of liability insurance is not a contractor you want anchoring
      aluminum to your house.</p>
      <p>Ask them three more things while you are at it: is the estimate itemized in
      writing, who is warrantying the workmanship, and who hauls away the old screen.
      The answers sort the field quickly.</p>
    </div>
    <div>
      <div class="card">
        <h3>At a glance</h3>
        <div class="table-wrap" style="border:0">
          <table style="min-width:0">
            <tbody>
              <tr><th>Business</th><td>{esc(B["legal_name"])}</td></tr>
              <tr><th>Trade</th><td>Aluminum &amp; screen contracting</td></tr>
              <tr><th>Serving</th><td>Sarasota, Manatee &amp; Charlotte County, FL</td></tr>
              <tr><th>Phone</th><td><a href="tel:{TEL1}">{B["phone_primary"]}</a><br>
                  <a href="tel:{TEL2}">{B["phone_secondary"]}</a></td></tr>
              <tr><th>Hours</th><td>{B["hours_human"]}</td></tr>
              <tr><th>Languages</th><td>English, Spanish</td></tr>
              <tr><th>Rating</th><td>{RATING_AVG} / 5 &middot; {REVIEW_COUNT} reviews</td></tr>
              <tr><th>Estimates</th><td>Free, written, itemized</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="note" style="margin-top:1.25rem">
        <strong>Emergency after a storm?</strong>
        A blown-out cage is not usually an emergency, but a door torn off its track
        leaves the whole enclosure open. Call {B["phone_primary"]} and say it is storm
        damage &mdash; we prioritize those.
      </div>
    </div>
  </div>
</section>

{gallery_strip(GALLERY[4:8], "Work we have finished recently")}
{cta_band("Talk to the people who will actually do the work",
          "No call center, no sales rep. You get the crew that shows up.")}'''

    return {
        "path": "/about/", "body": body,
        "title": "About Acosta Pro Aluminum Screen | Sarasota FL",
        "description": ("Family-run aluminum and screen contractor serving Sarasota, "
                        "Manatee and Charlotte County. Licensed, insured, 5.0-star rated "
                        "from 14 reviews. English and Spanish."),
        "trail": [("Home", "/"), ("About", "/about/")],
    }

# ------------------------------------------------------------------ contact
def contact():
    svc_opts = "".join(f'<option value="{esc(s["nav"])}">{esc(s["nav"])}</option>'
                       for s in SERVICES)
    area_opts = "".join(f'<option value="{esc(a["city"])}">{esc(a["city"])}</option>'
                        for a in AREAS)
    action = f' action="{FORM_ENDPOINT}" method="POST"' if FORM_ENDPOINT else ""
    email_row = (f'''<li>{icon("mail", 22)}<div>
        <a href="mailto:{B["email"]}">{B["email"]}</a>
        <em>Email &mdash; we answer within a business day</em></div></li>'''
                 if B["email"] else "")

    body = f'''<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" style="color:var(--blue-400)">Free estimate</p>
    <h1>Get a free, written estimate</h1>
    <p class="lede">Call either number and you will usually reach us directly. Or send
    the form and we will come back to you with a time to come measure.</p>
  </div>
</section>

<section class="section">
  <div class="wrap contact-grid">
    <div>
      <div class="form-card">
        <h2>Request your estimate</h2>
        <p class="muted" style="font-size:.9375rem">Takes about a minute. The more you
        tell us, the more accurate the number we bring you.</p>
        <form id="quoteForm"{action} data-netlify="true" name="quote" novalidate>
          <input type="hidden" name="form-name" value="quote">
          <p class="hp" aria-hidden="true">
            <label>Leave this empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>
          </p>
          <div class="field-row">
            <div class="field">
              <label for="name">Your name <span class="req" aria-hidden="true">*</span></label>
              <input id="name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="phone">Phone <span class="req" aria-hidden="true">*</span></label>
              <input id="phone" name="phone" type="tel" autocomplete="tel" required
                     inputmode="tel" placeholder="941-555-0000">
            </div>
          </div>
          <div class="field">
            <label for="email">Email <span class="hint">Optional &mdash; we will call if you prefer</span></label>
            <input id="email" name="email" type="email" autocomplete="email">
          </div>
          <div class="field-row">
            <div class="field">
              <label for="service">What do you need?</label>
              <select id="service" name="service">
                <option value="">Not sure yet / something else</option>
                {svc_opts}
              </select>
            </div>
            <div class="field">
              <label for="city">City</label>
              <select id="city" name="city">
                <option value="">Select your city</option>
                {area_opts}
                <option value="Other">Somewhere else in the 941</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="details">Tell us about the job</label>
            <textarea id="details" name="details" rows="5"
              placeholder="e.g. Pool cage, roughly 24 panels, three torn on the west side and the door sticks. Built around 2006."></textarea>
            <span class="hint">Panel count, rough age of the enclosure, and what is
            wrong. Photos help too &mdash; text them to {B["phone_primary"]}.</span>
          </div>
          <button class="btn btn-accent btn-lg btn-block" type="submit">
            Request my free estimate</button>
          <p class="form-note">We use your details to quote your job and nothing else.
          No mailing list, no sharing.</p>
          <p class="note" id="formFallback" tabindex="-1" hidden style="margin-top:1rem">
            <strong>This form is not connected yet.</strong>
            Please call <a href="tel:{TEL1}">{B["phone_primary"]}</a> or
            <a href="tel:{TEL2}">{B["phone_secondary"]}</a> &mdash; we answer both.
          </p>
        </form>
      </div>
    </div>

    <div>
      <div class="form-alt">
        {icon("phone", 24)}
        <span><strong>In a hurry?</strong> Calling is faster than the form, and you will
        usually get one of us rather than a voicemail.</span>
      </div>
      <ul class="contact-list">
        <li>{icon("phone", 22)}<div>
          <a href="tel:{TEL1}" data-track="contact-call">{B["phone_primary"]}</a>
          <em>Main line &mdash; estimates and scheduling</em></div></li>
        <li>{icon("phone", 22)}<div>
          <a href="tel:{TEL2}" data-track="contact-call2">{B["phone_secondary"]}</a>
          <em>Second line &mdash; if the first is busy</em></div></li>
        {email_row}
        <li>{icon("clock", 22)}<div><strong>{B["hours_human"]}</strong>
          <em>Storm damage calls are prioritized</em></div></li>
        <li>{icon("pin", 22)}<div><strong>Sarasota, Manatee &amp; Charlotte County</strong>
          <em>Service-area business &mdash; we come to you, there is no showroom</em></div></li>
        <li>{icon("chat", 22)}<div><strong>English &amp; Spanish</strong>
          <em>Se habla español</em></div></li>
      </ul>

      <div class="card" style="margin-top:1.5rem">
        <h3>What happens after you send this</h3>
        <ol style="padding-left:1.15rem;display:grid;gap:.55rem;font-size:.9375rem;margin:0">
          <li>We call you back to confirm the details and pick a time.</li>
          <li>We come out, measure, and check the frame, doors and hardware.</li>
          <li>You get an itemized written price &mdash; free, and yours to compare.</li>
          <li>If you go ahead, we book a start date, usually within the week.</li>
        </ol>
      </div>

      <p class="foot-rating" style="margin-top:1.5rem;color:var(--ink-3)">
        {star_row(5, 18)} <strong style="color:var(--ink)">{RATING_AVG}</strong>
        <span>from {REVIEW_COUNT} Google reviews</span></p>
    </div>
  </div>
</section>

{cta_band("Rather just talk to someone?", "Both numbers reach us directly during working hours.")}'''

    return {
        "path": "/contact/", "body": body,
        "title": "Contact Acosta Pro | Free Screen Estimate | 941-565-5576",
        "description": ("Get a free written estimate for pool cage rescreening, lanai "
                        "enclosures, screen doors or window screens. Call 941-565-5576 "
                        "or 941-879-4211, or request online."),
        "trail": [("Home", "/"), ("Contact", "/contact/")],
        "extra_nodes": [{
            "@type": "ContactPage", "@id": url("/contact/") + "#contactpage",
            "url": url("/contact/"), "about": {"@id": ORG_ID},
        }],
    }

# ---------------------------------------------------------------- thank you
def thank_you():
    body = f'''<section class="section">
  <div class="wrap narrow center" style="padding-block:3rem">
    <span class="card-ico" style="width:72px;height:72px;margin-inline:auto;color:var(--green-700);background:#DCFCE7">
      {icon("check-circle", 36)}</span>
    <h1>Thanks &mdash; we have got it</h1>
    <p class="lede">Your estimate request is in. We will call you back to confirm the
    details and set a time to come measure, usually the same or next business day.</p>
    <p>If it is urgent &mdash; a door that will not close, or storm damage &mdash;
    call us directly rather than waiting.</p>
    <div class="hero-actions" style="justify-content:center">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent btn-lg", "ty-call")}
      <a class="btn btn-outline btn-lg" href="/gallery/">See our recent work</a>
    </div>
  </div>
</section>'''
    return {
        "path": "/thank-you/", "body": body, "noindex": True,
        "title": "Thank You | Acosta Pro Aluminum Screen",
        "description": ("Your free estimate request has been received by Acosta Pro Aluminum Screen. We will call you back to arrange a time to come and measure."),
        "trail": [("Home", "/"), ("Thank you", "/thank-you/")],
    }

# ------------------------------------------------------------------ privacy
def privacy():
    body = f'''<section class="page-head">
  <div class="wrap"><h1>Privacy Policy</h1>
  <p class="lede">Last updated 31 August 2026.</p></div>
</section>
<section class="section"><div class="wrap prose">
  <h2>What we collect</h2>
  <p>If you fill in the estimate form on this site we collect the name, phone number,
  email address, city and job details you type into it. If you call us, we keep the
  number you called from and whatever you tell us about the job. That is all.</p>

  <h2>What we do with it</h2>
  <p>We use it to quote your job, schedule it, and follow up about it. We do not sell
  it, rent it, or add you to a mailing list. We do not share it with anyone except a
  supplier or subcontractor who needs it to complete your specific job.</p>

  <h2>Analytics and cookies</h2>
  <p>This site may use Google Analytics to count visits and see which pages people
  read. That uses cookies and records an anonymized IP address. It tells us that
  someone in Venice read the pool cage page; it does not tell us who. You can block
  cookies in your browser and the site will still work normally.</p>

  <h2>How long we keep it</h2>
  <p>Estimate requests and job records are kept for as long as we need them for
  warranty and tax purposes, then deleted.</p>

  <h2>Your choices</h2>
  <p>Ask us to delete your details and we will. Call
  <a href="tel:{TEL1}">{B["phone_primary"]}</a> and say so.</p>

  <h2>Text messages</h2>
  <p>If you text us photos of your enclosure, we keep them with your job file so the
  crew can see what they are walking into. We do not publish customer photos without
  asking first.</p>

  <h2>Contact</h2>
  <p>{esc(B["legal_name"])}<br>
  Serving Sarasota, Manatee and Charlotte County, Florida<br>
  <a href="tel:{TEL1}">{B["phone_primary"]}</a> &middot;
  <a href="tel:{TEL2}">{B["phone_secondary"]}</a></p>
</div></section>'''
    return {
        "path": "/privacy/", "body": body,
        "title": "Privacy Policy | Acosta Pro Aluminum Screen",
        "description": "How Acosta Pro Aluminum Screen collects, uses and protects the "
                       "information you send us.",
        "trail": [("Home", "/"), ("Privacy", "/privacy/")],
    }

# ---------------------------------------------------------------------- 404
def not_found():
    links = "".join(f'<li><a href="/services/{s["slug"]}/">{s["nav"]}</a></li>'
                    for s in SERVICES)
    body = f'''<section class="section">
  <div class="wrap narrow center" style="padding-block:3rem">
    <p class="eyebrow">404</p>
    <h1>That page is not here</h1>
    <p class="lede">The link may be old, or we may have moved the page. Here is
    everything we do &mdash; or just call us.</p>
    <ul class="pill-list" style="justify-content:center">{links}</ul>
    <div class="hero-actions" style="justify-content:center;margin-top:2rem">
      {btn_call(B["phone_primary"], f'Call {B["phone_primary"]}', "btn btn-accent btn-lg", "404-call")}
      <a class="btn btn-outline btn-lg" href="/">Back to the homepage</a>
    </div>
  </div>
</section>'''
    return {
        "path": "/404/", "body": body, "noindex": True, "filename": "404.html",
        "title": "Page not found | Acosta Pro Aluminum Screen",
        "description": ("That page could not be found. Browse Acosta Pro Aluminum Screen services for pool cages, lanais, screen doors and window screens in Southwest Florida."),
        "trail": [("Home", "/")],
    }
