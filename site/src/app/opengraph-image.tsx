import { ImageResponse } from 'next/og';

export const alt = 'Caitlin Hoffman — Lakewood Ranch, Sarasota & Bradenton Real Estate';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Generated at build time so the card never depends on a remote asset. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0A2F2F 0%, #115352 45%, #22827F 100%)',
          color: '#FBF8F3',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              border: '3px solid #6FBDB9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#6FBDB9',
            }}
          >
            CH
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Caitlin Hoffman</span>
            <span style={{ fontSize: 15, letterSpacing: 3, color: '#A2D5D3', textTransform: 'uppercase' }}>
              Lakewood Ranch Real Estate
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.06, letterSpacing: -2, maxWidth: 900 }}>
            The Gulf Coast, completely explained.
          </span>
          <span style={{ marginTop: 22, fontSize: 25, color: '#CFE9E8', maxWidth: 880, lineHeight: 1.4 }}>
            Every village with real HOA &amp; CDD costs · school ratings · happy hours by day · drive times to
            every beach · live MLS search
          </span>
        </div>

        <div style={{ display: 'flex', gap: 44, fontSize: 19, color: '#A2D5D3' }}>
          <span>Lakewood Ranch</span>
          <span>Sarasota</span>
          <span>Bradenton</span>
          <span>Tampa Bay</span>
        </div>
        {/* No emoji or symbol glyphs here on purpose: next/og fetches a dynamic
            font for anything outside the bundled Latin set, which fails on a
            build machine without outbound network access. */}
      </div>
    ),
    size
  );
}
