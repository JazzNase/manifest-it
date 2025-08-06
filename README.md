# 🌟 Manifest It — The Manifestation Tracker for Dreamers

> Created with love by **Jazz Michael Nase** — Solo Developer  
> Submitted for the **Campus Mini App Challenge** by [BasedGigs](https://basedgigs.com/listing/mini-app-challenge)

---

## ✨ What is Manifest It?

**Manifest It** is a minimalist, web3-inspired manifestation journal and tracker built for dreamers, goal-setters, and believers in their own power.

Designed to be fun, aesthetic, and emotionally engaging, Manifest It gives users a space to **declare their desires**, **track their progress**, and **celebrate their wins** — whether it's landing their dream job, becoming a crypto whale, or just waking up early for once.

Think of it as your **on-chain dream board** — but lightweight, clean, and dopamine-friendly.

---

## 💡 Inspiration

In a digital world full of task managers and productivity tools, **Manifest It** dares to be personal. This project started with a simple idea:

> "What if your hopes and goals were treated like treasures — not just checkboxes?"

We believe there's power in writing things down — but even more in seeing them evolve.

---

## 🧠 Core Concepts

- **Manifestations** — These are the user's declarations or desires, created with intent.
- **Progress States** — Dream → Working On It → Done → Archived
- **Daily Intent** — A morning prompt that asks: *What are you manifesting today?*
- **Energy Meter** — A visual indicator of your consistency and passion.
- **Fun Feedback Loop** — With emojis, colors, and micro-interactions that make progress feel rewarding.
- **Simple, Minimal UI** — Inspired by Web3 dashboards, with no clutter and all soul.

---

## 🏁 Goal

Build a **working MVP** of Manifest It that:

- ✅ Allows users to write, track, and update their manifestations
- ✅ Provides emotional engagement via progress and feedback
- ✅ Feels personal, elegant, and aesthetically unique
- ✅ Can be used as a daily tool with zero learning curve

---

## ⚙️ Tech Stack

| Tech            | Purpose                         |
|-----------------|----------------------------------|
| Next.js         | Core Framework (App Router)      |
| MiniKit         | Coinbase Mini App Framework      |
| OnchainKit      | Web3 wallet integration         |
| Tailwind CSS    | Beautiful utility-first styling  |
| TypeScript      | Safety and developer experience  |
| Zustand         | Lightweight global state         |

---

## 📦 Features

- 📝 Create, update, delete manifestations
- 📊 Dashboard summary: Total Manifestations, Progress Meter, Daily Energy
- 🔄 Move manifestations through different states (from Dream to Done)
- 🧘‍♀️ Daily prompt for intention setting
- 🎉 Subtle animations and emoji-based feedback for dopamine hits
- 🌗 Light & Dark mode (Web3-style)
- 🛠 Future-ready: Easy to integrate with wallets or NFTs

---

## 🔥 Why This Matters

There are productivity tools.  
There are to-do apps.  
There are goal trackers.  

**But Manifest It is for your soul.**

It's the *vibes-first*, minimalist tool that doesn't nag you — it empowers you.

---

## 👤 Creator

Developed solo by:

**Jazz Michael Nase**  
Full-stack developer, artist of the keyboard, and believer in the power of intention.

🔗 Twitter / X: [@jazzmichaelnase](https://twitter.com/jazzmichaelnase)  
📍 Built in the Philippines 🇵🇭

---

## 📅 Submission

🎯 Submitted for the [**Campus Mini App Challenge**](https://basedgigs.com/listing/mini-app-challenge)  
🗓️ August 2025  
🎓 Student-initiated, solo-developed  
🚀 Minimal but powerful

---

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Install additional packages for manifestation features:
```bash
npm install zustand
```

3. Verify environment variables (set up by `npx create-onchain --mini`):

```bash
# Shared/OnchainKit variables
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_ICON_URL=
NEXT_PUBLIC_ONCHAINKIT_API_KEY=

# Frame metadata
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
NEXT_PUBLIC_APP_ICON=
NEXT_PUBLIC_APP_SUBTITLE=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_APP_SPLASH_IMAGE=
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=
NEXT_PUBLIC_APP_HERO_IMAGE=
NEXT_PUBLIC_APP_TAGLINE=
NEXT_PUBLIC_APP_OG_TITLE=
NEXT_PUBLIC_APP_OG_DESCRIPTION=
NEXT_PUBLIC_APP_OG_IMAGE=

# Redis config
REDIS_URL=
REDIS_TOKEN=
```

4. Start the development server:
```bash
npm run dev
```

## Template Features

### Frame Configuration
- `.well-known/farcaster.json` endpoint configured for Frame metadata and account association
- Frame metadata automatically added to page headers in `layout.tsx`

### Background Notifications
- Redis-backed notification system using Upstash
- Ready-to-use notification endpoints in `api/notify` and `api/webhook`
- Notification client utilities in `lib/notification-client.ts`

### Theming
- Custom theme defined in `theme.css` with OnchainKit variables
- Pixel font integration with Pixelify Sans
- Dark/light mode support through OnchainKit

### MiniKit Provider
The app is wrapped with `MiniKitProvider` in `providers.tsx`, configured with:
- OnchainKit integration
- Access to Frames context
- Sets up Wagmi Connectors
- Sets up Frame SDK listeners
- Applies Safe Area Insets

## 🤝 Acknowledgments

- Inspired by journaling habits, goal-tracking, and the Web3 design language
- Built with help from open-source tools and the MiniKit template
- Big thanks to [BasedGigs](https://basedgigs.com/) for the challenge opportunity

## Learn More

- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit Documentation](https://docs.base.org/builderkits/onchainkit/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)