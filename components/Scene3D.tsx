'use client'

import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, TorusKnot, MeshDistortMaterial, Stars, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import type * as THREE from 'three'

/* ── Single bracelet ring ── */
function BraceletRing({ position, color, speed }: {
  position: [number, number, number]
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.y = t * 0.5
    ref.current.rotation.z = t * 0.2
  })

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={ref} position={position}>
        <torusKnotGeometry args={[0.7, 0.25, 64, 12]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.7}
          distort={0.1}
          speed={1}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  )
}

/* ── Floating particles ── */
function FloatingParticles() {
  const positions = useMemo(() => {
    const count = 120
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 18
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#00ff88" transparent opacity={0.5} />
    </points>
  )
}

/* ── Inner scene ── */
function InnerScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#ff00ff" />
      <pointLight position={[5, -5, -5]} intensity={0.4} color="#00ccff" />

      <BraceletRing position={[0, 0.5, 0]} color="#00ff88" speed={0.4} />
      <BraceletRing position={[3.2, -0.5, -1]} color="#ff00ff" speed={0.3} />
      <BraceletRing position={[-3.2, 0, -2]} color="#00ccff" speed={0.35} />
      <BraceletRing position={[0, -1.5, -3]} color="#ff8800" speed={0.25} />

      <FloatingParticles />
      <Stars radius={25} depth={40} count={300} factor={3} saturation={0.5} fade speed={0.5} />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  )
}

/* ── Fallback mientras carga ── */
function Fallback() {
  return <div className="canvas-container" style={{ background: '#030305' }} />
}

/* ── Exported Scene ── */
export default function Scene() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <Fallback />

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.setClearColor('#030305') }}
      >
        <Suspense fallback={null}>
          <InnerScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
