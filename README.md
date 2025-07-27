# Corporate Hub 🏢

> An intelligent corporate intranet dashboard that feels like having a personal AI assistant helping you stay productive throughout your workday.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)

## 🌟 Features

### 🤖 Intelligent Welcome Experience
- **AI-like messaging system** with natural language reminders and follow-ups
- **Typing animation effect** built without external libraries
- **Auto-rotating messages** every 5 seconds with manual navigation
- **Contextual greetings** based on time of day

### 📰 Smart News Management
- **Responsive news carousel** with mobile-optimized design
- **Dual view modes**: Grid and list layouts
- **Auto-rotation** with pause on hover/focus
- **Accessibility-first** navigation with keyboard support

### 📅 Event Integration
- **Seamless calendar integration** with smart notifications
- **Upcoming events display** with time-aware messaging
- **Event details modal** with comprehensive information

### 👥 Team Discovery
- **New hires showcase** with detailed employee profiles
- **Interactive employee cards** with modal details
- **Department and role filtering**

### 🚀 Application Launcher
- **3x3 grid layout** for quick access to corporate tools
- **External application integration**
- **Categorized organization** for better discoverability

### 🔗 Smart Quick Links
- **Categorized resource organization**
- **External link handling** with proper security
- **Slack-inspired compact design**

### 🎨 Design System
- **Complete dark mode support** with user preference persistence
- **Responsive design** optimized for all screen sizes
- **Consistent component library** with Tailwind CSS
- **Accessibility compliance** (WCAG 2.1 AA)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gardogit/OfficeSpace.git
   cd OfficeSpace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## 🏗️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Hooks with Context API
- **Testing**: Vitest with React Testing Library
- **Accessibility**: jest-axe for automated accessibility testing
- **Performance**: Lazy loading, code splitting, and React.memo optimization

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (ErrorBoundary, Loading, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   └── ui/              # Base UI components (Button, Card, etc.)
├── contexts/            # React contexts (Theme, etc.)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── data/                # Mock data and constants
├── styles/              # Global styles and Tailwind config
└── test/                # Test files and utilities
```

## 🎯 Key Components

### WelcomeHero
The intelligent welcome component that provides contextual messaging:

```typescript
// Natural language messaging with typing animation
const messages = [
  "Recuerda revisar la propuesta del cliente que quedó pendiente ayer.",
  "El equipo de diseño está esperando tu feedback sobre los mockups.",
  "La documentación técnica vence mañana, ¿ya tienes todo listo?"
];
```

### NewsCarousel
Mobile-optimized news carousel with responsive design:

```typescript
// Responsive behavior
- Desktop: Full navigation with position indicators
- Mobile: Clean interface with edge-to-edge images
```

### Responsive Layout System
Adaptive layout that works across all devices:

```typescript
// Unified navbar with expandable search
// Sidebar with mobile overlay functionality
// Grid-based content organization
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Environment Setup

The project uses Vite for development with the following configuration:
- Hot Module Replacement (HMR)
- TypeScript support
- Path aliases for clean imports
- Optimized build with code splitting

## ♿ Accessibility

Corporate Hub is built with accessibility as a first-class citizen:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Comprehensive ARIA labels and live regions
- **Focus Management**: Proper focus handling and skip links
- **Color Contrast**: WCAG 2.1 AA compliant color schemes
- **Responsive Design**: Works across all devices and screen sizes

## 🚀 Performance

- **Lazy Loading**: Components are loaded on-demand
- **Code Splitting**: Automatic bundle splitting for optimal loading
- **Memoization**: React.memo and useMemo for preventing unnecessary re-renders
- **Optimized Images**: Responsive images with proper loading strategies
- **Bundle Analysis**: Optimized chunk sizes for faster loading

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Full user flow testing
- **Accessibility Tests**: Automated accessibility compliance testing
- **Responsive Tests**: Cross-device compatibility testing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm run test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [@gardogit](https://github.com/gardogit)
- **Developer**: [@jonathanbc10](https://github.com/jonathanbc10)

## 🙏 Acknowledgments

- Built for the [Frontend Challenge: Office Edition](https://dev.to/challenges/frontend/axero) sponsored by Axero
- Inspired by modern workplace collaboration tools
- Thanks to the open source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need help getting started:

- 🐛 Issues: [GitHub Issues](https://github.com/gardogit/OfficeSpace/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/gardogit/OfficeSpace/discussions)

---

**Corporate Hub** - Making workplace software more intelligent, accessible, and genuinely helpful. 🚀