# DevToolKit 🛠️

[![CI](https://github.com/adieska/DevToolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/adieska/DevToolkit/actions/workflows/ci.yml)

**DevToolKit** is a high-performance, professional-grade workstation for developers, featuring over 300 essential tools for day-to-day coding tasks. From cryptography and encoding to image processing and networking, everything is processed locally in your browser for maximum privacy and speed.

![DevToolKit Preview](https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

- **300+ Specialized Tools**: Formatter, Encoders, Converters, Generators, and more.
- **Privacy First**: All data processing happens on the client-side. No server uploads.
- **Professional Workstation UI**:
  - **Theming**: Deep Slate, Midnight Indigo, and Carbon Black.
  - **Layout Density**: Relaxed and Compact modes for different screen sizes.
- **Personal Workspace**:
  - Favorite tools saved locally in the browser.
  - Recently used tools available from the sidebar.
  - Theme, density, favorites, and recent tools persist across reloads.
  - Clear Local Data resets the workspace to factory defaults.
- **Smart Search**: Find tools instantly with keyboard-friendly navigation.
- **Keyboard Workflow**: Press `Ctrl/Cmd+K` or `/` to focus search instantly.
- **Real-time Feedback**: Live preview for QR codes, JWT decoding, and math calculations.
- **Optimized Loading**: Tool categories and secondary pages are loaded on demand to keep the initial bundle fast.
- **Offline Ready**: Installable as a PWA with cached application assets and automatic service worker updates.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/devtoolkit.git

# Navigate to the project
cd devtoolkit

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Testing
```bash
npm test
npm run test:e2e
npm run lint
npm run build
```

The test suite covers workspace persistence helpers, favorite tools, recent tool history, lazy-loaded tools, the main browser workflow, mobile rendering, and critical accessibility violations.

Every push to `main` and pull request is validated by GitHub Actions with the same unit test, browser test, typecheck, and production build commands.
Production dependencies are also checked with `npm audit` in CI.

## 🛠️ Built With

- **React 19** - UI Logic
- **Vite** - Build System
- **Tailwind CSS** - Styling
- **Lucide React** - Iconography
- **Motion (framer-motion)** - Fluid Animations
- **TypeScript** - Type Safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
