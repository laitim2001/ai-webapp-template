# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **AI Web App Template** - a production-ready Next.js 14 full-stack application template with enterprise-grade monitoring, multi-database support, complete UI design system, and intelligent CLI tooling. Extracted and optimized from the AI Sales Enablement Platform project.

**Version**: 5.0
**GitHub**: https://github.com/laitim2001/ai-webapp-template

## Initialization Workflow

This is a **template repository** - the main workflow is initializing new projects, NOT direct development:

### Primary Command
```bash
node init-project.js
```

This interactive CLI guides users through:
1. **Project Info** - Name, description, author
2. **Database Selection** - PostgreSQL/MySQL/MongoDB/SQLite
3. **Module Selection** - Choose from 14+ optional modules
4. **Monitoring Config** - Prometheus/Azure Monitor/Both
5. **Environment Setup** - Database URLs, API keys, secrets
6. **Example Data** - Optional seed data and sample logs
7. **Dependency Install** - Automatic npm install
8. **Database Init** - Prisma generate + migrate/push

### Initialization Process
- Copies appropriate Prisma schema from `01-base/prisma/schema.{dbtype}.prisma` → `prisma/schema.prisma`
- Copies selected modules from `02-modules/` to project root
- Generates config files from `.template` files with placeholder replacement
- Generates `.env.local` with all environment variables
- Runs `npm install`, `prisma generate`, and database migrations
- Optional: Seeds database and generates sample logs

## Architecture

### Multi-Database Abstraction Layer

**Database Adapters** (`01-base/lib/db/`):
- `database-adapter.ts` - Unified interface for all databases
- `postgresql-adapter.ts` - PostgreSQL implementation
- `mysql-adapter.ts` - MySQL implementation
- `mongodb-adapter.ts` - MongoDB implementation with special handling
- `sqlite-adapter.ts` - SQLite implementation

**Prisma Schemas** (`01-base/prisma/`):
- Separate schema files for each database type
- Template file `schema.prisma.template` for reference
- CLI selects and copies appropriate schema during initialization

### Template System

**All configuration files use `.template` suffix**:
- Placeholder format: `{{VARIABLE_NAME}}`
- Common placeholders: `{{PROJECT_NAME}}`, `{{DATABASE_TYPE}}`, `{{AUTHOR}}`
- CLI function `replacePlaceholders()` performs substitution during init

**Key Templates**:
- `01-base/package.json.template` - Dependencies and scripts
- `01-base/next.config.js.template` - Next.js configuration
- `01-base/tsconfig.json.template` - TypeScript configuration
- `01-base/tailwind.config.js.template` - Tailwind CSS theme
- `01-base/env.template` - Environment variables reference

### Module System

**14 Optional Modules** (`02-modules/`):
- `module-auth/` - JWT authentication + Azure AD SSO (2,500+ lines)
- `module-api-gateway/` - 10 enterprise middlewares (4,884 lines)
- `module-knowledge-base/` - Vector search + versioning (8,000+ lines)
- `module-search/` - Multi-algorithm vector search (2,800+ lines)
- `module-ai-integration/` - Azure OpenAI wrapper (3,000+ lines)
- `module-workflow/` - 12-state workflow engine (2,035 lines)
- `module-notification/` - Multi-channel notifications (1,550 lines)
- `module-cache/` - Redis dual-layer caching (1,500+ lines)
- `module-template/` - Handlebars template engine (1,150 lines)
- `module-pdf/` - PDF generation with Puppeteer (640 lines)
- `module-parsers/` - PDF/Word/Excel/OCR parsing (1,280 lines)
- `module-dynamics365/` - Dynamics 365 integration (1,200+ lines)
- `module-customer360/` - Customer 360 view (800+ lines)
- `module-performance/` - Performance monitoring service

Each module is self-contained and copies into project during initialization.

### Enterprise Monitoring Stack

**OpenTelemetry-based abstraction** (`00-monitoring/`):
- Vendor-neutral design - switch backends in 5-10 minutes
- **Prometheus + Grafana** - Local deployment, full control
- **Azure Monitor** - Cloud-hosted, zero maintenance
- **Console** - Development/testing output
- 46 alert rules (P1-P4 severity levels)
- 4 pre-built Grafana dashboards
- 12 business metric categories auto-tracked

## Development Commands

### Template Maintenance (This Repo)
```bash
# No typical development here - this is a template
# Changes go in 01-base/, 02-modules/, or examples/

# Test initialization flow
node init-project.js

# Verify template structure
ls 01-base/
ls 02-modules/
```

### Generated Project Commands
```bash
# After initialization, users run these in their new project:

npm run dev              # Development server (localhost:3000)
npm run build            # Production build
npm start                # Production server

npm run lint             # ESLint code checking
npm run test             # Jest unit tests
npm run test:e2e         # Playwright E2E tests

# Prisma/Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Database GUI
npm run db:seed          # Seed example data

# Monitoring (if module selected)
npm run monitoring:start # Start Prometheus/Grafana (Docker)
npm run monitoring:stop  # Stop monitoring stack
npm run monitoring:logs  # View monitoring logs

# Health & Utilities
npm run health-check     # System health check
npm run check-index      # Verify index synchronization
```

## Database Strategy

### Selection Logic
1. **PostgreSQL** (Recommended) - Full features, pgvector support for vector search
2. **MySQL** - Widely used, high performance, no vector search
3. **MongoDB** - NoSQL flexibility, special adapter handling required
4. **SQLite** - Zero config, development/testing only, NOT for production

### Connection Strings
```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# MongoDB
DATABASE_URL="mongodb://user:password@localhost:27017/dbname"

# SQLite
DATABASE_URL="file:./dev.db"
```

### Migration Strategy
- PostgreSQL/MySQL/SQLite: `prisma migrate dev`
- MongoDB: `prisma db push` (no migrations, schema-less)

## UI Design System

**Complete design system** (`04-ui-design-system/`):

### Color System
- CSS variables for theming (`--primary`, `--secondary`, etc.)
- Dark mode support
- 9 semantic colors (primary, secondary, destructive, muted, accent, etc.)

### Typography
- Inter font family
- 5 heading levels with defined sizes
- Consistent line heights and weights

### Spacing
- 8px grid system
- Tailwind spacing scale

### Animations
- 20+ pre-defined animations
- Fade, slide, scale, rotate, bounce effects
- Smooth transitions throughout

### Components
- 20+ UI components in `01-base/components/ui/`
- Built with Radix UI primitives
- Fully styled with Tailwind CSS

### Responsive Breakpoints
```javascript
xs: '475px',   // Small phones
sm: '640px',   // Phones
md: '768px',   // Tablets
lg: '1024px',  // Small laptops
xl: '1280px',  // Desktops
2xl: '1536px'  // Large screens
```

## File Structure (Generated Projects)

```
{project-name}/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── (auth)/            # Auth pages (route group)
│
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── [feature]/        # Feature components
│
├── lib/                  # Core utilities
│   ├── db/              # Database adapters
│   ├── utils.ts         # General utilities
│   └── [feature]/       # Feature utilities
│
├── types/               # TypeScript types
├── hooks/               # Custom React hooks
├── prisma/              # Database schema & migrations
└── public/              # Static assets
```

## Key Technologies

**Framework**:
- Next.js 14 (App Router, Server Actions)
- React 18
- TypeScript 5 (strict mode)

**Styling**:
- Tailwind CSS 3 with custom theme
- Radix UI components
- Lucide React icons

**Database**:
- Prisma ORM
- Support for PostgreSQL, MySQL, MongoDB, SQLite

**Monitoring** (optional):
- OpenTelemetry
- Prometheus + Grafana (local) OR Azure Monitor (cloud)

**Testing** (optional):
- Jest (120+ unit tests)
- Playwright (E2E tests)

**Authentication** (optional module):
- NextAuth.js
- JWT dual-token system
- Azure AD SSO integration

**AI Integration** (optional module):
- Azure OpenAI wrapper
- OpenAI SDK compatibility

## Important Patterns

### Template File Processing
When working with `.template` files:
1. Never modify templates directly in user projects
2. All templates live in `01-base/`, `02-modules/`
3. CLI copies and replaces `{{PLACEHOLDERS}}` during init
4. Template changes should be made in this repo, not generated projects

### Database Adapter Pattern
All database operations go through adapter layer:
```typescript
// Good - uses adapter abstraction
import { databaseAdapter } from '@/lib/db/database-adapter';
const users = await databaseAdapter.findMany('users', { where: { active: true }});

// Bad - direct Prisma access bypasses abstraction
import { prisma } from '@/lib/prisma';
const users = await prisma.user.findMany({ where: { active: true }});
```

### Environment Variables
- Never commit `.env.local` or `.env`
- Use `env.template` as reference for required variables
- CLI generates `.env.local` during initialization
- Critical vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, API keys

### Module Integration
- Modules are designed to be independent
- Some modules have dependencies (e.g., knowledge-base requires search)
- CLI handles module dependencies during selection
- Each module brings its own components, utils, types

## Testing Strategy

**Unit Tests** (Jest):
- Located in `__tests__/` directories
- Test utilities, helpers, pure functions
- Run with `npm test`

**E2E Tests** (Playwright):
- Located in `tests/` or `e2e/`
- Test user flows, integrations
- Run with `npm run test:e2e`

**120+ tests included** when testing module selected.

## Common Workflows

### Adding a New Module to Template
1. Create module in `02-modules/module-{name}/`
2. Include all necessary files (components, lib, types, docs)
3. Create migration files if database changes needed
4. Update `MODULE_OPTIONS` in `init-project.js`
5. Handle dependencies in module selection logic
6. Test initialization with new module

### Supporting New Database Type
1. Create `schema.{dbtype}.prisma` in `01-base/prisma/`
2. Create `{dbtype}-adapter.ts` in `01-base/lib/db/`
3. Implement adapter interface methods
4. Add to `DATABASE_OPTIONS` in `init-project.js`
5. Update database adapter to load new adapter
6. Test initialization and migrations

### Updating Core Template
1. Make changes in `01-base/` directory
2. Update `.template` files, not direct files
3. Test with `node init-project.js`
4. Verify placeholder replacement works
5. Update documentation if needed

## Documentation Structure

**Core Docs** (`01-base/docs/`):
- `UI-DESIGN-SYSTEM.md` - Design system reference
- `ANIMATION-GUIDE.md` - Animation system
- `RESPONSIVE-DESIGN-GUIDE.md` - Responsive patterns
- Component-specific docs in `components/`

**Project Docs** (generated):
- `AI-ASSISTANT-GUIDE.md` - Guide for AI assistants
- `PROJECT-INDEX.md` - Project navigation
- `DEVELOPMENT-LOG.md` - Development journal
- `FIXLOG.md` - Bug tracking

## Naming Conventions

**Files**:
- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Pages: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- Types: `kebab-case.ts` (e.g., `user-types.ts`)

**Code**:
- Constants: `UPPER_SNAKE_CASE`
- Variables/Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Private variables: prefix with `_`

## Performance Considerations

- Next.js App Router enables automatic code splitting
- Server Components by default (use 'use client' only when needed)
- Image optimization with `next/image`
- Monitoring module tracks performance metrics
- Redis caching module for hot data paths (optional)

## Security Notes

- Environment variables never committed
- JWT secret auto-generated during init (32-byte random)
- Azure AD SSO support for enterprise auth
- API Gateway module includes security middlewares
- Input validation with Zod schemas
- Prisma prevents SQL injection automatically

## Support & Resources

- **Documentation**: `docs/` directory
- **Issues**: https://github.com/laitim2001/ai-webapp-template/issues
- **Discussions**: https://github.com/laitim2001/ai-webapp-template/discussions
- **Original Project**: AI Sales Enablement Platform

## Project Statistics

- **Total Lines**: 39,000+
- **Modules**: 14 optional
- **UI Components**: 20+
- **Tests**: 120+
- **Alert Rules**: 46
- **Supported Databases**: 4
