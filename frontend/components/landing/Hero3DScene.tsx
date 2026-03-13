'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Text3D, Environment, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

// ── Central Dumbbell Model built from primitives ──
function GlowingDumbbell() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            // Slow majestic rotation
            groupRef.current.rotation.y += 0.003
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <group ref={groupRef} scale={1.5}>
            {/* Handle bar */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 3, 32]} />
                <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
            </mesh>
            
            {/* Left Weights */}
            <group position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                {/* Inner small plate */}
                <mesh position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
                    <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Main plate 1 */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.5} />
                </mesh>
                {/* Main plate 2 */}
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[1, 1, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.5} />
                </mesh>
                {/* Outer lock */}
                <mesh position={[0, 0.7, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
                    <meshStandardMaterial color="#FFD400" emissive="#FFD400" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                </mesh>
            </group>

            {/* Right Weights */}
            <group position={[1.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <mesh position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
                    <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[1, 1, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.7, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
                    <meshStandardMaterial color="#FFD400" emissive="#FFD400" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                </mesh>
            </group>
        </group>
    )
}

// ── Interactive Camera Rig ──
function CameraRig({ children }: { children: React.ReactNode }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!groupRef.current) return
        // Smoothly move camera rig towards mouse position
        const targetX = (state.pointer.x * (Math.PI / 8))
        const targetY = (state.pointer.y * (Math.PI / 8))
        
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX, 4, delta)
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -targetY, 4, delta)
    })

    return <group ref={groupRef}>{children}</group>
}

// ── Extruded Gold Text ──
// Requires a helvetiker regular typeface loaded in public folder, or we can use a basic font structure
// For robustness without needing a local font file immediately, we'll use a stylized mesh approach or standard HTML overlay if font missing.
// Assuming we have access to a basic default font from drei's CDN for the Bebas look.

function APEXText() {
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
             <Text3D
                font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                size={2.5}
                height={0.5}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.05}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                position={[-4.5, 2, -2]}
            >
                APEX
                <meshStandardMaterial 
                    color="#222" 
                    metalness={0.9} 
                    roughness={0.1}
                    envMapIntensity={1}
                />
            </Text3D>
            <Text3D
                font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                size={1.5}
                height={0.4}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.05}
                bevelSize={0.02}
                position={[2.5, 0, -1]}
            >
                PRO
                <meshStandardMaterial 
                    color="#FFD400" 
                    emissive="#665500"
                    metalness={1} 
                    roughness={0.2}
                />
            </Text3D>
        </Float>
    )
}

export default function Hero3DScene() {
    return (
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {/* Radial gradient to ensure text readability over the canvas */}
            <div className="absolute inset-0 z-10 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #0b0b0b 90%)' }} />

            <Canvas
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <color attach="background" args={['#050505']} />
                
                {/* Lighting setup */}
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[-10, -10, -5]} intensity={2} color="#00d4ff" /> {/* Cyan fill */}
                <pointLight position={[0, 0, 2]} intensity={2} color="#FFD400" distance={10} /> {/* Gold center pop */}

                <CameraRig>
                    {/* Environmental reflections */}
                    <Environment preset="city" />

                    {/* Scene Objects */}
                    <APEXText />
                    
                    <Center position={[0, -1, 0]}>
                        <GlowingDumbbell />
                    </Center>

                    {/* Particle Systems */}
                    <Sparkles count={300} scale={15} size={2} speed={0.4} opacity={0.5} color="#FFD400" />
                    <Sparkles count={150} scale={20} size={1} speed={0.2} opacity={0.3} color="#ffffff" />
                </CameraRig>
            </Canvas>
        </div>
    )
}
