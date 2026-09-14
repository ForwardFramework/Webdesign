/**
 * All KB Countertops content in one place. Every fact, address, phone number
 * and testimonial here was taken from the company's own live site, its Yelp
 * listings, or its Google/Angi profiles. Nothing is invented.
 */

export const company = {
  name: "KB Countertops",
  founded: 2007,
  founder: "Thomas Reni",
  license: "CGC1522255",
  email: "info@kbcountertops.com",
  mainPhone: "813-230-8381",
  mainPhoneHref: "tel:+18132308381",
  altPhone: "813-505-7340",
  altPhoneHref: "tel:+18135057340",
  tagline: "Wholesale, open to the public.",
  promise:
    "Imported direct, cut in our own shop, installed by our own crew. No middlemen, no subcontractors.",
} as const;

export const stats = [
  { figure: "50,000+", label: "Countertops installed" },
  { figure: "Since 2007", label: "Family owned in Tampa Bay" },
  { figure: "500+", label: "Slabs and colors in stock" },
  { figure: "4.7 / 5", label: "Average customer rating" },
  { figure: "3", label: "Tampa Bay showrooms" },
  { figure: "10 years", label: "Workmanship warranty" },
  { figure: "7 days", label: "Install after production approval" },
  { figure: "0", label: "Subcontractors on your job" },
] as const;

export const materials = [
  {
    id: "quartz",
    name: "Quartz",
    note: "Non-porous, scratch resistant, no sealing. The low-maintenance workhorse.",
    image: "/assets/kb/quartz-backsplash.webp",
  },
  {
    id: "granite",
    name: "Granite",
    note: "Natural stone, heat resistant, no two slabs alike. Sealed on install.",
    image: "/assets/kb/granite.webp",
  },
  {
    id: "quartzite",
    name: "Quartzite",
    note: "Marble's look with granite's hardness. Taj Mahal, Cristallo and more.",
    image: "/assets/kb/taj-mahal-quartzite.jpg",
  },
  {
    id: "marble",
    name: "Marble & Dolomite",
    note: "Calacatta, Carrara and dolomite for people who want the real thing.",
    image: "/assets/kb/calacatta-fireplace.jpg",
  },
  {
    id: "soapstone",
    name: "Soapstone",
    note: "Soft, dark, matte. Ages into a patina instead of wearing out.",
    image: "/assets/kb/soapstone.jpg",
  },
  {
    id: "semiprecious",
    name: "Semiprecious",
    note: "Backlit agate and quartz slabs for islands meant to be looked at.",
    image: "/assets/kb/semiprecious.webp",
  },
] as const;

export const services = [
  {
    name: "Kitchen countertops",
    body: "Custom granite, quartz, marble and quartzite, templated and installed by our own crew.",
  },
  {
    name: "Kitchen cabinets",
    body: "All-wood shaker, raised panel and flat modern. Modern and Artisan collections, plus storage solutions.",
  },
  {
    name: "Flooring",
    body: "Durable flooring specified alongside the counters and cabinets so the whole room lands together.",
  },
  {
    name: "Kitchen remodeling",
    body: "Whole-kitchen transformations: layout, cabinetry, counters, backsplash, lighting and floors.",
  },
  {
    name: "Bathroom remodeling",
    body: "Vanities, counters and tilework, including barrier-free and aging-in-place builds.",
  },
  {
    name: "Outdoor kitchens",
    body: "Aluminum framing, weatherproof cabinetry, stone counters, gas and electrical run in-house.",
  },
  {
    name: "Commercial",
    body: "Apartments, hotels, restaurants and community houses. Licensed, insured, built to schedule.",
  },
  {
    name: "Countertops-2-GO",
    body: "DIY pickup. We cut custom quartz for vanities, desks, shower benches and window sills.",
  },
] as const;

export const process = [
  {
    step: "01",
    name: "Slab selection",
    body: "Walk the slab yard or work from curated samples. Granite, marble, quartz and quartzite, with staff who will tell you which one actually suits how you cook.",
    image: "/assets/kb/step-1.jpg",
  },
  {
    step: "02",
    name: "Laser template",
    body: "Our template engineer lasers the room in your home. Every measurement is captured digitally, so the finished piece drops into the space without a fight.",
    image: "/assets/kb/step-3.jpg",
  },
  {
    step: "03",
    name: "Slab layout",
    body: "We lay the cut out on the slab itself and match the vein flow across every seam, so the pattern reads as one continuous piece of stone.",
    image: "/assets/kb/step-4.jpg",
  },
  {
    step: "04",
    name: "CNC fabrication",
    body: "Cut and finished on our own CNC machines. Edges, sink cutouts and mitres are machined to the template, not eyeballed on site.",
    image: "/assets/kb/fab.jpg",
  },
  {
    step: "05",
    name: "Installation",
    body: "Our installers set, level and seam the tops themselves. Current wait is about seven days from production approval.",
    image: "/assets/kb/install.jpg",
  },
] as const;

export const gallery = [
  { image: "/assets/kb/project-1.jpg", caption: "Kitchen island, Tampa Bay" },
  { image: "/assets/kb/cabinets-oak-shaker.jpg", caption: "Natural oak shaker cabinetry" },
  { image: "/assets/kb/outdoor-1.jpeg", caption: "Outdoor kitchen build" },
  { image: "/assets/kb/bathroom.jpg", caption: "Bathroom vanity top" },
  { image: "/assets/kb/outdoor-2.jpeg", caption: "Outdoor kitchen, aluminum framed" },
  { image: "/assets/kb/project-2.jpeg", caption: "Residential kitchen remodel" },
  { image: "/assets/kb/project-3.jpeg", caption: "Waterfall edge island" },
  { image: "/assets/kb/project-4.jpeg", caption: "Full kitchen transformation" },
] as const;

export const reviews = [
  {
    quote:
      "Hands down the best countertop experience I've had. From selection to install, KB Countertops made it easy, fast, and affordable.",
    source: "Customer review",
  },
  {
    quote:
      "Over-the-top happy with the customer service, professionalism, and excellent workmanship.",
    source: "Customer review",
  },
  {
    quote:
      "We recommend KB and their staff without reservation.",
    source: "Customer review",
  },
] as const;

export const reviewMeta = {
  rating: "4.7",
  note: "Averaged across KB Countertops' public Google, Yelp and Angi listings for the Tampa, Largo and New Port Richey locations.",
} as const;

export const locations = [
  {
    id: "tampa",
    city: "Tampa",
    address: "6911 East Adamo Drive",
    region: "Tampa, FL 33619",
    contact: "Cathy",
    phone: "813-230-8381",
    phoneHref: "tel:+18132308381",
    hours: ["Mon to Fri, 9:00am to 5:00pm", "Sat, 10:00am to 4:00pm", "Sun, closed"],
    note: "Main showroom and slab yard.",
    maps: "https://www.google.com/maps/search/?api=1&query=6911+E+Adamo+Dr+Tampa+FL+33619",
  },
  {
    id: "largo",
    city: "Largo",
    address: "12340 66th Street N, Suite 106",
    region: "Largo, FL 33773",
    contact: "Parth",
    phone: "727-421-8020",
    phoneHref: "tel:+17274218020",
    hours: ["Mon to Fri, 9:00am to 5:00pm", "Sat by appointment", "Sun, closed"],
    note: "Serving Pinellas county.",
    maps: "https://www.google.com/maps/search/?api=1&query=12340+66th+St+N+Largo+FL+33773",
  },
  {
    id: "npr",
    city: "New Port Richey",
    address: "7212 U.S. Highway 19",
    region: "New Port Richey, FL 34652",
    contact: "Parth",
    phone: "727-421-8020",
    phoneHref: "tel:+17274218020",
    hours: ["By appointment only"],
    note: "Pasco county showroom.",
    maps: "https://www.google.com/maps/search/?api=1&query=7212+US+Hwy+19+New+Port+Richey+FL+34652",
  },
] as const;

export const servingAreas = [
  "Tampa",
  "St. Petersburg",
  "Clearwater",
  "Largo",
  "Brandon",
  "Riverview",
  "Wesley Chapel",
  "Palm Harbor",
  "Dunedin",
  "New Port Richey",
  "Lakeland",
  "Lutz",
] as const;

export const servingCounties = "Hillsborough, Pinellas, Pasco, Hernando and Polk counties";
