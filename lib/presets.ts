export interface Preset {
  id: string;
  name: string;
  emoji: string;
  prompt: string;
  color: string; // gradient accent for the button
}

export const PRESETS: Preset[] = [
  {
    id: 'cyberpunk',
    name: 'Night City',
    emoji: '🌃',
    prompt:
      'Transform this image into a cyberpunk scene. Neon lights, rain-slicked surfaces, holographic signs, futuristic vibes. Dark and moody atmosphere with vivid neon glows in pink, cyan, and purple. Maintain the exact same composition, perspective, and object placement as the original image. High detail, cinematic.',
    color: 'from-cyan-500 to-purple-600',
  },
  {
    id: 'lego',
    name: 'Brick World',
    emoji: '🧱',
    prompt:
      'Transform this entire scene into a world made of plastic toy building bricks (like LEGO). Every surface, object, and element should be constructed from colorful interlocking bricks. Keep the colors vibrant and playful. Maintain the exact same composition, perspective, and layout as the original image.',
    color: 'from-yellow-400 to-red-500',
  },
  {
    id: 'ghibli',
    name: 'Anime Sky',
    emoji: '🍃',
    prompt:
      'Transform this image into a Studio Ghibli-inspired anime illustration. Lush, painterly colors, soft hand-painted textures, fluffy cumulus clouds, warm golden-hour lighting. The scene should feel magical and peaceful. Maintain the exact same composition and layout as the original image.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 'sketch',
    name: 'Pencil Sketch',
    emoji: '✏️',
    prompt:
      'Transform this image into a highly detailed charcoal pencil sketch on rough textured paper. Black and white only, with expressive cross-hatching and artistic shading. The outlines and proportions must match the original image exactly. Fine art quality.',
    color: 'from-zinc-400 to-zinc-600',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    emoji: '🎨',
    prompt:
      'Transform this image into a beautiful loose watercolor painting. Soft washes of color bleeding into each other, visible paper texture, gentle brush strokes. Dreamy and artistic. Maintain the same composition and layout as the original image.',
    color: 'from-pink-400 to-orange-400',
  },
  {
    id: 'scifi',
    name: 'Sci-Fi World',
    emoji: '🚀',
    prompt:
      'Transform this scene into a futuristic sci-fi environment. Sleek metallic surfaces, floating holographic interfaces, advanced technology everywhere. Cool blue and silver tones with glowing energy accents. Maintain the exact same composition as the original image.',
    color: 'from-blue-500 to-indigo-600',
  },
];
