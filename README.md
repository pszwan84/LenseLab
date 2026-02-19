🔮 AI-Powered Parallel Reality Lens — Upload a photo, choose a style, and peer into a parallel universe through an interactive magic lens. Powered by Gemini AI.

<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/e500d902-b220-4a4f-b2f0-cb9061138474" />

<div align="center">

# 🔮 LensLab

**AI-Powered Parallel Reality Lens**

Upload any photo, choose a style, and peer into a parallel universe through a magic lens.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)

[English](#features) · [中文](#功能特性)

</div>

---

## ✨ Features

- 🔮 **Magic Lens Effect** — Hover to reveal the AI-transformed image through an interactive circular lens
- 🎨 **6 Style Presets** — Cyberpunk, LEGO Bricks, Studio Ghibli, Pencil Sketch, Watercolor, Sci-Fi
- 🖱️ **Smooth Interactions** — Scroll to resize lens, Space for full reveal, drag on mobile
- 🔐 **Built-in Auth** — JWT + JSON file storage, zero database needed
- 👑 **Admin Mode** — Admin uses server-side API keys from `.env`; regular users configure their own
- 📱 **Responsive** — Works on desktop and mobile with touch support
- 🌙 **Dark Theme** — Glassmorphism UI with smooth Framer Motion animations

## 🖼️ How It Works

```
┌──────────┐     ┌──────────┐     ┌──────────────────┐
│  Upload  │ ──▶ │  Choose  │ ──▶ │ Hover to Reveal  │
│  Photo   │     │  Style   │     │  Parallel World  │
└──────────┘     └──────────┘     └──────────────────┘
```

LensLab sends your image + style prompt to a Gemini vision model, which generates a transformed version. The magic lens then lets you interactively compare both images with a smooth radial mask effect.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **API Access** — One of the following:
  - An OpenAI-compatible proxy with Gemini image generation models
  - A Google AI Studio API key ([get one free](https://aistudio.google.com/apikey))

### Setup

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/lens-lab.git
cd lens-lab

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your API credentials

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start exploring parallel realities! 🎉

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_BASE_URL` | OpenAI-compatible API endpoint | ✅ |
| `API_KEY` | API key for the endpoint | ✅ |
| `MODEL_NAME` | Model name (default: `gemini-3-pro-image`) | ✅ |
| `JWT_SECRET` | Secret for signing auth tokens | ✅ |
| `ADMIN_EMAIL` | Email that gets admin privileges | Optional |

## 🏗️ Architecture

```
lens-lab/
├── app/
│   ├── page.tsx              # Main page — upload + lens + controls
│   ├── login/page.tsx        # Login / Register page
│   ├── api/
│   │   ├── generate/         # Image generation endpoint
│   │   ├── auth/             # register, login, logout, me
│   │   └── user/settings/    # User API config management
│   └── layout.tsx            # Root layout + fonts
├── components/
│   ├── LensView.tsx          # ✨ Core magic lens with radial mask
│   ├── UploadZone.tsx        # Drag & drop image upload
│   ├── ControlPanel.tsx      # Style preset selector
│   ├── Header.tsx            # App header with user menu
│   ├── UserMenu.tsx          # Avatar dropdown (settings, logout)
│   └── SettingsModal.tsx     # API configuration modal
├── lib/
│   ├── presets.ts            # Style preset definitions & prompts
│   ├── auth.ts               # JWT sign/verify, password hashing
│   ├── users.ts              # JSON-file user storage (zero DB)
│   └── utils.ts              # Base64 / image helpers
└── middleware.ts             # Route protection
```

## 🔐 Auth System

LensLab has a lightweight, **zero-database** auth system:

- **Storage**: Users are stored in a simple `data/users.json` file
- **Passwords**: Hashed with bcrypt
- **Sessions**: JWT tokens in HTTP-only cookies
- **Two roles**:
  - 👑 **Admin** — Registers with the `ADMIN_EMAIL`, automatically uses API keys from `.env.local`
  - 👤 **User** — Registers with any other email, configures their own API key in Settings

## 🧩 Style Presets

| Emoji | Style | Description |
|-------|-------|-------------|
| 🌃 | Night City | Cyberpunk neon, rain-slicked streets, holographic signs |
| 🧱 | Brick World | Everything made of colorful LEGO-style bricks |
| 🍃 | Anime Sky | Studio Ghibli-inspired, lush painterly illustration |
| ✏️ | Pencil Sketch | Detailed charcoal sketch on textured paper |
| 🎨 | Watercolor | Soft washes, bleeding colors, dreamy brushwork |
| 🚀 | Sci-Fi World | Sleek metallic surfaces, holographic interfaces |

> **Adding your own**: Edit `lib/presets.ts` to add custom styles. Each preset is just an emoji, name, and a prompt.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Auth | JWT + bcrypt |
| AI | Gemini (via OpenAI-compatible API) |

## 📋 API Compatibility

LensLab works with any **OpenAI-compatible** endpoint that supports vision + image generation:

```
POST /v1/chat/completions
{
  "model": "gemini-3-pro-image",
  "messages": [{
    "role": "user",
    "content": [
      { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,..." } },
      { "type": "text", "text": "Transform this image into..." }
    ]
  }]
}
```

Tested with:
- Local OpenAI-compatible proxies (e.g., one-api, new-api)
- Any service that proxies Gemini image generation models

## 📄 License

Apache © 2025

---

<div align="center">

**If you like this project, give it a ⭐!**

Built with 💜 and Gemini AI

</div>
