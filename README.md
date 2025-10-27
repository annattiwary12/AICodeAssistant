# AI Code Assistant

## Overview
An AI-powered developer productivity tool that automatically generates production-ready backend boilerplate code using OpenAI's GPT-5. Developers can specify their entity structure and framework preference, and the system generates complete CRUD APIs, models, routes, and optional Dockerfile, CI/CD pipelines, and Swagger documentation.

## Purpose & Goals
- **Primary Goal**: Enable developers to bootstrap new backend projects in minutes instead of hours
- **Target Frameworks**: Node.js/Express and Spring Boot (Java)
- **Value Proposition**: Generate complete, working code (not placeholders) ready for immediate use
- **User Experience**: Simple form-based interface with real-time code preview and one-click download

## Current State
**Status**: ✅ MVP Complete

The application is fully functional with:
- ✅ Complete frontend UI with framework selector, entity field builder, and code preview
- ✅ OpenAI GPT-5 integration with detailed prompts for production-ready code generation
- ✅ Backend API endpoints with validation and error handling
- ✅ ZIP file download functionality
- ✅ Beautiful, developer-focused UI following design guidelines
- ✅ Comprehensive error states and loading indicators

**Known Limitations**:
- Requires valid OpenAI API key with sufficient quota
- Code generation takes 10-30 seconds depending on complexity
- Currently supports two frameworks (Node.js/Express and Spring Boot)

## Recent Changes


- **Initial Implementation**: Built complete MVP from scratch
  - Created schema definitions for code generation requests/responses
  - Implemented all frontend components (FrameworkSelector, EntityFieldBuilder, CodePreview)
  - Built OpenAI GPT-5 integration with production-ready prompts
  - Added API endpoints for code generation and ZIP download
  - Configured design system with developer-focused aesthetics
  
- **Critical Fixes** (post-architect review):
  - Updated OpenAI prompts to explicitly demand complete, working code instead of placeholders
  - Added validation to download endpoint using Zod schemas
  - Fixed TypeScript errors in storage.ts and Home.tsx

## Project Architecture

### Frontend (`client/src/`)
- **pages/Home.tsx**: Main application page with form and preview
- **components/FrameworkSelector.tsx**: Framework selection cards (Node.js/Express, Spring Boot)
- **components/EntityFieldBuilder.tsx**: Dynamic field builder for entity definition
- **components/CodePreview.tsx**: Tabbed code viewer with file tree and syntax highlighting

### Backend (`server/`)
- **routes.ts**: API endpoints (`/api/generate`, `/api/download`)
- **codeGenerator.ts**: OpenAI GPT-5 integration and prompt engineering
- **openai.ts**: OpenAI client initialization
- **zipGenerator.ts**: ZIP file creation from generated code

### Shared (`shared/`)
- **schema.ts**: TypeScript interfaces and Zod schemas for type safety across frontend/backend

## Tech Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- React Hook Form + Zod for form validation
- Shadcn UI components
- Tailwind CSS with custom design tokens
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- OpenAI API (GPT-5 model)
- Archiver for ZIP generation
- Zod for request/response validation

### AI/ML
- **Model**: GPT-5 (latest OpenAI model, released August 7, 2025)
- **Prompting Strategy**: Detailed, explicit instructions with emphasis on production-ready code
- **Response Format**: Structured JSON with file paths, content, and language metadata

## User Workflow

1. **Select Framework**: Choose between Node.js/Express or Spring Boot
2. **Define Entity**: 
   - Enter entity name (e.g., "User", "Product")
   - Add fields with types (string, number, boolean, date, email, etc.)
3. **Configure Options**:
   - Include Swagger/OpenAPI documentation (default: on)
   - Include Dockerfile (optional)
   - Include GitHub Actions CI/CD (optional)
4. **Generate Code**: Click "Generate Code" button
   - System calls OpenAI GPT-5 with structured prompts
   - Loading state shows "Generating Code..." with spinner
   - Takes 10-30 seconds depending on complexity
5. **Preview Code**: 
   - View generated files in tabbed interface
   - See project structure in file tree
   - Copy individual files to clipboard
6. **Download**: Click "Download ZIP" to get complete project as archive

## API Documentation

### POST /api/generate
Generates backend code using OpenAI GPT-5.

**Request Body**:
```json
{
  "entityName": "Product",
  "fields": [
    { "name": "name", "type": "string" },
    { "name": "price", "type": "number" }
  ],
  "framework": "nodejs-express",
  "includeDocker": false,
  "includeCICD": false,
  "includeSwagger": true
}
```

**Response**:
```json
{
  "files": [
    {
      "path": "models/Product.ts",
      "content": "// Complete TypeScript code",
      "language": "typescript"
    },
    ...
  ],
  "projectName": "product-nodejs-express",
  "framework": "nodejs-express"
}
```

### POST /api/download
Creates and downloads a ZIP file from generated code.

**Request Body**: CodeGenerationResponse object

**Response**: Binary ZIP file with Content-Disposition header

## Environment Variables

- `OPENAI_API_KEY`: Required for GPT-5 API access
- `SESSION_SECRET`: Used for Express session management
- `NODE_ENV`: Set to "development" for local development

## Design Philosophy

### Visual Design
- **Developer-First Aesthetic**: Clean, technical interface inspired by VS Code and Linear
- **Typography**: Inter for UI text, JetBrains Mono for code
- **Color Scheme**: Neutral grays with blue accents, supports light/dark mode
- **Spacing**: Consistent 6-8px grid system
- **Components**: Shadcn UI for professional, accessible components

### Code Quality
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Validation**: Zod schemas enforce data contracts at runtime
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Clear feedback during async operations
- **Accessibility**: data-testid attributes on all interactive elements

## Future Enhancements

### Phase 2 (Next Steps)
- Add LangChain integration for advanced prompt orchestration
- Implement code validation and syntax checking post-processing
- Expand framework support (Django, Flask, FastAPI, Laravel)
- Create project history with regeneration capabilities
- Add code explanation feature
- Support for database schema generation

### Performance Optimizations
- Cache common code patterns
- Implement streaming responses for large codebases
- Add progress indicators for multi-file generation

### Developer Experience
- CLI tool for local code generation
- VS Code extension
- Template marketplace for common patterns
- Custom framework/template support

## Troubleshooting

### OpenAI API Quota Errors (HTTP 429)
**Symptom**: Code generation fails with "insufficient_quota" error

**Solution**: 
1. Check OpenAI account billing at https://platform.openai.com/account/billing
2. Add payment method or increase quota limits
3. Verify API key has sufficient credits

### Code Generation Returns Placeholders
**Fixed**: Prompts now explicitly demand complete, working code. If this occurs:
1. Check OpenAI model is "gpt-5"
2. Verify prompt templates in `server/codeGenerator.ts` include "CRITICAL" instructions
3. Review response parsing in `generateBackendCode` function

### ZIP Download Fails
**Causes**:
- Invalid file structure in response
- Missing required fields (projectName, files array)

**Solution**: Backend now validates download requests with Zod schema before ZIP creation

## Testing Strategy

- **Manual Testing**: Form submission, code preview, download workflow
- **E2E Testing**: Playwright tests for complete user journeys
- **API Testing**: Request/response validation for both endpoints
- **Error Testing**: Invalid inputs, API failures, network errors

## Deployment Notes


1. Ensure OPENAI_API_KEY secret is configured
2. Application runs on port 5000 (already configured)
3. Both frontend and backend are served from single Express server
4. No additional environment configuration needed

## Credits

- **AI Model**: OpenAI GPT-5
- **UI Framework**: React + Shadcn UI
- **Design System**: Custom developer-focused theme
- **Icons**: Lucide React + React Icons

---<img width="959" height="662" alt="image" src="https://github.com/user-attachments/assets/0187cf53-440e-409f-b84d-04c103da5eaa" />



