"""
Acosta Pro — single source of truth for business facts (NAP), brand and site config.

EDIT THIS FILE, NOT THE HTML. Everything below is injected into every page,
the JSON-LD structured data, the sitemap and llms.txt. Keeping one copy of the
name / address / phone ("NAP") is what search engines and AI answer engines use
to confirm you are one consistent business entity.

Values marked  # VERIFY  are best-guess placeholders — see CONTENT-TO-VERIFY.md
"""

# --------------------------------------------------------------------------
# 1. Business identity  (NAP — must match Google Business Profile EXACTLY)
# --------------------------------------------------------------------------
BUSINESS = {
    "legal_name": "Acosta Pro Aluminum Screen LLC",
    "name": "Acosta Pro Aluminum Screen",
    "short_name": "Acosta Pro",
    "tagline": "Aluminum & Screen Specialists",
    "founded": "2019",                                   # VERIFY
    "phone_primary": "941-565-5576",
    "phone_secondary": "941-879-4211",
    "email": "",                                          # VERIFY - leave "" to hide
    # Service-area business: no walk-in address is published. If you have a
    # storefront, fill street/postal in and set has_storefront = True.
    "has_storefront": False,
    "street": "",                                         # VERIFY
    "city": "Sarasota",                                   # VERIFY
    "region": "FL",
    "region_name": "Florida",
    "postal": "34232",                                    # VERIFY
    "country": "US",
    "latitude": "27.3364",                                # VERIFY (approx. Sarasota)
    "longitude": "-82.5307",                              # VERIFY
    "price_range": "$$",
    "languages": ["English", "Spanish"],
    "license": "",                                        # VERIFY - e.g. "SCC131152xxx"
    "hours": [
        ("Monday",    "07:00", "18:00"),
        ("Tuesday",   "07:00", "18:00"),
        ("Wednesday", "07:00", "18:00"),
        ("Thursday",  "07:00", "18:00"),
        ("Friday",    "07:00", "18:00"),
        ("Saturday",  "08:00", "16:00"),
    ],
    "hours_human": "Mon–Fri 7am–6pm · Sat 8am–4pm · Sun by appointment",  # VERIFY
    "payment": ["Cash", "Check", "Credit Card", "Zelle"],                 # VERIFY
    "service_radius_mi": 45,
}

# Public profiles. Adding the real URLs is one of the highest-value SEO/GEO
# edits you can make: it is how engines link this site to your review corpus.
SAME_AS = [
    # "https://www.google.com/maps/place/...",            # VERIFY - your GBP link
    # "https://www.facebook.com/...",                     # VERIFY
    # "https://www.instagram.com/...",                    # VERIFY
]

# --------------------------------------------------------------------------
# 2. Site
# --------------------------------------------------------------------------
SITE_URL = "https://www.acostaproaluminumscreen.com"      # VERIFY - no trailing slash
SITE_LOCALE = "en_US"
BUILD_DATE = "2026-08-31"

# Where the quote form posts. Options:
#   Netlify  -> leave as "" and keep data-netlify (already wired)
#   Formspree-> "https://formspree.io/f/xxxxxxxx"
#   Web3Forms-> "https://api.web3forms.com/submit"
FORM_ENDPOINT = ""

# Analytics: paste a GA4 / GTM id to switch tracking on. Empty = no scripts.
GA4_ID = ""
GTM_ID = ""

# --------------------------------------------------------------------------
# 3. Brand tokens — change these and the whole site follows.
#    Swap for the exact colors sampled from the Acosta Pro logo.
# --------------------------------------------------------------------------
BRAND = {
    # Sampled from the Acosta Pro logo. There is no orange in this identity —
    # the accent is the cyan-blue apex of the roofline mark.
    "navy_900": "#04121F",   # the logo's own background
    "navy_800": "#072742",
    "navy_700": "#0B3A63",   # primary surface (white text 11.6:1)
    "navy_600": "#0F4E86",
    "blue_700": "#0B57A4",
    "blue_600": "#1273CE",   # links on white (4.8:1)
    "blue_500": "#3FA9F5",   # CTA fill (navy_900 text 7.4:1)
    "blue_400": "#7FD9FF",   # logo apex — CTA hover, accents on dark
    "blue_100": "#E4F2FD",
    "amber_400": "#FBBF24",  # review stars
    "slate_900": "#0F172A",
    "slate_700": "#334155",
    "slate_500": "#5B6B7F",
    "slate_200": "#E2E8F0",
    "slate_100": "#F1F5F9",
    "slate_50":  "#F8FAFC",
    "white":     "#FFFFFF",
    "green_700": "#15803D",
}
