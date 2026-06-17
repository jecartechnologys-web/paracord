'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false })

const products = [
  {
    name: 'Pulsera Clásica',
    desc: 'Nudo cobra, 7 colores disponibles. Ajustable.',
    price: '$149 MXN',
    color: '#00ff88',
  },
  {
    name: 'Pulsera Táctica',
    desc: 'Cierre metálico, cuerda 550. Ideal para exteriores.',
    price: '$199 MXN',
    color: '#ff8800',
  },
  {
    name: 'Pulsera Dual',
    desc: 'Dos tonos trenzados. Diseño único en cada pieza.',
    price: '$249 MXN',
    color: '#ff00ff',
  },
  {
    name: 'Pack Amigo',
    desc: '3 pulseras clásicas con descuento. Ideal para regalar.',
    price: '$349 MXN',
    color: '#00ccff',
  },
]

function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <div style={{ display: loaded ? '' : 'none' }}>
        <Scene3D />

        <nav>
          <span className="logo">✦ PARACORD</span>
          <div>
            <a href="#productos">Productos</a>
            <a href="#contacto">Contacto</a>
          </div>
        </nav>

        <div className="overlay">
          <section className="hero">
            <h1>PARACORD</h1>
            <p>
              Pulseras artesanales hechas con cuerda militar 550.
              Resistentes, personalizables, únicas.
            </p>
            <a href="#productos" className="cta-btn">Ver Colección</a>
          </section>

          <section className="products-section" id="productos">
            <h2>✦ Nuestras Pulseras ✦</h2>
            <div className="products-grid">
              {products.map((p) => (
                <div key={p.name} className="product-card">
                  <div className="name">{p.name}</div>
                  <div className="desc">{p.desc}</div>
                  <div className="price">{p.price}</div>
                  <button className="buy-btn">Comprar</button>
                </div>
              ))}
            </div>
          </section>

          <footer id="contacto">
            <p>✦ PARACORD — Hecho a mano en México ✦</p>
            <p style={{ marginTop: '0.5rem' }}>Contacto: hola@paracord.mx</p>
          </footer>
        </div>
      </div>
    </>
  )
}

export default HomePage
