/* Single source of truth for business facts and reusable copy.
   Editing anything here updates every page on the next `npm run build`. */

export const biz = {
  name: 'Kotouch Equipment Services',
  shortName: 'Kotouch',
  tagline: 'Mobile Machine Mechanic',
  slogan: 'We Keep Your Equipment Moving',
  owner: 'Stephen Kotouch',
  ownerRole: 'Owner / Lead Mechanic',
  phone: '724-531-7457',
  phoneHref: 'tel:+17245317457',
  email: 'stephenkotouch222@gmail.com',
  region: 'Western Pennsylvania',
  hours: 'Available 24/7',
  promise: 'Fast. Reliable. Professional.',
  // Update this once the site has a real domain — it drives canonical URLs,
  // Open Graph tags and sitemap.xml.
  origin: 'https://www.kotouchequipment.com'
};

export const services = [
  {
    slug: 'diagnostics-repair',
    icon: 'gauge',
    title: 'Diagnostics & Repair',
    short: 'Fault codes read and traced on site, so the real problem gets fixed the first time.',
    body: 'Warning lights, derates, no-starts and intermittent faults get chased down where the machine sits. Laptop diagnostics, wiring and sensor testing, and electrical troubleshooting — then the repair, in the same visit whenever the parts allow.',
    points: [
      'Fault-code scanning and live data readings',
      'Electrical, wiring harness and sensor faults',
      'No-start, no-crank and charging problems',
      'Intermittent faults other shops could not pin down'
    ]
  },
  {
    slug: 'hydraulics',
    icon: 'droplet',
    title: 'Hydraulics',
    short: 'Weak, slow or leaking hydraulics diagnosed and repaired in the field.',
    body: 'Pressure testing to find out whether it is the pump, the valve or the cylinder before anything comes apart. Cylinder reseals, hose replacement, pump and motor service, and leak repair — all handled on your jobsite.',
    points: [
      'Pressure and flow testing to isolate the fault',
      'Cylinder reseals, rod and packing replacement',
      'Hose, fitting and coupler replacement',
      'Pump, motor and control valve service'
    ]
  },
  {
    slug: 'engine-repair',
    icon: 'engine',
    title: 'Engine Repair',
    short: 'Diesel engine work — from cooling and fuel systems to turbos and injectors.',
    body: 'Overheating, low power, hard starting, excessive smoke and oil leaks all get tracked to the cause. Cooling systems, fuel systems, air intake, turbochargers, injectors and belts serviced on site, with heavier work coordinated so the machine is down for as little time as possible.',
    points: [
      'Overheating and cooling system repair',
      'Fuel system, injector and filtration service',
      'Turbocharger and air intake work',
      'Oil leaks, belts, hoses and accessory drives'
    ]
  },
  {
    slug: 'welding-fabrication',
    icon: 'flame',
    title: 'Welding & Fabrication',
    short: 'Cracked buckets, booms and frames repaired where the machine sits.',
    body: 'Mobile welding for structural repairs and custom fabrication. Cracked buckets and booms, worn cutting edges, broken frames and mounts, plus one-off brackets, guards and attachment adapters built to fit your machine.',
    points: [
      'Structural repair on buckets, booms and frames',
      'Cutting edges, wear plate and bucket teeth',
      'Custom brackets, guards and attachment mounts',
      'On-site repairs — no need to haul it to a shop'
    ]
  },
  {
    slug: 'preventative-maintenance',
    icon: 'shield',
    title: 'Preventative Maintenance',
    short: 'Scheduled service that catches wear before it turns into downtime.',
    body: 'Service intervals kept on schedule so small wear items never become a stopped jobsite. Fluids and filters, greasing, undercarriage and track inspection, and full multi-point checks — set up as a recurring program for single machines or a whole fleet.',
    points: [
      'Oil, fluid and filter service at interval',
      'Undercarriage, track and tire inspection',
      'Multi-point inspection with a written report',
      'Recurring PM programs for fleets'
    ]
  }
];

export const equipment = [
  'Excavators', 'Mini excavators', 'Skid steers', 'Compact track loaders',
  'Dozers', 'Wheel loaders', 'Backhoes', 'Telehandlers',
  'Forklifts', 'Compactors & rollers', 'Trenchers', 'Generators & light towers'
];

export const counties = [
  'Allegheny', 'Westmoreland', 'Butler', 'Beaver',
  'Washington', 'Armstrong', 'Fayette', 'Indiana',
  'Lawrence', 'Greene', 'Somerset', 'Clarion'
];

export const process = [
  { n: '01', title: 'Call or Text', body: `Reach ${biz.owner} directly at ${biz.phone} — day, night or weekend. Describe the machine and the symptom.` },
  { n: '02', title: 'Talk It Through', body: 'A few questions over the phone narrow the likely cause, so the right tools and common parts are already on the truck.' },
  { n: '03', title: 'On-Site Repair', body: 'The fully equipped service truck comes to your jobsite, shop or yard. Diagnosis and repair happen where the machine sits.' },
  { n: '04', title: 'Back To Work', body: 'You get a clear explanation of what failed and what was done, plus what to watch so it does not happen again.' }
];

export const differentiators = [
  { icon: 'truck', title: 'The Shop Comes To You', body: 'No loading, no lowboy, no tow bill. The service truck rolls to your jobsite, shop or yard with the tools and common parts already aboard.' },
  { icon: 'clock', title: 'Answered 24/7', body: 'Machines break at 5am and on Sundays. The phone gets answered around the clock, and emergency calls get moved to the front.' },
  { icon: 'wrench', title: 'One Mechanic, Start To Finish', body: `${biz.owner} does the diagnosis and the repair himself. Nothing gets lost handing the job between a service writer and a tech.` },
  { icon: 'bolt', title: 'Straight Answers', body: 'You hear what failed, what it takes to fix it and what it costs before the work starts. No surprise line items at the end.' }
];
