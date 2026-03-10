'use client'

import { useEffect, useRef } from 'react'

interface GymObject {
    x: number
    y: number
    z: number          // 0 = far, 1 = near (parallax depth)
    vx: number
    vy: number
    rotation: number
    rotSpeed: number
    type: 'barbell' | 'dumbbell' | 'plate' | 'kettlebell' | 'ring'
    size: number
    opacity: number
    color: string
}

function drawBarbell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string, opacity: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = opacity

    const s = size
    // bar
    ctx.strokeStyle = color
    ctx.lineWidth = s * 0.08
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-s, 0)
    ctx.lineTo(s, 0)
    ctx.stroke()

    // plates left
    for (let i = 0; i < 2; i++) {
        const px = -s * 0.75 + i * s * 0.12
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.roundRect(px, -s * 0.28, s * 0.1, s * 0.56, s * 0.03)
        ctx.fill()
    }
    // plates right
    for (let i = 0; i < 2; i++) {
        const px = s * 0.65 - i * s * 0.12
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.roundRect(px, -s * 0.28, s * 0.1, s * 0.56, s * 0.03)
        ctx.fill()
    }

    ctx.restore()
}

function drawDumbbell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string, opacity: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = opacity

    const s = size * 0.55
    ctx.strokeStyle = color
    ctx.lineWidth = s * 0.15
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-s, 0)
    ctx.lineTo(s, 0)
    ctx.stroke()

    // left head
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(-s * 1.4, -s * 0.38, s * 0.45, s * 0.76, s * 0.08)
    ctx.fill()
    // right head
    ctx.beginPath()
    ctx.roundRect(s * 0.95, -s * 0.38, s * 0.45, s * 0.76, s * 0.08)
    ctx.fill()

    ctx.restore()
}

function drawPlate(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string, opacity: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = opacity

    ctx.strokeStyle = color
    ctx.lineWidth = size * 0.08
    ctx.beginPath()
    ctx.arc(0, 0, size, 0, Math.PI * 2)
    ctx.stroke()

    ctx.lineWidth = size * 0.04
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2)
    ctx.stroke()

    // spokes
    for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + rot
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * size * 0.35, Math.sin(a) * size * 0.35)
        ctx.lineTo(Math.cos(a) * size * 0.9, Math.sin(a) * size * 0.9)
        ctx.stroke()
    }
    ctx.restore()
}

function drawKettlebell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string, opacity: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = opacity

    ctx.strokeStyle = color
    ctx.lineWidth = size * 0.08
    // body
    ctx.beginPath()
    ctx.arc(0, size * 0.1, size * 0.65, 0, Math.PI * 2)
    ctx.stroke()
    // handle
    ctx.beginPath()
    ctx.arc(0, -size * 0.45, size * 0.38, Math.PI, 0)
    ctx.stroke()

    ctx.restore()
}

function drawRing(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string, opacity: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = opacity

    ctx.strokeStyle = color
    ctx.lineWidth = size * 0.12
    ctx.beginPath()
    ctx.ellipse(0, 0, size, size * 0.38, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
}

const COLORS = [
    'rgba(200,255,0,',
    'rgba(0,212,255,',
    'rgba(157,78,221,',
    'rgba(255,157,0,',
    'rgba(255,69,69,',
    'rgba(255,215,0,',
]

export default function GymCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouse = useRef({ x: 0, y: 0 })
    const objects = useRef<GymObject[]>([])
    const raf = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        const types: GymObject['type'][] = ['barbell', 'dumbbell', 'plate', 'kettlebell', 'ring']

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const onMouse = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', onMouse)

        // spawn objects
        objects.current = Array.from({ length: 22 }, (_, i) => {
            const z = 0.2 + Math.random() * 0.8
            const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)]
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z,
                vx: (Math.random() - 0.5) * 0.3 * z,
                vy: (Math.random() - 0.5) * 0.2 * z,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.006 * z,
                type: types[i % types.length],
                size: 18 + Math.random() * 28 + z * 16,
                opacity: 0.04 + z * 0.08,
                color: colorBase + (0.8 + z * 0.2) + ')',
            }
        })

        let mxSmooth = 0.5, mySmooth = 0.5
        const draw = () => {
            const W = canvas.width, H = canvas.height
            ctx.clearRect(0, 0, W, H)

            // smooth mouse
            const mxNorm = mouse.current.x / window.innerWidth
            const myNorm = mouse.current.y / window.innerHeight
            mxSmooth += (mxNorm - mxSmooth) * 0.04
            mySmooth += (myNorm - mySmooth) * 0.04

            for (const obj of objects.current) {
                // parallax offset
                const px = (mxSmooth - 0.5) * 80 * obj.z
                const py = (mySmooth - 0.5) * 50 * obj.z

                obj.x += obj.vx
                obj.y += obj.vy
                obj.rotation += obj.rotSpeed

                if (obj.x < -80) obj.x = W + 80
                if (obj.x > W + 80) obj.x = -80
                if (obj.y < -80) obj.y = H + 80
                if (obj.y > H + 80) obj.y = -80

                const rx = obj.x + px
                const ry = obj.y + py

                switch (obj.type) {
                    case 'barbell': drawBarbell(ctx, rx, ry, obj.size, obj.rotation, obj.color, obj.opacity); break
                    case 'dumbbell': drawDumbbell(ctx, rx, ry, obj.size, obj.rotation, obj.color, obj.opacity); break
                    case 'plate': drawPlate(ctx, rx, ry, obj.size, obj.rotation, obj.color, obj.opacity); break
                    case 'kettlebell': drawKettlebell(ctx, rx, ry, obj.size, obj.rotation, obj.color, obj.opacity); break
                    case 'ring': drawRing(ctx, rx, ry, obj.size, obj.rotation, obj.color, obj.opacity); break
                }
            }

            raf.current = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(raf.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', onMouse)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 1 }}
        />
    )
}
