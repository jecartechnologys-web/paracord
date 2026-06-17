'use client'

import { useRef, useMemo, useEffect, useState, createContext, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Center } from '@react-three/drei'
import * as THREE from 'three'

/* =============================================
   PARACORD COBRA WEAVE — Geometría realista
   ============================================= */

// Genera la trayectoria de la pulsera (círculo aplanado como muñeca)
function braceletPath(radius = 1.1, flatten = 0.7, wobble = 0.02) {
  const pts: THREE.Vector3[] = []
  const segments = 64
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const x = radius * Math.cos(theta)
    const y = radius * Math.sin(theta) * flatten
    const z = Math.sin(theta * 4) * wobble
    pts.push(new THREE.Vector3(x, y, z))
  }
  return new THREE.CatmullRomCurve3(pts, true)
}

// Crea textura de tejido cobra procedural en canvas
function generateCobraTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  // Fondo base — color cuerda
  ctx.fillStyle = '#4a4a4a'
  ctx.fillRect(0, 0, 512, 128)

  // Textura de hilo (líneas finas horizontales)
  for (let y = 0; y < 128; y += 3) {
    ctx.strokeStyle = `rgba(80,80,80,${0.1 + Math.random() * 0.15})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
  }

  // Patrón de tejido cobra — V's entrelazados
  const colors = [
    '#3a3a3a', '#505050', '#454545', '#4d4d4d',
    '#3d3d3d', '#525252', '#484848', '#404040',
  ]

  for (let row = 0; row < 8; row++) {
    const yBase = row * 16
    for (let col = 0; col < 64; col++) {
      const x = col * 8
      const c = colors[(row + col) % colors.length]

      // V shape del nudo cobra
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.moveTo(x, yBase + 14)
      ctx.lineTo(x + 4, yBase + 2)
      ctx.lineTo(x + 8, yBase + 14)
      ctx.closePath()
      ctx.fill()

      // Sombra del nudo
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.beginPath()
      ctx.moveTo(x + 1, yBase + 14)
      ctx.lineTo(x + 4, yBase + 4)
      ctx.lineTo(x + 7, yBase + 14)
      ctx.closePath()
      ctx.fill()

      // Línea de cuerda (efecto de torsión)
      ctx.strokeStyle = 'rgba(60,60,60,0.4)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x + 2, yBase + 10)
      ctx.lineTo(x + 6, yBase + 6)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x + 2, yBase + 6)
      ctx.lineTo(x + 6, yBase + 10)
      ctx.stroke()
    }
  }

  // Rugosidad aleatoria
  const imageData = ctx.getImageData(0, 0, 512, 128)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12
    imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise))
    imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise))
    imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise))
  }
  ctx.putImageData(imageData, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 1)
  tex.anisotropy = 4
  return tex
}

// Crea textura de color para la cuerda
function generateColorTexture(hex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')!

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Base color
  ctx.fillStyle = hex
  ctx.fillRect(0, 0, 256, 64)

  // Variación de tono (efecto de tejido)
  for (let y = 0; y < 64; y += 4) {
    const variation = (Math.sin(y * 0.3) * 0.08) + (Math.random() - 0.5) * 0.06
    const r2 = Math.min(255, Math.max(0, Math.round(r * (1 + variation))))
    const g2 = Math.min(255, Math.max(0, Math.round(g * (1 + variation))))
    const b2 = Math.min(255, Math.max(0, Math.round(b * (1 + variation))))
    ctx.fillStyle = `rgb(${r2},${g2},${b2})`
    ctx.fillRect(0, y, 256, 3)
  }

  // Líneas de hilo
  for (let y = 0; y < 64; y += 3) {
    ctx.strokeStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.1})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(256, y)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 1)
  tex.anisotropy = 4
  return tex
}

/* ── Pulsera principal ── */
function ParacordBracelet({ color = '#2a6e3f' }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const buckleRef = useRef<THREE.Group>(null!)

  // Geometría con cross-section ovalada (plana como pulsera real)
  const geometry = useMemo(() => {
    const path = braceletPath(1.15, 0.7, 0.015)

    // Cross-section: óvalo aplanado
    const shape = new THREE.Shape()
    const w = 0.22  // ancho (más ancho)
    const h = 0.1   // alto (más plano)
    const segments = 12
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2
      const x = Math.cos(t) * w
      const y = Math.sin(t) * h * 0.6
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }

    const geo = new THREE.TubeGeometry(
      path,
      64,              // segmentos a lo largo
      0.18,            // radio base
      12,              // segmentos alrededor
      true            // cerrado
    )

    return geo
  }, [])

  // Texturas procedurales
  const cobraTex = useMemo(() => generateCobraTexture(), [])
  const colorTex = useMemo(() => generateColorTexture(color), [color])

  // Animación
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.04
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.08) * 0.03
    }
    if (buckleRef.current) {
      buckleRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.04
      buckleRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.08) * 0.03
    }
  })

  return (
    <group>
      {/* Cuerpo principal de la pulsera */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          map={colorTex}
          roughnessMap={cobraTex}
          roughness={0.55}
          metalness={0.02}
          clearcoat={0.15}
          clearcoatRoughness={0.3}
          envMapIntensity={0.25}
        />
      </mesh>

      {/* Hebilla metálica */}
      <group ref={buckleRef}>
        {/* Barra superior de la hebilla */}
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[0.32, 0.08, 0.15]} />
          <meshPhysicalMaterial color="#555" roughness={0.25} metalness={0.85} envMapIntensity={0.5} />
        </mesh>

        {/* Barra inferior */}
        <mesh position={[0, -0.92, 0]}>
          <boxGeometry args={[0.32, 0.08, 0.15]} />
          <meshPhysicalMaterial color="#555" roughness={0.25} metalness={0.85} envMapIntensity={0.5} />
        </mesh>

        {/* Poste central (donde se engancha) */}
        <mesh position={[0, 0.86, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.14, 8]} />
          <meshPhysicalMaterial color="#444" roughness={0.3} metalness={0.9} envMapIntensity={0.4} />
        </mesh>
      </group>
    </group>
  )
}

/* ── Escena del showroom ── */
function ShowroomScene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={1.5} />
      <directionalLight position={[-4, 3, -5]} intensity={0.4} color="#4488ff" />
      <directionalLight position={[2, -1, 5]} intensity={0.3} color="#ff88ff" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 0, -4]} intensity={0.2} color="#44ff88" />

      <Center>
        <ParacordBracelet color={color} />
      </Center>

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.5}
        scale={5}
        blur={3}
        far={2}
        resolution={512}
      />
      <Environment preset="studio" />
    </>
  )
}

/* ── Colores ── */
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

/* ── SHOWROOM ── */
export default function Showroom() {
  const [color, setColor] = useState('#2a6e3f')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="showroom">
      <div className="showroom-viewport">
        <Canvas
          camera={{ position: [0, 0.1, 3.8], fov: 28 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
        >
          <ShowroomScene color={color} />
          <OrbitControls
            enablePan={false}
            minDistance={1.5}
            maxDistance={6}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 1.8}
            enableDamping
            dampingFactor={0.1}
            rotateSpeed={0.8}
          />
        </Canvas>
      </div>

      <div className="showroom-controls">
        <div className="showroom-colors">
          {COLORS.map((c) => (
            <button
              key={c.value}
              className={`showroom-swatch ${c.value === color ? 'active' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              title={c.name}
            />
          ))}
        </div>
        <p className="showroom-hint">Arrastra para girar · Desplaza para acercar</p>
      </div>
    </div>
  )
}
