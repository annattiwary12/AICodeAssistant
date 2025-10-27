# AI Code Assistant

## Overview

AI Code Assistant is a web-based developer productivity tool that generates production-ready backend boilerplate code using AI. Users can define entities with fields, select a framework (Node.js/Express or Spring Boot), and receive complete CRUD APIs, models, and documentation. The application allows users to preview the generated code and download it as a ZIP file. The interface is designed with a developer-first approach, drawing inspiration from Linear's clean aesthetics and VS Code's code-editor conventions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side router)
- **State Management:** TanStack Query (React Query) v5 for server state
- **Forms:** React Hook Form with Zod validation
- **UI Components:** Radix UI primitives with shadcn/ui design system
- **Styling:** Tailwind CSS with custom design tokens

**Design System:**
The application uses a comprehensive design system based on shadcn/ui with customized tokens for spacing, colors, and typography. The design follows a "Design System-Inspired" approach combining Linear, VS Code, and GitHub patterns. Key design principles include developer-first interface, clarity over decoration, and technical precision with monospace fonts for code display.

**Component Structure:**
- Form-based entity configuration with dynamic field builder
- Framework selection cards with visual indicators
- Code preview with syntax highlighting and file tree organization
- Tabbed interface for viewing multiple generated files

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Build Tool:** esbuild for production builds
- **Development:** tsx for TypeScript execution
- **AI Integration:** OpenAI GPT-5 API for code generation

**API Design:**
The backend exposes a RESTful API with two main endpoints:

1. **POST /api/generate** - Accepts entity configuration and returns generated code files
   - Validates request using Zod schemas
   - Calls OpenAI API with structured prompts
   - Returns array of files with path, content, and language metadata

2. **POST /api/download** - Accepts generated code response and returns ZIP archive
   - Uses Archiver library to create in-memory ZIP
   - Includes all generated files plus README

**Code Generation Strategy:**
The application uses a prompt engineering approach where:
- System prompts establish the AI as an expert backend developer
- User prompts are dynamically constructed based on framework selection
- Response format is constrained to JSON for structured output
- Maximum token limit set to 8192 for comprehensive code generation

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using a Map-based implementation (MemStorage class)
- User data structure defined but not actively used in current flow
- No persistent database required for core code generation functionality

**Database Schema (Prepared but Unused):**
- Drizzle ORM configured for PostgreSQL
- Schema location: `shared/schema.ts`
- Migration output directory: `./migrations`
- Database connection via `@neondatabase/serverless` driver

**Rationale:** The application is stateless for code generation - each request is independent and doesn't require persistent storage. User management infrastructure is scaffolded but not implemented, suggesting future authentication features.

### External Dependencies

**AI Service:**
- **OpenAI API (GPT-5)** - Core code generation engine
  - Model: "gpt-5" (configured in codeGenerator.ts and openai.ts)
  - Response format: JSON objects for structured file output
  - Authentication via OPENAI_API_KEY environment variable

**Database (Configured but Optional):**
- **Neon PostgreSQL** - Serverless PostgreSQL platform
  - Connection via @neondatabase/serverless driver
  - Configured through DATABASE_URL environment variable
  - Used with Drizzle ORM for schema management

**UI Component Library:**
- **Radix UI** - Unstyled, accessible UI primitives
  - Comprehensive set of 25+ components (accordion, dialog, dropdown, etc.)
  - Provides accessibility features out of the box
  - Customized with Tailwind CSS styling

**Styling and Fonts:**
- **Google Fonts** - Inter (UI text) and JetBrains Mono (code display)
- **Tailwind CSS** - Utility-first CSS framework with custom configuration

**Development Tools (Replit-specific):**
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Development tooling
- **@replit/vite-plugin-dev-banner** - Development environment indicators

**Build and Development:**
- **Vite** - Frontend build tool and development server
- **esbuild** - Backend bundler for production builds
- **tsx** - TypeScript execution for development server

**Archive Generation:**
- **Archiver** - ZIP file creation for downloadable code packages