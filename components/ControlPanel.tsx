'use client';

import { PRESETS, Preset } from '@/lib/presets';
import { motion } from 'framer-motion';

interface ControlPanelProps {
    selectedPreset: string | null;
    onSelectPreset: (preset: Preset) => void;
    isProcessing: boolean;
}

export default function ControlPanel({
    selectedPreset,
    onSelectPreset,
    isProcessing,
}: ControlPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-2xl mx-auto"
        >
            <p className="text-center text-white/40 text-xs uppercase tracking-widest mb-4 font-medium">
                Choose a parallel reality
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESETS.map((preset, index) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                        <motion.button
                            key={preset.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => !isProcessing && onSelectPreset(preset)}
                            disabled={isProcessing}
                            className={`
                relative flex flex-col items-center gap-2 p-3 rounded-xl
                transition-all duration-200 ease-out
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected
                                    ? 'bg-white/10 border border-white/20 shadow-lg shadow-purple-500/10'
                                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12]'
                                }
              `}
                        >
                            {/* Emoji */}
                            <span className="text-2xl">{preset.emoji}</span>

                            {/* Label */}
                            <span
                                className={`text-[10px] font-medium tracking-wide leading-tight text-center ${isSelected ? 'text-white/90' : 'text-white/40'
                                    }`}
                            >
                                {preset.name}
                            </span>

                            {/* Active indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="preset-indicator"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
