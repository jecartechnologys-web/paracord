'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'

const Showroom = dynamic(() => import('@/components/ProductViewer'), { ssr: false })

const SHOWROOM_COLORS = [
  { name: 'Verde Militar', value: '#2a6e3f' },
  { name: 'Negro Táctico', value: '#1a1a1a' },
  { name: 'Azul Marino', value: '#1e3a5f' },
  { name: 'Rojo Rubí', value: '#8b1a1a' },
  { name: 'Naranja Caza', value: '#cc5500' },
  { name: 'Morado Real', value: '#5a2d7a' },
  { name: 'Arena', value: '#c4a882' },
  { name: 'Cian Neón', value: '#00bbcc' },
]

function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <div className={`showroom-page ${loaded ? 'visible' : ''}`}>
        {/* Nav minimal */}
        <nav className="sr-nav">
          <span className="sr-logo">⟐ PARACORD</span>
          <div className="sr-nav-links">
            <span className="sr-nav-label">Showroom</span>
          </div>
        </nav>

        {/* Hero — minimal, solo título */}
        <section className="sr-hero">
          <div className="sr-hero-content">
            <span className="sr-badge">⋆⋆⋆ Artesanía en Paracord ⋆⋆⋆</span>
            <h1 className="sr-title">
              Tejido<br />
              <span className="sr-gradient">Cobra</span>
            </h1>
            <p className="sr-desc">
              Cuerda militar 550 · Hecho a mano · Cada pieza es única
            </p>
          </div>
        </section>

        {/* Showroom 3D — el corazón */}
        <section className="sr-viewer-section" id="showroom">
          <div className="sr-viewer-wrap">
            <Showroom />
          </div>
        </section>

        {/* Galería de colores sutil */}
        <section className="sr-colors-section">
          <div className="sr-colors-inner">
            <h2 className="sr-section-title">Variantes</h2>
            <p className="sr-section-desc">
              Cada color disponible en todos los tejidos
            </p>
            <div className="sr-color-bar">
              {SHOWROOM_COLORS.map((c) => (
                <div
                  key={c.value}
                  className="sr-color-chip"
                  title={c.name}
                >
                  <div
                    className="sr-color-dot"
                    style={{ backgroundColor: c.value }}
                  />
                  <span className="sr-color-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tejidos disponibles */}
        <section className="sr-weaves-section">
          <div className="sr-weaves-inner">
            <h2 className="sr-section-title">Tejidos</h2>
            <p className="sr-section-desc">
              Técnicas artesanales tradicionales
            </p>
            <div className="sr-weave-grid">
              {[
                { name: 'Cobra', desc: 'El clásico. Nudo sencillo, limpio y resistente.' },
                { name: 'King Cobra', desc: 'Doble capa. Mayor grosor y durabilidad.' },
                { name: 'Dragon Scale', desc: 'Escamado decorativo. Textura única.' },
                { name: 'Trident', desc: 'Tres cabos. Diseño audaz y simétrico.' },
                { name: 'Solomon Bar', desc: 'Tejido plano. Ideal para diseños minimalistas.' },
                { name: 'Fishtail', desc: 'Espina de pescado. Trenzado fino y elegante.' },
              ].map((w) => (
                <div key={w.name} className="sr-weave-card">
                  <div className="sr-weave-visual">
                    <div className="sr-weave-ring" />
                  </div>
                  <h3 className="sr-weave-name">{w.name}</h3>
                  <p className="sr-weave-desc">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer mínimo */}
        <footer className="sr-footer">
          <div className="sr-footer-inner">
            <span className="sr-logo">⟐ PARACORD</span>
            <p>Paracord 550 · Hecho a mano en México</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default HomePage
