/**
 * Scene data for the KB Countertops scroll-scrub journey.
 *
 * Journey shape: single-shot. One continuous ~15s take of a single quartzite
 * island was generated, then cut into four consecutive slices of that SAME
 * take. Each slice's last frame is the next slice's first frame, so the
 * journey scrubs as one unbroken camera move while giving the page four
 * semantic chapters. Every poster is the exact first frame of the encoded clip
 * beside it, extracted after encoding.
 *
 * Keep this array a module constant. Changing its identity on every render
 * intentionally rebuilds the media controller.
 */
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

/** Brand tokens for the journey layer, sampled from the KB logo and stylesheet. */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#c49e33",
  background: "#0a0a0a",
  ink: "#f4f1ea",
  muted: "#d2b48c",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Five hundred slabs on the floor, imported direct by the family that owns the yard. You pick the piece of stone, not a sample chip of it.",
    clip: "/assets/world/scene-01.mp4",
    id: "selection",
    kicker: "Chapter one",
    label: "Selection",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    poster: "/assets/world/scene-01-poster.png",
    scroll: 1.7,
    tags: ["500+ slabs", "Imported direct", "Wholesale, open to public"],
    title: "The slab comes first",
  },
  {
    body: "Our template engineer lasers your room in your home. Every wall that is out of square gets recorded, so the stone arrives knowing the shape it has to fit.",
    clip: "/assets/world/scene-02.mp4",
    id: "template",
    kicker: "Chapter two",
    label: "Template",
    mobileClip: "/assets/world/scene-02-mobile.mp4",
    mobilePoster: "/assets/world/scene-02-mobile-poster.png",
    poster: "/assets/world/scene-02-poster.png",
    scroll: 1.7,
    tags: ["Laser measured", "In your home", "Digital record"],
    title: "Measured to the millimetre",
  },
  {
    body: "Cut on our own CNC machines, in our own shop, by people on our own payroll. The vein is laid out across the seams before a single blade touches the stone.",
    clip: "/assets/world/scene-03.mp4",
    id: "fabrication",
    kicker: "Chapter three",
    label: "Fabrication",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    mobilePoster: "/assets/world/scene-03-mobile-poster.png",
    poster: "/assets/world/scene-03-poster.png",
    scroll: 1.7,
    tags: ["CNC fabricated", "Vein matched", "No subcontractors"],
    title: "Cut by our own hands",
  },
  {
    body: "Set, levelled and seamed by the same company that sold you the slab. About seven days from production approval, and backed for ten years.",
    clip: "/assets/world/scene-04.mp4",
    id: "installation",
    kicker: "Chapter four",
    label: "Installation",
    mobileClip: "/assets/world/scene-04-mobile.mp4",
    mobilePoster: "/assets/world/scene-04-mobile-poster.png",
    poster: "/assets/world/scene-04-poster.png",
    scroll: 1.7,
    tags: ["10 year warranty", "50,000+ installed", "Licensed CGC1522255"],
    title: "Installed to outlast the kitchen",
  },
];
