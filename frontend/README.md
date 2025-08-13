# TicketMaster Frontend

A modern, high-performance project and ticket management application built with Next.js, TypeScript, and cutting-edge web technologies.

## 🚀 Overview

TicketMaster is a comprehensive project management platform that enables teams to efficiently organize projects, track tickets, and manage user assignments. The application features a beautiful, responsive interface with real-time data synchronization and advanced animations for an exceptional user experience.

### Key Features

- **Project Management**: Create, update, and organize projects with detailed descriptions and ticket tracking
- **Ticket System**: Comprehensive ticket management with priority levels, status tracking, and user assignments
- **User Management**: Role-based user system with detailed profiles and activity tracking
- **Real-time Updates**: Optimistic updates and intelligent caching with TanStack Query
- **Authentication**: Secure authentication system with NextAuth.js
- **Responsive Design**: Mobile-first responsive design that works across all devices
- **Advanced Animations**: Smooth, performant animations using Framer Motion
- **Modern UI**: Clean, accessible interface built with Radix UI primitives

## 🛠 Technology Stack

### Core Framework

- **Next.js 15.4.6**: Full-stack React framework chosen for its excellent developer experience, built-in optimizations, and seamless API integration
- **React 19.1.0**: Latest React version with improved performance and developer experience
- **TypeScript**: Provides type safety, better developer experience, and improved code maintainability

### State Management & Data Fetching

- **TanStack React Query 5.84.2**: Industry-leading data fetching and caching solution that provides optimistic updates, background refetching, and intelligent cache management
- **NextAuth.js**: Secure, flexible authentication library with built-in providers and session management

### Styling & UI

- **TailwindCSS 4**: Utility-first CSS framework for rapid, consistent styling and excellent performance
- **Radix UI**: Unstyled, accessible UI primitives that provide excellent accessibility and customization
- **Framer Motion**: Production-ready motion library for fluid animations and interactions
- **Class Variance Authority**: Type-safe utility for creating component variants

### 3D Graphics & Visual Effects

- **React Three Fiber**: React renderer for Three.js, enabling performant 3D graphics
- **React Three Drei**: Essential helpers and abstractions for React Three Fiber

### Development Experience

- **ESLint**: Code quality and consistency enforcement with Next.js optimized configuration
- **Bun**: Ultra-fast JavaScript runtime and package manager for improved development performance

### Why These Technologies?

**Next.js** provides an excellent full-stack development experience with built-in optimizations, server-side rendering, and seamless API integration. The framework's file-based routing and automatic code splitting ensure optimal performance.

**TanStack Query** eliminates the complexity of client-side state management by providing intelligent caching, background updates, and optimistic mutations. This results in a more responsive user experience and reduced server load.

**TailwindCSS** enables rapid development with consistent design patterns while maintaining excellent performance through its purge mechanism and utility-first approach.

**Bun** significantly improves development speed with faster package installation, bundling, and test execution compared to traditional Node.js tooling.

## 📋 Prerequisites

- **Bun** (recommended) or Node.js 18+
- **Backend API**: Ensure the TicketMaster backend is running and accessible

## 🚀 Quick Start

### Installation

We recommend using **Bun** for significantly faster package installation and improved development performance:

```bash
# Clone the repository
git clone <repository-url>
cd ticketmaster-frontend

# Install dependencies with Bun (recommended)
bun install

# Alternative: Install with npm
npm install
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**Security Note**: Generate a strong `NEXTAUTH_SECRET` using:

```bash
openssl rand -base64 32
```

### Development

Start the development server:

```bash
# With Bun (recommended for faster performance)
bun dev

# Alternative: With npm
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Modal, etc.)
│   └── layout.tsx      # Main layout wrapper
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication state management
│   ├── useProjects.ts  # Project data management
│   ├── useTickets.ts   # Ticket data management
│   └── useUsers.ts     # User data management
├── lib/                # Utility libraries
│   ├── apiClient.ts    # HTTP client with authentication
│   └── utils.ts        # Common utility functions
├── pages/              # Next.js pages and API routes
│   ├── api/auth/       # NextAuth configuration
│   ├── projects/       # Project-related pages
│   ├── tickets/        # Ticket-related pages
│   ├── users/          # User-related pages
│   └── index.tsx       # Homepage
├── providers/          # React context providers
│   └── ModalProvider.tsx # Modal state management
├── styles/             # Global styles
│   └── globals.css     # TailwindCSS imports and global styles
└── types/              # TypeScript type definitions
    ├── index.ts        # Application types
    └── next-auth.d.ts  # NextAuth type extensions
```

## 🔗 API Integration

The application integrates with a REST API backend through a centralized `apiClient`. All API calls are managed through custom hooks that provide:

- **Automatic Authentication**: Bearer token injection for authenticated requests
- **Error Handling**: Consistent error handling with user-friendly messages
- **Cache Management**: Intelligent cache invalidation and background updates
- **Optimistic Updates**: Immediate UI updates for better user experience

### Key API Endpoints

- `GET /projects` - Retrieve all projects with tickets
- `POST /projects` - Create new project
- `GET /tickets` - Retrieve all tickets with user information
- `POST /register` - User registration
- `POST /login` - User authentication

## 🎨 Component Architecture

### UI Components

The application uses a layered component architecture:

- **Base Components**: Button, Input, Select, TextArea with consistent styling
- **Card Components**: ProjectCard, TicketCard, UserCard for data display
- **Panel Components**: OpenProjectPanel, OpenTicketPanel for detailed views
- **Modal Components**: AuthModal, CreateModal for user interactions

### State Management Pattern

```typescript
// Example hook usage
const { data: projects, isLoading } = useProjects();
const createProject = useCreateProject();

// Optimistic updates with error handling
const handleCreate = async (projectData) => {
  try {
    await createProject.mutateAsync(projectData);
    toast.success("Project created successfully");
  } catch (error) {
    toast.error("Failed to create project");
  }
};
```

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting with Next.js
- **Image Optimization**: Next.js automatic image optimization
- **Caching Strategy**: Intelligent caching with TanStack Query (5-minute stale time)
- **Bundle Analysis**: Regular bundle size monitoring and optimization
- **Animation Performance**: Hardware-accelerated animations with Framer Motion

## 🧪 Development Workflow

### Code Quality

```bash
# Lint code
bun run lint

```

### Build Verification

```bash
# Test production build locally
bun run build
bun run start
```

## 🌐 Deployment

### Environment Variables for Production

Ensure the following environment variables are configured in your production environment:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

### Deployment Platforms

The application is optimized for deployment on:

- **Vercel**: Native Next.js hosting with automatic optimizations
- **Netlify**: JAMstack deployment with edge functions
- **Docker**: Containerized deployment for custom infrastructure

### Performance Monitoring

Consider implementing:

- **Web Vitals**: Monitor Core Web Vitals for user experience
- **Error Tracking**: Integrate error tracking service (Sentry, Bugsnag)
- **Analytics**: User behavior analytics for product insights

## 🔒 Security Considerations

- **Authentication**: Secure session management with NextAuth.js
- **CSRF Protection**: Built-in CSRF protection with NextAuth.js
- **XSS Prevention**: React's built-in XSS protection
- **Environment Variables**: Sensitive data properly isolated
- **API Security**: Secure API communication with Bearer tokens

## 🤝 Contributing

1. **Fork the repository** and create a feature branch
2. **Follow TypeScript best practices** and maintain type safety
3. **Write meaningful commit messages** following conventional commits
4. **Test thoroughly** including mobile responsiveness
5. **Update documentation** for new features or changes
6. **Submit a pull request** with detailed description

### Development Guidelines

- Use semantic commit messages: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Maintain consistent code formatting with ESLint
- Ensure all TypeScript errors are resolved
- Test responsive design across different screen sizes
- Follow accessibility best practices with Radix UI

## 📞 Support

For questions, issues, or contributions:

- **Issues**: Submit detailed bug reports or feature requests
- **Documentation**: Refer to inline code documentation
- **API Documentation**: Consult backend API documentation for integration details

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
