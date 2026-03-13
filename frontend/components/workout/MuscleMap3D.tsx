'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MuscleMapProps {
    primaryMuscles: string[]
    secondaryMuscles: string[]
}

// Map common muscle names to body parts
const checkMuscle = (part: string, primary: string[], secondary: string[]) => {
    const isPrimary = primary.some(m => m.toLowerCase().includes(part))
    const isSecondary = secondary.some(m => m.toLowerCase().includes(part))
    
    if (isPrimary) return '#FFD400' // Apex yellow
    if (isSecondary) return '#ff9d00' // Apex orange
    return '#1c1c1c' // Inactive dark
}

function BodyModel({ primaryMuscles, secondaryMuscles }: MuscleMapProps) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005 // Slow rotation
        }
    })

    // Material logic
    const getMaterial = (part: string) => {
        const color = checkMuscle(part, primaryMuscles, secondaryMuscles)
        return new THREE.MeshStandardMaterial({ 
            color, 
            roughness: 0.4, 
            metalness: 0.6,
            emissive: color === '#1c1c1c' ? '#000' : color,
            emissiveIntensity: color === '#1c1c1c' ? 0 : 0.2
        })
    }

    return (
        <group ref={groupRef} position={[0, -2, 0]} scale={1.2}>
            {/* Head */}
            <mesh position={[0, 4.5, 0]} material={new THREE.MeshStandardMaterial({ color: '#111' })}>
                <sphereGeometry args={[0.5, 32, 32]} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 3.8, 0]} material={getMaterial('neck')}>
                <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
            </mesh>

            {/* Torso (Chest/Core/Back) */}
            {/* Chest */}
            <mesh position={[0, 2.8, 0.2]} material={getMaterial('chest')}>
                <boxGeometry args={[1.8, 1.2, 0.6]} />
            </mesh>
            {/* Core / Abs */}
            <mesh position={[0, 1.6, 0.1]} material={getMaterial('core')}>
                <boxGeometry args={[1.4, 1.2, 0.5]} />
            </mesh>
            {/* Back (Lats/Rhomboids) */}
            <mesh position={[0, 2.2, -0.2]} material={getMaterial('back')}>
                <boxGeometry args={[1.7, 2.2, 0.4]} />
            </mesh>

            {/* Shoulders */}
            <mesh position={[-1.2, 3.2, 0]} material={getMaterial('shoulder')}>
                <sphereGeometry args={[0.4, 16, 16]} />
            </mesh>
            <mesh position={[1.2, 3.2, 0]} material={getMaterial('shoulder')}>
                <sphereGeometry args={[0.4, 16, 16]} />
            </mesh>

            {/* Arms (Biceps/Triceps) */}
            <mesh position={[-1.4, 2.2, 0]} rotation={[0, 0, -0.1]} material={getMaterial('bicep')}>
                <cylinderGeometry args={[0.25, 0.2, 1.4, 16]} />
            </mesh>
            <mesh position={[1.4, 2.2, 0]} rotation={[0, 0, 0.1]} material={getMaterial('bicep')}>
                <cylinderGeometry args={[0.25, 0.2, 1.4, 16]} />
            </mesh>

            {/* Forearms */}
            <mesh position={[-1.6, 0.8, 0]} rotation={[0, 0, -0.1]} material={getMaterial('forearm')}>
                <cylinderGeometry args={[0.2, 0.15, 1.2, 16]} />
            </mesh>
            <mesh position={[1.6, 0.8, 0]} rotation={[0, 0, 0.1]} material={getMaterial('forearm')}>
                <cylinderGeometry args={[0.2, 0.15, 1.2, 16]} />
            </mesh>

            {/* Hips / Glutes */}
            <mesh position={[0, 0.6, 0]} material={getMaterial('glute')}>
                <boxGeometry args={[1.6, 0.8, 0.7]} />
            </mesh>

            {/* Upper Legs (Quads/Hamstrings) */}
            <mesh position={[-0.45, -0.6, 0]} material={getMaterial('quad')}>
                <cylinderGeometry args={[0.35, 0.25, 1.6, 16]} />
            </mesh>
            <mesh position={[0.45, -0.6, 0]} material={getMaterial('quad')}>
                <cylinderGeometry args={[0.35, 0.25, 1.6, 16]} />
            </mesh>

            {/* Lower Legs (Calves) */}
            <mesh position={[-0.45, -2.2, 0]} material={getMaterial('calve')}>
                <cylinderGeometry args={[0.22, 0.15, 1.4, 16]} />
            </mesh>
            <mesh position={[0.45, -2.2, 0]} material={getMaterial('calve')}>
                <cylinderGeometry args={[0.22, 0.15, 1.4, 16]} />
            </mesh>
        </group>
    )
}

export default function MuscleMap3D({ primaryMuscles = [], secondaryMuscles = [] }: MuscleMapProps) {
    return (
        <div className="w-full h-[320px] bg-black/40 rounded-xl overflow-hidden relative">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#00d4ff" /> {/* Edge light */}
                <BodyModel primaryMuscles={primaryMuscles} secondaryMuscles={secondaryMuscles} />
            </Canvas>
        </div>
    )
}
