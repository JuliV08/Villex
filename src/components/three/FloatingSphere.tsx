import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { Float } from '@react-three/drei'
import { useReducedMotion } from '@/hooks'

interface FloatingSphereProps {
  position: [number, number, number]
  scale?: number
  color?: string
  mousePosition: { x: number; y: number }
}

export function FloatingSphere({
  position,
  scale = 0.3,
  color = '#00e5ff',
  mousePosition,
}: FloatingSphereProps) {
  const meshRef = useRef<Mesh>(null)
  const reducedMotion = useReducedMotion()

  useFrame((_state, delta) => {
    if (!meshRef.current || reducedMotion) return

    // Rotación suave
    meshRef.current.rotation.y += delta * 0.5

    // Sutil reacción al mouse (inversa para efecto parallax)
    const targetX = position[0] - mousePosition.x * 0.3
    const targetY = position[1] - mousePosition.y * 0.2

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05
  })

  const sphere = (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        clearcoat={0.8}
        emissive={color}
        emissiveIntensity={0.1}
        envMapIntensity={1}
      />
    </mesh>
  )

  if (reducedMotion) {
    return sphere
  }

  return (
    <Float
      speed={3}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      {sphere}
    </Float>
  )
}
