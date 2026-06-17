'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Float, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'

/* ── Genera geometría de pulsera Paracord con tejido realista ── */
function createBraceletGeometry(radius = 1.2, tubeRadius = 0.22, segments = 96, radialSegments = 24) {
  const curve = new THREE.CatmullRomCurve3(
    Array.from({ length: 36 }, (_, i) => {
      const theta = (i / 36) * Math.PI * 2
      const wobble = Math.sin(i * 1.5) * 0.04
      return new THREE.Vector3(
        (radius + wobble) * Math.cos(theta),
        (radius + wobble) * Math.sin(theta) * 0.75,
        Math.cos(i * 3) * 0.06
      )
    }),
    true
  )
  return new THREE.TubeGeometry(curve, segments, tubeRadius, radialSegments, true)
}

/* ── Tejido cobra decorativo (anillos en espiral) ── */
function WeaveRings() {
  const count = 28
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  const rings = useMemo(() => {
    const items = []
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2
      const angleOffset = i * 0.6
      const x = 1.25 * Math.cos(theta)
      const y = 1.25 * Math.sin(theta) * 0.75
      const z = Math.sin(i * 2.5) * 0.08
      const tilt = Math.PI / 2 + angleOffset * 0.3
      items.push({ position: [x, y, z] as [number, number, number], rotation: tilt, index: i })
    }
    return items
  }, [])

  return (
    <group ref={groupRef}>
      {rings.map((r, i) => (
        <mesh key={i} position={r.position} rotation={[r.rotation, 0, r.index * 0.4]}>
          <torusGeometry args={[0.08, 0.025, 6, 8]} />
          <meshStandardMaterial
            color="#404060"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Pulsera principal ── */
function Bracelet({ color = '#2a6e3f' }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const geo = useMemo(() => createBraceletGeometry(), [])

  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.12) * 0.03
  })

  return (
    <group>
      {/* Cuerpo principal de la pulsera */}
      <mesh ref={meshRef} geometry={geo}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.4}
          metalness={0.05}
          clearcoat={0.1}
          clearcoatRoughness={0.4}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Hebilla / cierre */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.25, 0.12, 0.2]} />
        <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, -1.15, 0]}>
        <boxGeometry args={[0.25, 0.12, 0.2]} />
        <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Anillos decorativos del tejido */}
      <WeaveRings />
    </group>
  )
}

/* ── Escena del producto ── */
function ProductScene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-3, 2, -4]} intensity={0.4} color="#4488ff" />
      <pointLight position={[0, 3, 3]} intensity={0.6} color="#ff88ff" />
      <pointLight position={[0, -3, -3]} intensity={0.3} color="#44ff88" />

      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.15}>
        <Bracelet color={color} />
      </Float>

      <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={4} blur={2.5} far={2} />
      <Environment preset="studio" />
    </>
  )
}

/* ── Colores disponibles ── */
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

/* ── Componente exportado ── */
export default function ProductViewer() {
  const [color, setColor] = useState('#2a6e3f')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="product-viewer">
      <div className="viewer-canvas">
        <Canvas
          camera={{ position: [0, 0.3, 3.5], fov: 30 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <ProductScene color={color} />
          <OrbitControls
            enablePan={false}
            minDistance={1.8}
            maxDistance={5}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 1.8}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      </div>

      {/* Selector de colores */}
      <div className="color-selector">
        <p className="color-label">Color: <strong>{COLORS.find(c => c.value === color)?.name}</strong></p>
        <div className="color-swatches">
          {COLORS.map((c) => (
            <button
              key={c.value}
              className={`swatch ${c.value === color ? 'active' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <p className="viewer-hint">🖱 Arrastra para girar · Desplaza para acercar</p>
    </div>
  )
}
