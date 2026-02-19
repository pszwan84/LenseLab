'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, ExternalLink, Zap, Loader2 } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isAdmin: boolean;
}

export default function SettingsModal({ isOpen, onClose, isAdmin }: SettingsModalProps) {
    const [baseUrl, setBaseUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Load settings from server
    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        setError('');
        fetch('/api/user/settings')
            .then((res) => res.json())
            .then((data) => {
                setBaseUrl(data.apiBaseUrl || '');
                setApiKey(data.isAdmin ? '' : ''); // Don't show masked key in input
                if (data.hasConfig && !data.isAdmin) {
                    setApiKey(''); // User can re-enter if needed
                    setBaseUrl(data.apiBaseUrl || '');
                }
            })
            .catch(() => setError('加载设置失败'))
            .finally(() => setLoading(false));
    }, [isOpen]);

    const handleSave = async () => {
        if (!baseUrl.trim() || !apiKey.trim()) {
            setError('请填写 API Base URL 和 API Key');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiBaseUrl: baseUrl.trim(), apiKey: apiKey.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
                // Reload page to refresh API config status
                window.location.reload();
            }, 1000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '保存失败');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md"
                    >
                        <div className="glass-strong rounded-2xl p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-purple-400" />
                                    <h2 className="text-lg font-semibold text-white/90">API 设置</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                </div>
                            ) : isAdmin ? (
                                /* Admin view */
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <Zap className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm text-purple-300">Admin 模式</span>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        Admin 使用服务器 <code className="text-purple-400/80 text-xs">.env.local</code> 中配置的 API。
                                        无需在此页面设置。
                                    </p>
                                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                                        <p className="text-xs text-white/30 mb-1">API Base URL</p>
                                        <p className="text-sm text-white/60 font-mono">{baseUrl || '(未设置)'}</p>
                                    </div>
                                </div>
                            ) : (
                                /* Regular user view */
                                <div className="space-y-4">
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        配置你的 OpenAI 兼容 API 端点。API Key 会安全存储在服务器端。
                                    </p>

                                    <a
                                        href="https://aistudio.google.com/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        获取 Google AI Studio API Key
                                        <ExternalLink className="w-3 h-3" />
                                    </a>

                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 font-medium">API Base URL</label>
                                        <input
                                            type="text"
                                            value={baseUrl}
                                            onChange={(e) => setBaseUrl(e.target.value)}
                                            placeholder="http://127.0.0.1:8045/v1"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 font-medium">API Key</label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="sk-..."
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 ${saved
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/20'
                                            } disabled:opacity-50`}
                                    >
                                        {saving ? '保存中...' : saved ? '✓ 已保存！' : '保存设置'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
