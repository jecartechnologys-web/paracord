'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'

const Showroom = dynamic(() => import('@/components/ProductViewer'), { ssr: false })

const COLORS = [
  { name: 'Verde Militar', value: '#2a6e3f' },
  { name: 'Negro Táctico', value: '#1a1a1a' },
  { name: 'Azul Marino', value: '#1e3a5f' },
  { name: 'Rojo Rubí', value: '#8b1a1a' },
  { name: 'Naranja Caza', value: '#cc5500' },
  { name: 'Morado Real', value: '#5a2d7a' },
  { name: 'Arena', value: '#c4a882' },
  { name: 'Cian Neón', value: '#00bbcc' },
]

const WEAVES = [
  { name: 'Cobra', desc: 'Nudo clásico entrelazado', era: 'Tradicional' },
  { name: 'King Cobra', desc: 'Doble capa de grosor', era: 'Reforzado' },
  { name: 'Dragon Scale', desc: 'Escamado decorativo', era: 'Premium' },
  { name: 'Trident', desc: 'Tres cabos simétricos', era: 'Audaz' },
  { name: 'Solomon Bar', desc: 'Tejido plano minimalista', era: 'Moderno' },
  { name: 'Fishtail', desc: 'Trenzado fino elegante', era: 'Clásico' },
]

function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeWeave, setActiveWeave] = useState('Cobra')
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const scrollToViewer = useCallback(() => {
    viewerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  if (!mounted) return null

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <div className={`showroom-page ${loaded ? 'visible' : ''}`}>
        {/* NAV */}
        <nav className="sr-nav">
          <span className="sr-logo">⟐ PARACORD</span>
          <div className="sr-nav-links">
            <button className="sr-nav-cta" onClick={scrollToViewer}>Explorar</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="sr-hero">
          <div className="sr-hero-bg" />
          <div className="sr-hero-content">
            <div className="sr-hero-tag">Edición Limitada</div>
            <h1 className="sr-title">
              Tejido<br />
              <span className="sr-title-accent">Cobra</span>
            </h1>
            <p className="sr-subtitle">
              Paracord 550 · Hecho a mano en México · Cada pieza es única
            </p>
            <div className="sr-hero-actions">
              <button className="sr-btn-primary" onClick={scrollToViewer}>
                Ver en 3D
              </button>
            </div>
          </div>
          <div className="sr-hero-decor">
            <div className="sr-hero-glow" />
          </div>
        </section>

        {/* SHOWROOM 3D */}
        <section className="sr-viewer-section" id="viewer" ref={viewerRef}>
          <div className="sr-viewer-container">
            <div className="sr-viewer-header">
              <h2 className="sr-section-title">Showroom</h2>
              <p className="sr-section-desc">Arrastra para rotar · Pellizca para zoom</p>
            </div>
            <div className="sr-viewer-glass">
              <Showroom />
            </div>
          </div>
        </section>

        {/* TEJIDOS */}
        <section className="sr-weaves-section">
          <div className="sr-weaves-inner">
            <div className="sr-section-label">Catálogo</div>
            <h2 className="sr-section-title">Tejidos</h2>
            <p className="sr-section-desc">Técnicas artesanales que definen cada pieza</p>
            <div className="sr-weave-strip">
              {WEAVES.map((w) => (
                <button
                  key={w.name}
                  className={`sr-weave-tab ${activeWeave === w.name ? 'active' : ''}`}
                  onClick={() => setActiveWeave(w.name === activeWeave ? '' : w.name)}
                >
                  <div className="sr-weave-icon">
                    <div className={`sr-weave-ring style-${w.name.toLowerCase().replace(/\s+/g, '-')}`} />
                  </div>
                  <div className="sr-weave-info">
                    <span className="sr-weave-name">{w.name}</span>
                    <span className="sr-weave-era">{w.era}</span>
                  </div>
                  {activeWeave === w.name && (
                    <p className="sr-weave-desc-reveal">{w.desc}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* COLORES */}
        <section className="sr-colors-section">
          <div className="sr-colors-inner">
            <div className="sr-section-label">Paleta</div>
            <h2 className="sr-section-title">Colores</h2>
            <p className="sr-section-desc">Disponibles en todos los tejidos</p>
            <div className="sr-color-grid">
              {COLORS.map((c) => (
                <div key={c.value} className="sr-color-item">
                  <div className="sr-color-swatch" style={{ backgroundColor: c.value }} />
                  <span className="sr-color-label">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sr-footer">
          <div className="sr-footer-inner">
            <div className="sr-footer-brand">
              <span className="sr-logo">⟐ PARACORD</span>
              <p className="sr-footer-tagline">Paracord 550 · Hecho a mano en México</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default HomePage
