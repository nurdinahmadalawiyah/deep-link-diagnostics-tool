# 📱 Deep Link Diagnostics

![Screenshot](./public/Screenshot%202026-05-24%20162132.png)

Deep Link Diagnostics is a modern, beautifully designed **Next.js Single Page Application (SPA)** that helps mobile developers instantly validate their server-side configurations for **iOS Universal Links** (`apple-app-site-association`) and **Android App Links** (`assetlinks.json`).

Crafted with a sleek, glassmorphic UI, it eliminates the guesswork out of configuring your deep links by parsing raw files directly from your domain, validating them against official schemas, and cross-checking them via Apple CDN and Google API.

---

## ✨ Features

- **🚀 Instant Validation:** Check your `.well-known` configuration files in milliseconds.
- **🍎 Apple CDN & 🤖 Google API Checking:** Automatically pings Apple's CDN and Google's Digital Asset Links API to verify if the bots have crawled and cached your configuration files.
- **🔍 Granular Platform Control:** Choose to validate only iOS, only Android, or both seamlessly.
- **📊 Detailed Report Cards:** Clean, interactive UI providing status messages, success/error states, and the raw parsed JSON response.
- **🧪 Local Path Tester:** Automatically generates ready-to-copy CLI commands (`xcrun` for iOS, `adb` for Android) allowing you to test specific paths directly on your local emulators.
- **🎨 Premium Dark UI:** Built with Tailwind CSS, featuring glassmorphism, fluid micro-animations, and dynamic status banners.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript
- **Validation:** JSON Schema checks (handling structural validity of App Links and Universal Links)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone this repository to your local machine.
2. Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to start validating your domains.

## 💡 How It Works

1. Enter your domain (e.g., `api.example.com`).
2. Toggle the platforms you want to validate using the beautifully crafted pill buttons.
3. The tool bypasses CORS restrictions by utilizing a Next.js API route (`/api/validate`) as a proxy.
4. It fetches your `.well-known` files and instantly compares them against official Apple and Google formats.
5. Review the generated reports, swap tabs to see what the official CDNs see, and use the Local Path Tester to generate ADB/xcrun commands!

## 👨‍💻 Author

Crafted with ♥ by [Nurdin Ahmad Alawiyah](https://github.com/nurdinahmadalawiyah).

## 📄 License

This project is licensed under the MIT License.
