import { Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { ChromeTorus } from './ChromeTorus'
import { FloatingSphere } from './FloatingSphere'
import { useReducedMotion } from '@/hooks'

function Lights() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.4} />

      {/* Key light - cyan tint */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#00e5ff"
        castShadow={false}
      />

      {/* Rim light - violet */}
      <pointLight
        position={[-5, 2, -5]}
        intensity={0.8}
        color="#8b5cf6"
      />

      {/* Accent light - magenta */}
      <pointLight
        position={[3, -3, 2]}
        intensity={0.5}
        color="#ff00ff"
      />
    </>
  )
}

function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <Lights />

      {/* Main object */}
      <ChromeTorus mousePosition={mousePosition} />

      {/* Secondary spheres for depth - positioned lower */}
      <FloatingSphere
        position={[2.5, 0.5, -1]}
        scale={0.25}
        color="#00e5ff"
        mousePosition={mousePosition}
      />
      <FloatingSphere
        position={[-2.2, -1.2, -0.5]}
        scale={0.18}
        color="#8b5cf6"
        mousePosition={mousePosition}
      />
      <FloatingSphere
        position={[1.8, -1.8, 0.5]}
        scale={0.12}
        color="#ff00ff"
        mousePosition={mousePosition}
      />

      <Preload all />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-primary-400/30 border-t-primary-400 animate-spin" />
    </div>
  )
}

function StaticFallback() {
  // Fallback estático para reduced-motion o error de WebGL
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-primary-400/20 via-accent-violet/20 to-accent-magenta/20 blur-3xl animate-pulse-slow" />
    </div>
  )
}

export function HeroScene() {
  const reducedMotion = useReducedMotion()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hasError, setHasError] = useState(false)

  const handleMouseMove = useCallback((event: MouseEvent) => {
    // Normalizar posición del mouse a -1 a 1
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    setMousePosition({ x, y })
  }, [])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Solo usar el primer toque para la interactividad
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      // Normalizar posición del touch a -1 a 1
      const x = (touch.clientX / window.innerWidth) * 2 - 1
      const y = -(touch.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleMouseMove, handleTouchMove, reducedMotion])

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setHasError(true)
      }
    } catch {
      setHasError(true)
    }
  }, [])

  if (hasError) {
    return <StaticFallback />
  }

  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onError={() => setHasError(true)}
        >
          <Scene mousePosition={mousePosition} />
        </Canvas>
      </Suspense>

      {/* Gradient overlay for text legibility - stronger at top for navbar */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/30 to-dark-900 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60 pointer-events-none" />
    </div>
  )
}
