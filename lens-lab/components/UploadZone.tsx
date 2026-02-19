'use client';

import { useState, useCallback } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
    onImageUploaded: (file: File, dataUrl: string, base64: string, mimeType: string) => void;
}

export default function UploadZone({ onImageUploaded }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const processFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string;
                const base64 = dataUrl.split(',')[1];
                onImageUploaded(file, dataUrl, base64, file.type);
            };
            reader.readAsDataURL(file);
        },
        [onImageUploaded]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
        },
        [processFile]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) processFile(file);
        };
        input.click();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-xl mx-auto"
            >
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed 
            transition-all duration-300 ease-out
            p-12 flex flex-col items-center justify-center gap-4
            group
            ${isDragging
                            ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                            : 'border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04]'
                        }
          `}
                >
                    {/* Animated icon */}
                    <motion.div
                        animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                        className={`
              p-4 rounded-2xl transition-colors duration-300
              ${isDragging ? 'bg-purple-500/20' : 'bg-white/5 group-hover:bg-white/10'}
            `}
                    >
                        {isDragging ? (
                            <ImageIcon className="w-8 h-8 text-purple-400" />
                        ) : (
                            <Upload className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors" />
                        )}
                    </motion.div>

                    {/* Text */}
                    <div className="text-center">
                        <p className="text-white/70 text-sm font-medium">
                            {isDragging ? 'Drop your image here' : 'Drag & drop an image, or click to upload'}
                        </p>
                        <p className="text-white/30 text-xs mt-1">JPG, PNG, WebP — up to 10MB</p>
                    </div>

                    {/* Glow effect on drag */}
                    {isDragging && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
