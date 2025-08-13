# Ticket Tracker Backend

A high-performance, production-ready ticketing system backend built with Fastify, TypeScript, and MongoDB. This system provides a comprehensive API for managing projects, tickets, and users with enterprise-grade security, authentication, and performance optimizations.

## Table of Contents

- [Overview](#overview)
- [Why My Technology Stack](#why-our-technology-stack)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance Considerations](#performance-considerations)
- [Security](#security)
- [Contributing](#contributing)

## Overview

The Ticket Tracker Backend is a RESTful API service designed to handle project management and issue tracking workflows. Built with modern Node.js technologies, it offers exceptional performance, scalability, and maintainability for teams of any size.

### Key Metrics

- **Performance**: Up to 40% faster than Express.js-based alternatives
- **Rate Limiting**: 100 requests per second per IP
- **Database**: Optimized MongoDB with strategic indexing
- **Security**: JWT authentication, CORS, Helmet, and input validation
- **Type Safety**: Full TypeScript implementation with strict type checking

## Why My Technology Stack

### Bun Runtime (Recommended)

I strongly recommend using **Bun** as your JavaScript runtime for optimal performance:

- **Speed**: Bun provides up to 3x faster startup times compared to Node.js
- **Memory Efficiency**: Lower memory footprint and better garbage collection
- **Native TypeScript**: Built-in TypeScript support without additional transpilation
- **Package Management**: Integrated package manager that's significantly faster than npm
- **Drop-in Replacement**: Fully compatible with Node.js APIs

### Fastify Framework

**Fastify** was chosen over Express.js for several critical advantages:

- **Performance**: Up to 40% faster request handling than Express.js
- **Schema-based**: Built-in JSON schema validation and serialization
- **Plugin Architecture**: Modular, encapsulated plugin system
- **TypeScript Native**: First-class TypeScript support
- **Async/Await**: Native promise support throughout the framework
- **Logging**: High-performance logging with Pino
- **Validation**: Automatic request/response validation

### MongoDB

MongoDB provides the flexibility and performance needed for modern applications:

- **Document-based**: Natural fit for JavaScript/TypeScript applications
- **Horizontal Scaling**: Built-in support for sharding and replication
- **Aggregation Pipeline**: Powerful data processing capabilities
- **Indexing**: Advanced indexing strategies for optimal query performance

## Features

### Core Functionality

- **Project Management**: Create, update, delete, and organize projects
- **Ticket System**: Comprehensive ticket lifecycle management with priorities and statuses
- **User Management**: User registration, authentication, and profile management
- **Role-based Access**: Secure endpoints with JWT-based authentication

### Performance & Reliability

- **Rate Limiting**: Intelligent rate limiting to prevent abuse
- **Database Optimization**: Strategic indexing and aggregation pipelines
- **Error Handling**: Comprehensive error handling with detailed logging
- **Input Validation**: Automatic request validation using JSON schemas

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt for password security
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Integration**: Security headers and XSS protection
- **Input Sanitization**: Automatic input validation and sanitization

### Developer Experience

- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Clean separation of concerns
- **Comprehensive Logging**: Structured logging with Pino
- **Development Tools**: Hot reload and debugging support

## System Architecture

The application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │   Data Layer    │
│                 │    │                 │    │                 │
│ • HTTP Handlers │──▶│ • Business Logic│──▶ │ • MongoDB       │
│ • Request/Reply │    │ • Validation    │    │ • Collections   │
│ • Route Binding │    │ • Data Transform│    │ • Aggregations  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌───────────────────┐
│   Middleware    │    │     Plugins     │    │   Utilities       │
│                 │    │                 │    │                   │
│ • Rate Limiting │    │ • Authentication│    │ • Error Handler   │
│ • CORS          │    │ • Database Conn │    │ • Type Definitions│
│ • Helmet        │    │ • JWT Management│    │ • Custom Errors   │
└─────────────────┘    └─────────────────┘    └───────────────────┘
```

### Data Flow Architecture

```
Client Request ──▶ Rate Limiter ──▶ CORS ──▶ Helmet ──▶ Auth (if required)
                                                               │
                                                               ▼
Error Handler ◀── Controller ◀── Service ◀── Database ◀── Route Handler
       │               │             │          │
       ▼               ▼             ▼          ▼
JSON Response    HTTP Status    Data Transform   Query Execution
```

## Quick Start

### Prerequisites

- **Bun** v1.0+ (recommended) or **Node.js** v18+
- **MongoDB** Atlas account or local MongoDB instance
- **TypeScript** knowledge for development

### Installation with Bun (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd ticket-tracker-backend

# Install dependencies with Bun
bun install

# Copy environment configuration
cp .env.example .env

# Configure your environment variables (see Configuration section)
# Edit .env with your MongoDB URI and JWT secret

# Start development server
bun run dev
```

### Installation with Node.js

```bash
# Clone the repository
git clone <repository-url>
cd ticket-tracker-backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure your environment variables
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following configuration:

```bash
# Application Configuration
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jira-ticketing?retryWrites=true&w=majority

# Security Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

### Production Environment

For production deployment, ensure the following environment variables are properly configured:

```bash
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

### MongoDB Configuration

The application automatically configures the following MongoDB settings:

- **Connection Pool**: Maximum 10 connections
- **Timeout Settings**: 30 seconds for connection and server selection
- **Write Concern**: Majority acknowledgment for data durability
- **Retry Logic**: Automatic retry for transient failures

## API Documentation

### Authentication Endpoints

#### POST `/api/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/api/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Project Management

#### GET `/api/projects`

Retrieve all projects with associated tickets.

**Response:**

```json
[
  {
    "_id": "ObjectId",
    "title": "Project Alpha",
    "description": "Main development project",
    "tickets": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST `/api/projects` 🔒

Create a new project (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "title": "New Project",
  "description": "Project description"
}
```

### Ticket Management

#### GET `/api/tickets`

Retrieve all tickets with user information.

#### GET `/api/projects/:projectId/tickets`

Retrieve tickets for a specific project.

#### POST `/api/tickets` 🔒

Create a new ticket (requires authentication).

**Request Body:**

```json
{
  "title": "Bug Fix Required",
  "description": "Detailed description of the issue",
  "priority": "high",
  "projectId": "ObjectId",
  "userId": "ObjectId" // Optional
}
```

### User Management

#### GET `/api/me` 🔒

Get current authenticated user profile.

#### GET `/api/users`

Retrieve all users with their tickets and projects.

## Database Schema

### Collections Overview

#### Users Collection

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string; // Unique index
  password: string; // bcrypt hashed
  createdAt: Date; // Index
  updatedAt: Date;
}
```

#### Projects Collection

```typescript
interface Project {
  _id: ObjectId;
  title: string; // Index
  description: string;
  createdAt: Date; // Index
  updatedAt: Date;
}
```

#### Tickets Collection

```typescript
interface Ticket {
  _id: ObjectId;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical"; // Index
  status: "open" | "in-progress" | "resolved" | "closed"; // Index
  userId?: ObjectId; // Index, Foreign key to users
  projectId: ObjectId; // Index, Foreign key to projects
  createdAt: Date; // Index
  updatedAt: Date;
}
```

### Database Indexes

The application automatically creates the following indexes for optimal performance:

**Users Collection:**

- `{ email: 1 }` (unique)
- `{ createdAt: -1 }`

**Projects Collection:**

- `{ title: 1 }`
- `{ createdAt: -1 }`

**Tickets Collection:**

- `{ projectId: 1 }`
- `{ status: 1 }`
- `{ priority: 1 }`
- `{ userId: 1 }`
- `{ projectId: 1, status: 1 }` (compound)
- `{ createdAt: -1 }`

## Development

### Available Scripts

```bash
# Development with hot reload
bun run dev          # or npm run dev

# Build for production
bun run build        # or npm run build

# Start production server
bun run start        # or npm run start

# Watch mode for development
bun run watch        # or npm run watch
```

### Development Guidelines

#### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data validation
- **Routes**: Define API endpoints and middleware
- **Types**: TypeScript type definitions
- **Utils**: Shared utilities and helpers

#### Error Handling

The application uses a centralized error handling approach:

- **AppError**: Custom error class for operational errors
- **Global Error Handler**: Catches and formats all errors
- **Validation Errors**: Automatic schema validation errors
- **Database Errors**: MongoDB-specific error handling

#### Logging

Structured logging is implemented using Pino:

- **Development**: Pretty-printed logs with colors
- **Production**: JSON-formatted logs for log aggregation
- **Error Tracking**: Comprehensive error logging with stack traces

## Testing

### Running Tests

```bash
# Open Cypress test runner
bun run cypress:open    # or npm run cypress:open

# Run tests in headless mode
bunx cypress run        # or npx cypress run
```

### Test Coverage

The test suite includes:

- **E2E Tests**: Complete workflow testing with Cypress
- **API Testing**: Endpoint validation and error scenarios
- **Authentication Testing**: JWT and session management
- **Database Testing**: Data persistence and retrieval

## Performance Considerations

### Database Optimization

- **Strategic Indexing**: Indexes on frequently queried fields
- **Aggregation Pipelines**: Efficient data joining and transformation
- **Connection Pooling**: Optimized connection management

### Application Performance

- **Rate Limiting**: Prevents API abuse and ensures stability
- **Response Caching**: Appropriate cache headers for static resources
- **Compression**: Automatic response compression for large payloads

### Monitoring Recommendations

- **Database Monitoring**: Track query performance and index usage
- **Application Metrics**: Monitor response times and error rates
- **Resource Usage**: Track memory and CPU utilization

## Security

### Authentication & Authorization

- **JWT Tokens**: Secure, stateless authentication
- **Password Security**: bcrypt hashing with salt
- **Token Expiration**: Configurable token lifetime

### Request Security

- **Input Validation**: JSON schema-based validation
- **Rate Limiting**: Per-IP request throttling
- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: Helmet.js for security headers

### Data Protection

- **Environment Variables**: Sensitive data stored securely
- **Database Security**: Connection string encryption
- **Error Handling**: No sensitive data in error responses

## Deployment

### Production Checklist

1. **Environment Configuration**

   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Generate secure JWT secret
   - Set appropriate CORS origins

2. **Database Setup**

   - Ensure MongoDB Atlas cluster is configured
   - Verify network access and IP whitelisting
   - Check database indexes are created

3. **Security Configuration**

   - Enable all security middleware
   - Configure rate limiting for production load
   - Set up proper CORS policies

4. **Monitoring Setup**
   - Configure application logging
   - Set up error tracking
   - Monitor performance metrics

### Docker Deployment (Recommended)

```dockerfile
FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3001

CMD ["bun", "run", "start"]
```

### Cloud Deployment Options

- **Railway**: Simple deployment with automatic SSL
- **Vercel**: Serverless deployment with edge functions
- **AWS ECS**: Container-based deployment with scaling
- **Google Cloud Run**: Serverless container deployment

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `bun install`
4. Make your changes following the coding standards
5. Add tests for new functionality
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Coding Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standard commit message format

### Pull Request Guidelines

- Ensure all tests pass
- Add appropriate documentation
- Follow the existing code style
- Include detailed description of changes
- Reference related issues

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please:

- Create an issue on GitHub
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ using Fastify, TypeScript, and MongoDB**
