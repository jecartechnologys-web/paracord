'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, TorusKnot, MeshDistortMaterial, Environment, Stars } from '@react-three/drei'
import type * as THREE from 'three'

function BraceletRing({ position, color, speed, index }: {
  position: [number, number, number]
  color: string
  speed: number
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.y = t * 0.5
    ref.current.rotation.z = t * 0.2
    ref.current.position.y = position[1] + Math.sin(t + index) * 0.4
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <torusKnotGeometry args={[0.8, 0.28, 128, 16]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={1.5}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  )
}

function FloatingParticles() {
  const count = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#00ff88" transparent opacity={0.6} />
    </points>
  )
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[5, -5, -5]} intensity={0.5} color="#00ccff" />

      <BraceletRing position={[0, 0.5, 0]} color="#00ff88" speed={0.4} index={0} />
      <BraceletRing position={[3.5, -0.5, -1]} color="#ff00ff" speed={0.3} index={1} />
      <BraceletRing position={[-3.5, 0, -2]} color="#00ccff" speed={0.35} index={2} />
      <BraceletRing position={[0, -1.5, -3]} color="#ff8800" speed={0.25} index={3} />

      <FloatingParticles />
      <Stars radius={30} depth={50} count={500} factor={4} saturation={0.5} fade speed={0.5} />
      <Environment preset="night" />
    </>
  )
}

export default function Scene() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <Scene3D />
      </Canvas>
    </div>
  )
}
