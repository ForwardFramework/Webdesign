import { createFileRoute } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import {
  company,
  gallery,
  locations,
  materials,
  process,
  reviewMeta,
  reviews,
  servingAreas,
  servingCounties,
  services,
  stats,
} from "@/kb-content";
import "@/kb-brand.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,600;1,400&family=Cabin:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600&display=swap";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: FONTS },
    ],
  }),
  component: Index,
});

// The whole page IS the journey: the scrub controller owns media time, while
// every chapter stays server-rendered in ordinary semantic flow.
function Index() {
  return (
    <div className="kb">
      <SiteHeader />

      <main>
        <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />

        <StatTicker />
        <Heritage />
        <Materials />
        <Process />
        <Work />
        <Testimony />
        <Showrooms />
        <EstimateSlab />
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="kb-header">
      <a href="#top" aria-label={`${company.name} home`}>
        <img
          alt={`${company.name} logo`}
          className="kb-logo"
          height={34}
          src="/assets/kb/kb-logo.png"
          width={157}
        />
      </a>

      <nav aria-label="Primary" className="kb-nav">
        <a className="kb-nav__link" href="#materials">
          Materials
        </a>
        <a className="kb-nav__link" href="#process">
          Process
        </a>
        <a className="kb-nav__link" href="#work">
          Work
        </a>
        <a className="kb-nav__link" href="#showrooms">
          Showrooms
        </a>
      </nav>

      <a className="kb-cta-call" href={company.mainPhoneHref}>
        {company.mainPhone}
      </a>
    </header>
  );
}

function StatTicker() {
  const run = [...stats, ...stats];

  return (
    <section aria-label="KB Countertops by the numbers" className="kb-ticker">
      <div className="kb-ticker__track">
        {run.map((stat, index) => (
          <p className="kb-ticker__item" key={`${stat.label}-${index}`}>
            <span className="kb-ticker__figure">{stat.figure}</span>
            <span className="kb-ticker__label">{stat.label}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function Heritage() {
  return (
    <section className="kb-section kb-section--light" id="story">
      <div className="kb-shell kb-split">
        <figure className="kb-split__figure kb-rise">
          <img
            alt="A KB Countertops kitchen installation in Tampa Bay"
            loading="lazy"
            src="/assets/kb/project-1.jpg"
          />
          <figcaption className="kb-split__stamp">Tampa Bay, since 2007</figcaption>
        </figure>

        <div className="kb-prose">
          <p className="kb-eyebrow">The house that stone built</p>
          <h2 className="kb-h2">
            One man, one slab, and a refusal to use anybody else&rsquo;s middleman.
          </h2>
          <p>
            In 2007 {company.founder} picked up a stone slab and made a promise: that
            every homeowner and every builder in Tampa Bay deserved the finest
            countertops at a price that actually made sense. Nineteen years later
            {" "}{company.name} is still family owned, and still imports every slab it
            sells.
          </p>
          <p>
            While the competition ordered through distributors, {company.founder} went
            to the quarries. While the competition subcontracted the install,
            he built an in-house fabrication and installation crew. Every countertop
            is measured, cut, finished and set by KB&rsquo;s own people. That was never
            a business decision so much as a standard: if your name is on it, it has
            to be right.
          </p>
          <p>
            Today that adds up to more than 50,000 installations across Hillsborough,
            Pinellas, Pasco, Hernando and Polk, from single South Tampa kitchens to
            hotels, restaurants and whole apartment communities. Countertops, cabinets
            and flooring now come from one team, under one roof, at wholesale direct
            pricing, with financing available from 12 to 60 months.
          </p>
          <p className="kb-signature">
            &ldquo;{company.promise}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

function Materials() {
  return (
    <section className="kb-section" id="materials">
      <div className="kb-shell">
        <p className="kb-eyebrow">What we carry</p>
        <h2 className="kb-h2">
          Five hundred slabs. Every one of them on our own floor.
        </h2>
        <p className="kb-lede">
          Granite, quartz, marble, quartzite, dolomite, soapstone and semiprecious,
          imported direct and priced wholesale. Walk the yard, put your hand on the
          stone, and take the piece you actually chose.
        </p>

        <div className="kb-grid-materials">
          {materials.map((material) => (
            <article className="kb-material" key={material.id}>
              <div className="kb-material__frame">
                <img
                  alt={`${material.name} countertop by KB Countertops`}
                  loading="lazy"
                  src={material.image}
                />
              </div>
              <div className="kb-material__body">
                <h3 className="kb-material__name">{material.name}</h3>
                <p className="kb-material__note">{material.note}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="kb-services">
          {services.map((service) => (
            <article className="kb-service" key={service.name}>
              <h3 className="kb-service__name">{service.name}</h3>
              <p className="kb-service__body">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="kb-section kb-section--light" id="process">
      <div className="kb-shell">
        <p className="kb-eyebrow">Five steps, one company</p>
        <h2 className="kb-h2">From the slab yard to your kitchen in about seven days.</h2>
        <p className="kb-lede">
          Production approval means the sink and cooktop dimensions, the backsplash
          measurements and the CAD are confirmed and the slab layout is signed off.
          After that, the clock is roughly a week.
        </p>

        <div className="kb-process">
          {process.map((step) => (
            <article className="kb-step" key={step.step}>
              <p className="kb-step__num">{step.step}</p>
              <div>
                <h3 className="kb-step__name">{step.name}</h3>
                <p className="kb-step__body">{step.body}</p>
              </div>
              <div className="kb-step__figure">
                <img alt={step.name} loading="lazy" src={step.image} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="kb-section" id="work">
      <div className="kb-shell">
        <h2 className="kb-h2">Fifty thousand kitchens, and counting.</h2>
        <p className="kb-lede">
          Residential kitchens and baths, outdoor kitchens, and commercial work for
          apartments, hotels and community houses. Licensed, bonded and insured under
          general contractor licence {company.license}.
        </p>

        <div className="kb-gallery">
          {gallery.map((item) => (
            <figure className="kb-tile" key={item.image}>
              <img alt={item.caption} loading="lazy" src={item.image} />
              <figcaption className="kb-tile__caption">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimony() {
  return (
    <section className="kb-section kb-section--light" id="reviews">
      <div className="kb-shell">
        <h2 className="kb-h2">Most of our work still arrives by word of mouth.</h2>

        <div className="kb-reviews">
          {reviews.map((review) => (
            <blockquote className="kb-review" key={review.quote}>
              <p className="kb-review__quote">&ldquo;{review.quote}&rdquo;</p>
              <cite className="kb-review__source">{review.source}</cite>
            </blockquote>
          ))}
        </div>

        <div className="kb-rating">
          <p className="kb-rating__score">{reviewMeta.rating}</p>
          <p className="kb-rating__note">{reviewMeta.note}</p>
        </div>
      </div>
    </section>
  );
}

function Showrooms() {
  return (
    <section className="kb-section" id="showrooms">
      <div className="kb-shell">
        <p className="kb-eyebrow">Come stand on the floor</p>
        <h2 className="kb-h2">Three Tampa Bay showrooms.</h2>
        <p className="kb-lede">
          Serving {servingCounties}. Walk in, see the slabs in daylight, and leave with
          a plan that fits the room and the budget.
        </p>

        <div className="kb-locations">
          {locations.map((location) => (
            <article className="kb-location" key={location.id}>
              <h3 className="kb-location__city">{location.city}</h3>
              <p className="kb-location__note">{location.note}</p>
              <p className="kb-location__addr">
                {location.address}
                <br />
                {location.region}
              </p>
              <ul className="kb-location__hours">
                {location.hours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="kb-location__foot">
                <a className="kb-cta-call" href={location.phoneHref}>
                  {location.contact} &middot; {location.phone}
                </a>
                <a
                  className="kb-cta-directions"
                  href={location.maps}
                  rel="noreferrer"
                  target="_blank"
                >
                  Directions <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <ul className="kb-areas">
          {servingAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function EstimateSlab() {
  return (
    <section className="kb-slab" id="estimate">
      <div className="kb-shell kb-slab__grid">
        <div>
          <h2>Free in-home estimate, measured by the people who will cut it.</h2>
          <p>
            Tell us the room and we will bring the samples to you, laser the space, and
            price it wholesale direct. No distributor markup, no subcontracted crew.
          </p>
          <div className="kb-slab__actions">
            <a className="kb-cta-book" href={company.mainPhoneHref}>
              Call {company.mainPhone}
            </a>
            <a className="kb-cta-book" href={`mailto:${company.email}`}>
              Email the shop
            </a>
          </div>
        </div>

        <ul className="kb-slab__facts">
          <li>Wholesale direct pricing, open to the public</li>
          <li>Financing from 12 to 60 months</li>
          <li>10 year workmanship warranty</li>
          <li>Licensed, bonded and insured &middot; {company.license}</li>
        </ul>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="kb-footer">
      <div className="kb-shell">
        <div className="kb-footer__top">
          <div>
            <img
              alt={`${company.name} logo`}
              className="kb-footer__logo"
              height={40}
              src="/assets/kb/kb-logo.png"
              width={185}
            />
            <ul>
              <li>{company.tagline}</li>
              <li>General contractor licence {company.license}</li>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3>Showrooms</h3>
            <ul>
              {locations.map((location) => (
                <li key={location.id}>
                  {location.city} &middot;{" "}
                  <a href={location.phoneHref}>{location.phone}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>What we do</h3>
            <ul>
              {services.slice(0, 6).map((service) => (
                <li key={service.name}>{service.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="kb-footer__bar">
          <p>
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>Serving {servingCounties}.</p>
        </div>
      </div>
    </footer>
  );
}
