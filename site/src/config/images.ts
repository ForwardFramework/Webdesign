/**
 * Image manifest.
 *
 * `remote` is the generated asset as first published by the image service.
 * `local` is where `npm run fetch:images` places a downloaded copy.
 *
 * DEFAULT BEHAVIOUR: the site renders `remote`, because that is what exists the
 * moment you clone this. That is fine for a preview and NOT fine for launch —
 * a third-party CDN URL is outside your control and nothing guarantees its
 * lifetime. Before you go live:
 *
 *     npm run fetch:images                    # downloads into public/images/generated
 *     echo 'NEXT_PUBLIC_USE_LOCAL_IMAGES=true' >> .env.local
 *
 * After that the site serves its own assets and the CDN URLs become a backup.
 */

export interface ImageAsset {
  key: string;
  alt: string;
  local: string;
  remote: string;
  aspect: string;
}

export const IMAGES = {
  hero: {
    key: 'hero',
    alt: 'Aerial view at golden hour over a Lakewood Ranch-style lakefront community, palms and preserve, with the Gulf on the horizon',
    local: '/images/generated/hero-aerial.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_ce600576-d447-4750-8651-85656363ab2a.png',
    aspect: '16:9',
  },
  beach: {
    key: 'beach',
    alt: 'Sugar-white Gulf Coast beach at sunset with turquoise water and a pink and violet sky',
    local: '/images/generated/beach-sunset.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_172c62e2-6c37-4c33-8c95-fa85c8dd0799.png',
    aspect: '16:9',
  },
  home: {
    key: 'home',
    alt: 'Coastal-modern Florida home exterior with pale stucco, tile roof and mature palms in afternoon light',
    local: '/images/generated/home-exterior.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_f573be06-acec-4b08-9a84-77f2872a4521.png',
    aspect: '3:2',
  },
  townCenter: {
    key: 'townCenter',
    alt: 'Lakefront town centre promenade at dusk with string lights over restaurant patios',
    local: '/images/generated/town-center.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_bf75a72f-92cf-4c68-9ab9-c8300bba2540.png',
    aspect: '16:9',
  },
  preserve: {
    key: 'preserve',
    alt: 'Boardwalk through a Florida wetland preserve at sunrise with a great blue heron',
    local: '/images/generated/preserve-boardwalk.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_c1f254e3-3523-43dd-945c-bbe4ac8b07ba.png',
    aspect: '3:2',
  },
  golf: {
    key: 'golf',
    alt: 'Championship golf fairway at golden hour with a lake, fountain and stands of palms',
    local: '/images/generated/golf.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_1248e14b-a54d-4e6e-88ba-a4b3b89ea052.png',
    aspect: '3:2',
  },
  happyHour: {
    key: 'happyHour',
    alt: 'Citrus cocktails and rosé on a teak table on a sunlit coastal restaurant patio',
    local: '/images/generated/happy-hour.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_309e357d-4bf4-416c-8351-a6cd53bd4d82.png',
    aspect: '3:2',
  },
  kayak: {
    key: 'kayak',
    alt: 'Two kayakers crossing a mirror-flat Florida lake at sunrise with mist on the water',
    local: '/images/generated/kayak-sunrise.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_3ebf2888-6e37-46ad-b25d-05a7ea7e7119.png',
    aspect: '3:2',
  },
  construction: {
    key: 'construction',
    alt: 'A new Florida home under construction at golden hour, framing and roof trusses against a warm sky',
    local: '/images/generated/new-construction.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_117504a7-0b82-4eb8-8263-9cf095d874d5.png',
    aspect: '3:2',
  },
  trail: {
    key: 'trail',
    alt: 'A wide neighbourhood trail curving between palms and a lake on a bright morning',
    local: '/images/generated/trail.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_9eef25f9-50f4-4f74-b83c-bbb710dffe59.png',
    aspect: '3:2',
  },
  gradient: {
    key: 'gradient',
    alt: 'Abstract coastal gradient in deep teal, turquoise and sand with soft wave shapes',
    local: '/images/generated/coastal-gradient.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_50599735-659a-42f3-baa1-4874bf71090f.png',
    aspect: '16:9',
  },
  island: {
    key: 'island',
    alt: 'Old Florida fishing pier over pale turquoise Gulf water with pastel beach cottages along the shore',
    local: '/images/generated/anna-maria.png',
    remote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3IL9tsARcNNDKmHrDHi3CGZRiYg/hf_20260916_014337_2ad36730-376b-4a8e-b157-85eca833a804.png',
    aspect: '3:2',
  },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGES;

/**
 * Resolve an image source.
 * Local copies are used only once they have been fetched AND the flag is set,
 * so a fresh clone never renders a broken image.
 */
export const imgSrc = (key: ImageKey): string => {
  const a: ImageAsset = IMAGES[key];
  if (process.env.NEXT_PUBLIC_USE_LOCAL_IMAGES === 'true') return a.local;
  return a.remote || a.local;
};

export const imgAlt = (key: ImageKey): string => IMAGES[key].alt;

/** True while the site is still leaning on the generated-asset CDN. */
export const usingRemoteImages = () => process.env.NEXT_PUBLIC_USE_LOCAL_IMAGES !== 'true';
