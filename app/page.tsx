'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import LensView from '@/components/LensView';
import ControlPanel from '@/components/ControlPanel';
import SettingsModal from '@/components/SettingsModal';

import { Preset } from '@/lib/presets';
import { base64ToDataUrl } from '@/lib/utils';

interface UserInfo {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  hasApiConfig: boolean;
}

export default function Home() {
  // User state
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // App state
  const [image, setImage] = useState<{ file: File; base64: string; mimeType: string; dataUrl: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  const handleImageUpload = useCallback((file: File, dataUrl: string, base64: string, mimeType: string) => {
    setImage({ file, base64, mimeType, dataUrl });
    setGeneratedImage(null);
    setSelectedPreset(null);
    setError(null);
  }, []);

  const handlePresetSelect = useCallback(
    async (preset: Preset) => {
      if (!image || isProcessing) return;

      setSelectedPreset(preset.id);
      setIsProcessing(true);
      setError(null);
      setGeneratedImage(null);

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: image.base64,
            mimeType: image.mimeType,
            prompt: preset.prompt,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Error ${res.status}`);
        }

        if (data.image) {
          const genUrl = base64ToDataUrl(data.image, data.mimeType || 'image/png');
          setGeneratedImage(genUrl);
        } else {
          throw new Error('No image returned');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Generation failed');
      } finally {
        setIsProcessing(false);
      }
    },
    [image, isProcessing]
  );

  const handleReset = useCallback(() => {
    setImage(null);
    setGeneratedImage(null);
    setSelectedPreset(null);
    setError(null);
  }, []);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const needsApiConfig = user && !user.isAdmin && !user.hasApiConfig;

  return (
    <main className="min-h-screen flex flex-col">
      <Header
        user={user}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 gap-6 max-w-4xl mx-auto w-full">
        {/* API config nudge for new users */}
        {needsApiConfig && !image && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="glass rounded-2xl p-6 text-center border border-yellow-500/20 bg-yellow-500/5">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-white/80 mb-2">需要配置 API</h3>
              <p className="text-xs text-white/40 mb-4">
                上传图片前，请先设置你的 API 端点和 Key。
              </p>
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20"
              >
                前往设置
              </button>
            </div>
          </motion.div>
        )}

        {/* Upload or Lens */}
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <UploadZone onImageUploaded={handleImageUpload} />
            </motion.div>
          ) : (
            <motion.div
              key="lens"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <LensView
                originalImage={image.dataUrl}
                generatedImage={generatedImage}
                isProcessing={isProcessing}
              />
              {/* Reset button */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-all"
                >
                  ↩ 重新上传
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            <ControlPanel
              selectedPreset={selectedPreset}
              isProcessing={isProcessing}
              onSelectPreset={handlePresetSelect}
            />
          </motion.div>
        )}
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isAdmin={user?.isAdmin || false}
      />
    </main>
  );
}
