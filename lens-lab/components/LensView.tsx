'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface LensViewProps {
    originalImage: string;    // data URL
    generatedImage: string | null; // data URL
    isProcessing: boolean;
}

export default function LensView({ originalImage, generatedImage, isProcessing }: LensViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [lensSize, setLensSize] = useState(180);
    const [showFullReveal, setShowFullReveal] = useState(false);

    // Mouse / touch tracking
    const handleMove = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: clientX - rect.left,
            y: clientY - rect.top,
        });
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => handleMove(e.clientX, e.clientY),
        [handleMove]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        },
        [handleMove]
    );

    // Scroll to resize lens
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        setLensSize((prev) => {
            const newSize = prev + (e.deltaY > 0 ? -15 : 15);
            return Math.min(Math.max(newSize, 80), 400);
        });
    }, []);

    // Download composite image
    const handleDownload = useCallback(() => {
        const link = document.createElement('a');
        link.download = 'lenslab-parallel-reality.png';
        link.href = generatedImage || originalImage;
        link.click();
    }, [generatedImage, originalImage]);

    // Keyboard shortcut: Space to toggle full reveal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && generatedImage) {
                e.preventDefault();
                setShowFullReveal((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [generatedImage]);

    const hasGenerated = !!generatedImage;
    const showLens = isHovering && hasGenerated && !showFullReveal;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full max-w-2xl mx-auto"
        >
            {/* Main canvas */}
            <div
                ref={containerRef}
                className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.06] cursor-none select-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => { setIsHovering(false); }}
                onTouchStart={() => setIsHovering(true)}
                onTouchEnd={() => setIsHovering(false)}
                onWheel={handleWheel}
            >
                {/* Layer 1: Original image (always visible) */}
                <img
                    src={originalImage}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />

                {/* Layer 2: Generated image (masked by lens) */}
                {hasGenerated && (
                    <div
                        className="absolute inset-0 w-full h-full transition-opacity duration-300"
                        style={{
                            opacity: showFullReveal ? 1 : showLens ? 1 : 0,
                            maskImage: showFullReveal
                                ? 'none'
                                : showLens
                                    ? `radial-gradient(circle ${lensSize / 2}px at ${mousePos.x}px ${mousePos.y}px, black 60%, transparent 100%)`
                                    : 'none',
                            WebkitMaskImage: showFullReveal
                                ? 'none'
                                : showLens
                                    ? `radial-gradient(circle ${lensSize / 2}px at ${mousePos.x}px ${mousePos.y}px, black 60%, transparent 100%)`
                                    : 'none',
                        }}
                    >
                        <img
                            src={generatedImage}
                            alt="Parallel Reality"
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                    </div>
                )}

                {/* Layer 3: Lens ring glow */}
                {showLens && (
                    <>
                        {/* Outer glow */}
                        <div
                            className="absolute pointer-events-none rounded-full"
                            style={{
                                width: lensSize + 20,
                                height: lensSize + 20,
                                left: mousePos.x - (lensSize + 20) / 2,
                                top: mousePos.y - (lensSize + 20) / 2,
                                background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
                            }}
                        />
                        {/* Ring */}
                        <div
                            className="absolute pointer-events-none rounded-full border border-white/30"
                            style={{
                                width: lensSize,
                                height: lensSize,
                                left: mousePos.x - lensSize / 2,
                                top: mousePos.y - lensSize / 2,
                                boxShadow:
                                    '0 0 20px rgba(124,58,237,0.3), inset 0 0 20px rgba(124,58,237,0.1), 0 0 60px rgba(124,58,237,0.1)',
                            }}
                        />
                        {/* Center dot */}
                        <div
                            className="absolute pointer-events-none w-1 h-1 rounded-full bg-white/60"
                            style={{
                                left: mousePos.x - 2,
                                top: mousePos.y - 2,
                            }}
                        />
                    </>
                )}

                {/* Loading overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <div className="relative">
                            {/* Spinning ring */}
                            <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-purple-500 border-r-purple-500/50 animate-spin" />
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-b-cyan-500 border-l-cyan-500/50 animate-spin-slow" />
                        </div>
                        <p className="mt-4 text-white/70 text-sm font-medium tracking-wide">
                            Constructing parallel reality...
                        </p>
                    </div>
                )}

                {/* Hint overlay (before generation) */}
                {!hasGenerated && !isProcessing && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="glass rounded-full px-4 py-2 text-xs text-white/40">
                            Select a style below to begin ↓
                        </div>
                    </div>
                )}

                {/* Full reveal badge */}
                {showFullReveal && hasGenerated && (
                    <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs text-white/70 z-10">
                        🔮 Full Reveal — press Space to toggle
                    </div>
                )}
            </div>

            {/* Controls bar */}
            {hasGenerated && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mt-4"
                >
                    <button
                        onClick={() => setLensSize((s) => Math.max(80, s - 30))}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-all"
                        title="Smaller lens"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setLensSize((s) => Math.min(400, s + 30))}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-all"
                        title="Larger lens"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <button
                        onClick={() => setShowFullReveal((v) => !v)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${showFullReveal
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80'
                            }`}
                    >
                        {showFullReveal ? '🔮 Reveal On' : '👁️ Full Reveal'}
                    </button>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-all"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </motion.div>
            )}

            {/* Hint text */}
            {hasGenerated && !showFullReveal && (
                <p className="text-center text-white/25 text-xs mt-2">
                    Move your cursor over the image • Scroll to resize lens • Space for full reveal
                </p>
            )}
        </motion.div>
    );
}
