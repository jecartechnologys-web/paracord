'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'

const ProductViewer = dynamic(() => import('@/components/ProductViewer'), { ssr: false })

const products = [
  {
    name: 'Cobra Clásica',
    desc: 'Tejido cobra tradicional. Cuerda militar 550. Ajustable.',
    price: '$149 MXN',
    colors: 8,
    popular: true,
  },
  {
    name: 'Serpiente Rey',
    desc: 'Tejido king cobra. Doble capa, más ancho y robusto.',
    price: '$249 MXN',
    colors: 6,
    popular: false,
  },
  {
    name: 'Dragon Escamas',
    desc: 'Tejido dragon scale. Textura escamada premium.',
    price: '$299 MXN',
    colors: 4,
    popular: false,
  },
  {
    name: 'Trident',
    desc: 'Tres colores trenzados. Diseño exclusivo por pedido.',
    price: '$349 MXN',
    colors: 12,
    popular: false,
  },
  {
    name: 'Pack Táctico',
    desc: '3 pulseras: negra, militar y naranja. Cuerda 550.',
    price: '$399 MXN',
    colors: 1,
    popular: true,
  },
  {
    name: 'Edición Limitada',
    desc: 'Tejido personalizado + grabado en hebilla. Única.',
    price: '$499 MXN',
    colors: 16,
    popular: false,
  },
]

function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <div className={`app-container ${loaded ? 'visible' : ''}`}>
        {/* NAV */}
        <nav className="nav">
          <div className="nav-inner">
            <span className="logo">⟐ PARACORD</span>
            <div className="nav-links">
              <a href="#productos" className="nav-link">Productos</a>
              <a href="#visor" className="nav-link">Visor 3D</a>
              <a href="#contacto" className="nav-link">Contacto</a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero-alt" id="inicio">
          <span className="hero-badge">✦ Hecho a mano en México</span>
          <h1 className="hero-title">
            Paracord<br />
            <span className="hero-gradient">Artisan</span>
          </h1>
          <p className="hero-sub">
            Pulseras artesanales con cuerda militar 550.<br />
            Cada pieza es única. Explora cada ángulo.
          </p>
          <div className="hero-actions">
            <a href="#visor" className="btn-primary">Explorar en 3D</a>
            <a href="#productos" className="btn-secondary">Ver modelos</a>
          </div>
        </section>

        {/* VISOR 3D */}
        <section className="visor-section" id="visor">
          <div className="section-label">⟐ VISOR INTERACTIVO</div>
          <h2 className="section-title">Gira · Acerca · Inspecciona</h2>
          <p className="section-desc">
            Arrastra para ver la pulsera desde cualquier ángulo. Cambia de color
            para ver todas las variantes disponibles.
          </p>
          <ProductViewer />
        </section>

        {/* PRODUCTOS */}
        <section className="products-section" id="productos">
          <div className="section-label">⟐ CATÁLOGO</div>
          <h2 className="section-title">Nuestras pulseras</h2>
          <div className="products-grid">
            {products.map((p, i) => (
              <div
                key={p.name}
                className={`product-card ${p.popular ? 'popular' : ''}`}
              >
                {p.popular && <span className="badge">Más vendido</span>}
                <div className="product-visual">
                  <div className="product-ring" style={{ animationDelay: `${i * 0.1}s` }} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-desc">{p.desc}</p>
                  <span className="product-colors">{p.colors} colores</span>
                  <div className="product-bottom">
                    <span className="product-price">{p.price}</span>
                    <button className="btn-buy" onClick={() => setSelectedProduct(i)}>Comprar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer" id="contacto">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo">⟐ PARACORD</span>
              <p>Cuerda militar 550 · Hecho a mano · Envíos a todo México</p>
            </div>
            <div className="footer-links">
              <a href="#inicio">Inicio</a>
              <a href="#visor">Visor 3D</a>
              <a href="#productos">Catálogo</a>
            </div>
            <div className="footer-contact">
              <p>hola@paracord.mx</p>
              <p>IG: @paracord.mx</p>
            </div>
          </div>
          <div className="footer-bottom">
            ⟐ PARACORD — Artesanía en paracord desde México
          </div>
        </footer>
      </div>
    </>
  )
}

export default HomePage
