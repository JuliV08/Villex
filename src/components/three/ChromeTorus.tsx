import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { Float } from '@react-three/drei'
import { useReducedMotion } from '@/hooks'

interface ChromeTorusProps {
  mousePosition: { x: number; y: number }
}

export function ChromeTorus({ mousePosition }: ChromeTorusProps) {
  const meshRef = useRef<Mesh>(null)
  const reducedMotion = useReducedMotion()

  useFrame((_state, delta) => {
    if (!meshRef.current || reducedMotion) return

    // Rotación base lenta
    meshRef.current.rotation.x += delta * 0.1
    meshRef.current.rotation.y += delta * 0.15

    // Parallax sutil con el mouse
    const targetRotationX = mousePosition.y * 0.3
    const targetRotationZ = mousePosition.x * 0.2

    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.02
    meshRef.current.rotation.z += (targetRotationZ - meshRef.current.rotation.z) * 0.02
  })

  const torusKnot = (
    <mesh ref={meshRef} scale={1.2} position={[0, -0.3, 0]}>
      <torusKnotGeometry args={[1, 0.35, 100, 16, 2, 3]} />
      <meshStandardMaterial
        color="#00e5ff"
        emissive="#8b5cf6"
        emissiveIntensity={0.3}
        metalness={0.4}
        roughness={0.3}
        wireframe={false}
      />
    </mesh>
  )

  // Si reduced motion, sin Float
  if (reducedMotion) {
    return torusKnot
  }

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      {torusKnot}
    </Float>
  )
}
