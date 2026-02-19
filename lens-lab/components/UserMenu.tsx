'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserInfo {
    username: string;
    email: string;
    isAdmin: boolean;
}

interface UserMenuProps {
    user: UserInfo;
    onOpenSettings: () => void;
}

export default function UserMenu({ user, onOpenSettings }: UserMenuProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    // Get initials
    const initials = user.username
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div ref={menuRef} className="relative">
            {/* Avatar button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
            >
                {/* Admin badge */}
                {user.isAdmin && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400 text-[10px] font-medium">
                        <Zap className="w-3 h-3" />
                        Admin
                    </span>
                )}

                {/* Avatar circle */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/80 to-cyan-500/80 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                </div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl py-2 z-50 shadow-xl shadow-black/30"
                    >
                        {/* User info */}
                        <div className="px-4 py-2 border-b border-white/5">
                            <p className="text-sm font-medium text-white/80">{user.username}</p>
                            <p className="text-xs text-white/30">{user.email}</p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                            <button
                                onClick={() => { setOpen(false); onOpenSettings(); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                API 设置
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                退出登录
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
