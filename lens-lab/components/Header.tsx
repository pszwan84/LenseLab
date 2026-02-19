'use client';

import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import UserMenu from './UserMenu';

interface UserInfo {
    username: string;
    email: string;
    isAdmin: boolean;
}

interface HeaderProps {
    user: UserInfo | null;
    onOpenSettings: () => void;
}

export default function Header({ user, onOpenSettings }: HeaderProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex items-center justify-between px-6 py-4"
        >
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="absolute inset-0 w-8 h-8 rounded-full bg-purple-500/30 blur-md animate-pulse-glow" />
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/30">
                        L
                    </div>
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white/90 tracking-wide">LensLab</h1>
                    <p className="text-[10px] text-white/30 tracking-widest uppercase">AI Reality Lens</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white/60 transition-all"
                    title="GitHub"
                >
                    <Github className="w-4 h-4" />
                </a>
                {user && (
                    <UserMenu user={user} onOpenSettings={onOpenSettings} />
                )}
            </div>
        </motion.header>
    );
}
