"""Single source of truth for Osas Construction Group's business facts.

Everything a non-developer might need to change lives here. Edit, then run
`python3 site/build.py` from the repo root to regenerate every page.
"""

# --------------------------------------------------------------------------
# Name, address, phone (NAP). Keep these byte-identical everywhere they appear
# online (Google Business Profile, Facebook, directories) — consistency is a
# direct local-SEO ranking factor.
# --------------------------------------------------------------------------
BIZ = {
    "name": "Osas Construction Group",
    "legal_name": "Osas Construction Group",
    "phone_display": "(412) 923-2092",
    "phone_href": "+14129232092",
    "sms_href": "+14129232092",
    "email": "osasconstructiongroup@gmail.com",
    # No public street address supplied. Leaving "street" empty keeps it out of
    # the schema markup and the footer; fill it in if you want a storefront
    # address indexed (required if you want to rank in the Google Map Pack with
    # a verified address rather than a service-area profile).
    "street": "",
    "city": "Pittsburgh",
    "region": "PA",
    "region_name": "Pennsylvania",
    "postal": "",
    "country": "US",
    "lat": "40.4406",
    "lng": "-79.9959",
    "hic": "PA200902",
    "gc_license": "GC-2025-006171",
    "founded": "",  # e.g. "2019" — adds "foundingDate" to the schema when set.
    "hours": [
        # day ranges -> 24h times. Adjust to real hours before launch.
        (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "07:00", "18:00"),
        (["Saturday"], "08:00", "16:00"),
    ],
    "hours_note": "Emergency and storm calls answered outside these hours.",
    # Leave a URL empty and the link simply is not rendered.
    "facebook": "",
    "instagram": "",
    "google_profile": "",
    "site_url": "https://osasconstructiongroup.com",
    "logo_path": "/assets/img/logo-arched.svg",
    "og_image": "/assets/img/og-default.png",
}

TAGLINE = "Design • Build • Renovate • Transform"
PROMISE = "No hidden fees. Transparent pricing."

# Short trust statements pulled straight from the company's printed material.
TRUST_POINTS = [
    ("shield", "Fully insured", "Liability coverage on every job, residential or commercial."),
    ("award", "Licensed contractor", f"PA HIC #{BIZ['hic']} \u00b7 License {BIZ['gc_license']}"),
    ("users", "Experienced crews", "One team for the whole scope — no chasing subcontractors."),
    ("home", "Residential & commercial", "Single rooms to whole-property contracts."),
]

STATS = [
    ("16", "Service lines under one contractor"),
    ("PA200902", "Pennsylvania HIC registration"),
    ("365", "Days a year — snow in winter, landscaping in summer"),
    ("$0", "Cost to get an estimate"),
]

PROCESS = [
    ("Call or text", "Reach us at (412) 923-2092 or send the estimate form. Tell us the address, the scope and your timeline."),
    ("On-site walkthrough", "We look at the actual conditions — structure, access, drainage, existing finishes — instead of guessing from photos."),
    ("Written, itemized quote", "Line-item pricing for labor, materials and disposal. What you approve is what you pay."),
    ("Build and clean up", "Scheduled crews, permits pulled where required, daily cleanup and a final walkthrough before we invoice."),
]

# --------------------------------------------------------------------------
# Icons — Lucide (ISC licensed) path data, rendered inline so there is no icon
# font, no sprite request, and no emoji-as-icon.
# --------------------------------------------------------------------------
ICONS = {
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "message": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    "award": '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "home": '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    "hammer": '<path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
    "roller": '<rect width="16" height="6" x="2" y="2" rx="2"/><path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V5"/><rect width="4" height="6" x="8" y="16" rx="1"/>',
    "layers": '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    "window": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/><path d="M3 12h18"/>',
    "roof": '<path d="M2 13 12 4l10 9"/><path d="M4 13v7h16v-7"/><path d="M9 20v-5h6v5"/>',
    "siding": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M3 14h18"/>',
    "brick": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M12 3v6"/><path d="M8 15v6"/><path d="M16 15v6"/><path d="M16 9v6"/>',
    "fence": '<path d="M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z"/><path d="M6 8h4"/><path d="M6 14h4"/><path d="M12 3l-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z"/><path d="M14 8h4"/><path d="M14 14h4"/><path d="M20 3l-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z"/>',
    "trees": '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
    "paver": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v6"/><path d="M15 9v6"/><path d="M9 15v6"/>',
    "droplets": '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
    "snow": '<line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
    "trash": '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    "truck": '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    "building": '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    "bath": '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.68 3 4 3.68 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5H2"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="22"/><line x1="17" x2="17" y1="19" y2="22"/>',
    "kitchen": '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    "ruler": '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "file": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "arrow": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "menu": '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    "close": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    "instagram": '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    "wrench": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
}
