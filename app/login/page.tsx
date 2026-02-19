'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'register';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body =
                mode === 'login'
                    ? { email, password }
                    : { email, username, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || '操作失败');
                return;
            }

            // Success — redirect to home
            router.push('/');
            router.refresh();
        } catch {
            setError('网络错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex noise">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-cyan-900/30" />

                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

                {/* Content */}
                <div className="relative z-10 text-center px-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 w-14 h-14 rounded-full bg-purple-500/30 blur-lg animate-pulse-glow" />
                            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-500/40">
                                L
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-3">
                        LensLab
                    </h1>
                    <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                        Reveal the parallel reality hidden in your photos. Upload, transform, explore.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <Sparkles className="w-4 h-4 text-purple-400/60" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">
                            Powered by Gemini
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Auth form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                            L
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white/90">LensLab</h1>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest">AI Reality Lens</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
                        {(['login', 'register'] as Mode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(''); }}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${mode === m
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                {m === 'login' ? '登录' : '注册'}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    key="username"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-xs text-white/40 mb-1.5 font-medium">用户名</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="你的名字"
                                        required={mode === 'register'}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 font-medium">邮箱</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 font-medium">密码</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="至少 6 位"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? '登录' : '创建账号'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer hint */}
                    <p className="text-center text-white/20 text-[10px] mt-6">
                        {mode === 'login'
                            ? '还没有账号？点击上方「注册」'
                            : '已有账号？点击上方「登录」'}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
