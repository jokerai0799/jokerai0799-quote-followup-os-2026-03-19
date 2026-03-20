import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'QuoteFollowUp — quote follow-up software for trades and service businesses'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0D1520 0%, #162033 52%, #1d4ed8 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '56px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '32px',
            padding: '44px',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '760px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '22px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#7dd3fc',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '999px',
                  background: '#38bdf8',
                  boxShadow: '0 0 22px rgba(56,189,248,0.65)',
                }}
              />
              QuoteFollowUp
            </div>
            <div style={{ fontSize: '66px', lineHeight: 1.02, fontWeight: 700 }}>
              Quote follow-up software for trades and service businesses
            </div>
            <div style={{ fontSize: '28px', lineHeight: 1.35, color: 'rgba(255,255,255,0.82)' }}>
              Track every quote, follow up on time, and turn more estimates into booked work with a simple system built for small service teams.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '18px' }}>
            {[
              'Track every quote in one place',
              'Know exactly who to chase today',
              'Turn more estimates into booked work',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.08)',
                  padding: '16px 22px',
                  fontSize: '21px',
                  color: 'rgba(255,255,255,0.92)',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
