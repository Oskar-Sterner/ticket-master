# TicketMaster - Fullstack Project Management Platform

A comprehensive, high-performance project and ticket management platform featuring a modern React frontend and a scalable Node.js backend. This enterprise-grade application enables teams to efficiently organize projects, track tickets, and manage user assignments with real-time synchronization and advanced user experience features.

## Overview

TicketMaster is a complete fullstack solution that combines a responsive, feature-rich frontend built with Next.js and a high-performance backend API powered by Fastify. The application delivers exceptional user experience through modern web technologies while maintaining enterprise-level security, performance, and scalability.

## Documentation Structure

This README provides a comprehensive overview of the complete TicketMaster platform. For detailed component-specific documentation, development workflows, and technical implementation guides, please refer to the individual README files located in each component directory:

**Frontend Documentation**: [frontend/README.md](./frontend/README.md) - Contains detailed React development workflows, component architecture, UI implementation guides, and frontend-specific deployment procedures.

**Backend Documentation**: [backend/README.md](./backend/README.md) - Provides comprehensive API documentation, database schema details, service configuration guides, and backend deployment procedures.

### Cross-Platform Application Startup

For streamlined development workflow, the project includes a `start.sh` script that automatically builds and starts both frontend and backend services simultaneously. This script provides a unified startup experience across different operating systems.

#### Running on macOS and Linux

macOS and Linux systems provide native support for shell scripts through their Unix-based foundations. To execute the startup script, navigate to the project root directory and ensure the script has executable permissions.

```bash
chmod +x start.sh
./start.sh
```

The script will automatically navigate to both the backend and frontend directories, execute the build process for each component, and start both services concurrently. Both services will run in parallel, allowing for immediate development workflow initiation.

#### Running on Windows

Windows systems require additional considerations due to the lack of native shell script support. Several effective approaches are available depending on your development environment configuration.

**Windows Subsystem for Linux (WSL) - Recommended**

The most comprehensive solution utilizes Windows Subsystem for Linux, which provides full compatibility with Unix shell scripts. Install WSL through PowerShell with administrator privileges using `wsl --install`, then execute the script within the Linux subsystem environment.

```bash
# Within WSL terminal
chmod +x start.sh
./start.sh
```

**Git Bash Alternative**

If Git for Windows is installed, Git Bash provides a lightweight Unix-like terminal environment. Launch Git Bash, navigate to the project directory, and execute the script using standard Unix commands.

```bash
# Within Git Bash terminal
chmod +x start.sh
./start.sh
```

**PowerShell Script Alternative**

For environments where Unix-like shells are not available, consider creating a PowerShell equivalent script (.ps1) that performs the same build and startup operations using Windows-native commands. This approach eliminates external dependencies while maintaining the automated startup workflow.

#### Manual Development Server Startup

For developers who prefer granular control over the startup process or require debug mode functionality, the services can be initiated manually in separate terminal sessions. This approach provides enhanced debugging capabilities and allows for independent service management.

Navigate to each directory individually and execute the development commands. Begin by ensuring all dependencies are properly installed in both directories, then start each service in debug mode for comprehensive development monitoring.

```bash
# Backend setup and startup
cd backend
bun install
bun run dev

# In a separate terminal session - Frontend setup and startup
cd frontend
bun install
bun run dev
```

This manual approach enables independent service restart capabilities, detailed error monitoring for each component, and enhanced debugging through separate console outputs. The debug mode provides comprehensive logging and hot reload functionality for optimal development experience.

#### Script Termination

The startup script runs both services concurrently and remains active until manually terminated. Press `Ctrl+C` to gracefully stop both frontend and backend services simultaneously. The script includes proper cleanup procedures to ensure all processes are terminated correctly. When using the manual startup approach, each service must be terminated independently in their respective terminal sessions.
