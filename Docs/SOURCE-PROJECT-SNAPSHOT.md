# Source Project Snapshot - AI Sales Enablement Platform

**Generated**: 2025-10-09
**Source**: `C:\ai-sales-enablement-webapp\`
**Purpose**: Complete structural analysis for template extraction

---

## Executive Summary

### Project Statistics (Verified 2025-10-09)
- **Total Production Files**: 476 TypeScript/JavaScript files (excluding POC)
- **Total Production Lines**: 159,215 lines of code
- **POC Files**: 381 files (experimental code - excluded from template)
- **Components**: 114 files across 19 component directories
- **App Routes**: 121 files (pages + API routes)
- **API Route Files**: 82 route.ts files
- **Lib Modules**: 27 distinct modules (125 files)
- **Prisma Models**: 34 database models
- **Unit Tests**: 31 test files
- **E2E Tests**: 17 test files
- **Additional Tests**: 3 test files
- **Documentation Files**: 296 markdown files
- **API Domains**: 23 distinct API domains
- **Monitoring Files**: 7 OpenTelemetry files
- **Middleware Files**: 12 API Gateway files
- **Security Files**: 19 RBAC/encryption files

**Note on POC Directory**: The source project contains a `poc/` directory with 381 files of experimental code (Azure OpenAI tests, Dynamics 365 integration tests, pgvector performance tests, and mock CRM data). This directory is **excluded from the template** as it contains legacy R&D code, not production-ready features. The statistics above reflect only production-ready code suitable for template extraction.

**Verification**: See `SOURCE-PROJECT-VERIFICATION.md` for complete 100% verification details.

---

## 1. Complete Directory Structure

### Root Structure
```
C:\ai-sales-enablement-webapp\
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Auth pages (route group)
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # API Routes (23 domains)
│   ├── dashboard/           # Dashboard pages
│   │   ├── (routes)/
│   │   ├── admin/
│   │   ├── assistant/
│   │   ├── customers/
│   │   ├── knowledge/
│   │   ├── notifications/
│   │   ├── proposals/
│   │   ├── search/
│   │   ├── settings/
│   │   ├── tasks/
│   │   └── templates/
│   ├── auth/
│   └── globals/
│
├── components/              # React Components (31,650 lines)
│   ├── admin/              # Admin dashboard components
│   ├── assistant/          # AI assistant chat components
│   ├── audit/              # Audit log components
│   ├── calendar/           # Calendar integration
│   ├── collaboration/      # Real-time collaboration
│   ├── crm/                # Customer 360 view
│   ├── dashboard/          # Dashboard widgets
│   ├── features/           # Feature-specific components
│   ├── knowledge/          # Knowledge base UI (50+ components)
│   │   ├── analytics/
│   │   └── version/
│   ├── layout/             # Layout components
│   ├── meeting-prep/       # Meeting preparation
│   ├── notifications/      # Notification system
│   ├── permissions/        # Permission management
│   ├── recommendation/     # AI recommendations
│   ├── reminder/           # Reminder system
│   ├── search/             # Advanced search UI
│   ├── ui/                 # Base UI components (23 components)
│   └── workflow/           # Workflow management
│       ├── approval/
│       ├── comments/
│       └── version/
│
├── lib/                    # Core Libraries (100+ files)
│   ├── ai/                 # AI integration (8 files)
│   ├── analytics/          # User behavior tracking (2 files)
│   ├── api/                # API utilities (2 files)
│   ├── auth/               # Authentication (2 files)
│   ├── cache/              # Redis caching (2 files)
│   ├── calendar/           # Calendar sync (3 files)
│   ├── collaboration/      # Edit locking (2 files)
│   ├── db/                 # Database utilities
│   ├── integrations/       # External integrations
│   │   ├── customer-360/
│   │   └── dynamics365/
│   ├── knowledge/          # Knowledge base logic (5 files)
│   ├── meeting/            # Meeting intelligence (3 files)
│   ├── middleware/         # API Gateway (12 files)
│   ├── monitoring/         # OpenTelemetry monitoring (7 files, 2,776 lines)
│   ├── notification/       # Multi-channel notifications (4 files)
│   ├── parsers/            # Document parsers (5 files)
│   ├── pdf/                # PDF generation (3 files)
│   ├── performance/        # Performance optimization (6 files)
│   ├── recommendation/     # Recommendation engine (2 files)
│   ├── reminder/           # Reminder scheduler (3 files)
│   ├── resilience/         # Circuit breaker & retry (6 files)
│   ├── search/             # Vector search (9 files)
│   ├── security/           # RBAC & permissions (11 files)
│   ├── startup/            # Initialization (1 file)
│   ├── template/           # Handlebars templates (3 files)
│   ├── utils/              # General utilities
│   ├── workflow/           # Workflow engine (5 files)
│   └── [root files]/       # Core utilities (7 files, 1,375 lines)
│
├── prisma/                 # Database Schema
│   └── schema.prisma       # 34 models (PostgreSQL)
│
├── monitoring/             # Monitoring Configuration
│   ├── alertmanager/
│   │   └── alertmanager.yml
│   ├── grafana/
│   │   ├── dashboards/     # 4 pre-built dashboards
│   │   │   ├── 01-system-overview.json
│   │   │   ├── 02-api-performance.json
│   │   │   ├── 03-business-metrics.json
│   │   │   └── 04-resource-usage.json
│   │   └── provisioning/
│   │       ├── dashboards/
│   │       └── datasources/
│   └── prometheus/
│       ├── alerts.yml      # 46 alert rules
│       └── prometheus.yml
│
├── __tests__/              # Unit Tests (36 files)
├── e2e/                    # E2E Tests (16 files)
├── docs/                   # Documentation (60+ files)
├── scripts/                # Utility scripts
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
└── hooks/                  # Custom React hooks
```

---

## 2. Package.json Analysis

### Production Dependencies (68 total)

#### Framework Core
- `next`: ^14.2.25
- `react`: ^18.3.0
- `react-dom`: ^18.3.0
- `typescript`: (via devDependencies)

#### Database & ORM
- `@prisma/client`: ^5.17.0
- `pg`: ^8.12.0 (PostgreSQL driver)
- `pgvector`: ^0.1.8 (Vector search extension)

#### Authentication & Identity
- `@azure/msal-node`: ^3.8.0 (Azure AD SSO)
- `@clerk/nextjs`: ^6.33.0 (Auth provider)
- `bcryptjs`: ^2.4.3 (Password hashing)
- `jsonwebtoken`: ^9.0.2 (JWT tokens)
- `jose`: ^5.6.3 (JWT utilities)

#### AI & OpenAI Integration
- `@azure/openai`: ^1.0.0-beta.12
- `openai`: ^4.104.0

#### Azure Services
- `@azure/identity`: ^4.12.0
- `@azure/keyvault-secrets`: ^4.10.0
- `@microsoft/microsoft-graph-client`: ^3.0.7 (Calendar sync)

#### UI Component Libraries
- `@radix-ui/react-alert-dialog`: ^1.1.15
- `@radix-ui/react-avatar`: ^1.1.0
- `@radix-ui/react-checkbox`: ^1.3.3
- `@radix-ui/react-dialog`: ^1.1.15
- `@radix-ui/react-dropdown-menu`: ^2.1.16
- `@radix-ui/react-label`: ^2.1.0
- `@radix-ui/react-popover`: ^1.1.0
- `@radix-ui/react-progress`: ^1.1.7
- `@radix-ui/react-select`: ^2.1.0
- `@radix-ui/react-separator`: ^1.1.0
- `@radix-ui/react-slider`: ^1.3.6
- `@radix-ui/react-slot`: ^1.1.0
- `@radix-ui/react-switch`: ^1.2.6
- `@radix-ui/react-tabs`: ^1.1.0
- `@radix-ui/react-toast`: ^1.2.0

#### Rich Text Editor
- `@tiptap/react`: ^3.6.2
- `@tiptap/starter-kit`: ^3.6.2
- `@tiptap/extension-image`: ^3.6.2
- `@tiptap/extension-link`: ^3.6.2
- `@tiptap/extension-placeholder`: ^3.6.2
- `@tiptap/extension-table`: ^3.6.5
- `@tiptap/extension-table-cell`: ^3.6.5
- `@tiptap/extension-table-header`: ^3.6.5
- `@tiptap/extension-table-row`: ^3.6.5
- `@tiptap/pm`: ^3.6.2

#### State Management & Data Fetching
- `@tanstack/react-query`: ^4.36.1
- `@trpc/client`: ^10.45.0
- `@trpc/next`: ^10.45.0
- `@trpc/react-query`: ^10.45.0
- `@trpc/server`: ^10.45.0

#### Styling & UI Utilities
- `tailwindcss`: (via devDependencies)
- `tailwind-merge`: ^2.4.0
- `tailwindcss-animate`: ^1.0.7
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.1.0
- `lucide-react`: ^0.408.0 (Icon library)
- `@heroicons/react`: ^2.2.0
- `@headlessui/react`: ^2.2.8

#### Caching & Performance
- `ioredis`: ^5.8.0 (Redis client)

#### Document Processing
- `pdf-parse`: ^2.1.1 (PDF parsing)
- `mammoth`: ^1.11.0 (Word document parsing)
- `xlsx`: ^0.18.5 (Excel parsing)
- `tesseract.js`: ^6.0.1 (OCR)
- `puppeteer`: ^24.23.0 (PDF generation)

#### Template Engine
- `handlebars`: ^4.7.8

#### Form Management
- `react-hook-form`: ^7.52.0
- `@hookform/resolvers`: ^3.7.0
- `zod`: ^3.23.0 (Schema validation)

#### File Upload
- `react-dropzone`: ^14.3.8

#### Utilities
- `axios`: ^1.7.0 (HTTP client)
- `date-fns`: ^3.6.0 (Date utilities)
- `dotenv`: ^17.2.2 (Environment variables)
- `cmdk`: ^1.1.1 (Command palette)

### Development Dependencies (23 total)

#### Testing
- `@playwright/test`: ^1.45.0 (E2E testing)
- `@testing-library/react`: ^16.0.0
- `@testing-library/jest-dom`: ^6.4.0
- `@testing-library/user-event`: ^14.5.0
- `@testing-library/dom`: ^10.4.1
- `jest`: ^29.7.0
- `jest-environment-jsdom`: ^29.7.0
- `@types/jest`: ^29.5.0

#### TypeScript Type Definitions
- `@types/node`: ^20.14.0
- `@types/react`: ^18.3.0
- `@types/react-dom`: ^18.3.0
- `@types/bcryptjs`: ^2.4.6
- `@types/handlebars`: ^4.0.40
- `@types/jsonwebtoken`: ^9.0.6
- `@types/lodash`: ^4.17.20
- `@types/pg`: ^8.11.0
- `@types/tar`: ^6.1.13

#### Linting & Code Quality
- `eslint`: ^8.57.0
- `eslint-config-next`: ^14.2.0
- `@typescript-eslint/eslint-plugin`: ^7.16.0
- `@typescript-eslint/parser`: ^7.16.0

#### Build Tools
- `autoprefixer`: ^10.4.0
- `postcss`: ^8.4.0
- `prisma`: ^5.17.0 (Prisma CLI)
- `tsx`: ^4.16.0

#### Load Testing
- `autocannon`: ^7.15.0

#### Utilities
- `cross-env`: ^10.1.0
- `tar`: ^7.5.1

---

## 3. Prisma Schema Analysis

### Database Configuration
- **Provider**: PostgreSQL
- **Extensions**: pgvector (for vector search)
- **Total Models**: 34

### All 34 Prisma Models

#### 1. User Management (1 model)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  role          String    @default("user")
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // Relations to all other models
}
```

#### 2. Customer & CRM (5 models)
```prisma
model Customer { }          # Customer master data
model CustomerContact { }   # Customer contacts
model SalesOpportunity { }  # Sales pipeline
model CallRecord { }        # Customer interactions
model Interaction { }       # Customer engagement history
```

#### 3. Knowledge Base System (9 models)
```prisma
model KnowledgeFolder { }         # Folder hierarchy
model KnowledgeBase { }           # Documents
model KnowledgeChunk { }          # Vector embeddings (pgvector)
model KnowledgeTag { }            # Tagging system
model ProcessingTask { }          # Async processing queue
model KnowledgeVersion { }        # Version control
model KnowledgeVersionComment { } # Version comments
model Document { }                # Document metadata
model AIAnalysis { }              # AI-generated insights
```

#### 4. Proposal Management (6 models)
```prisma
model Proposal { }           # Proposals
model ProposalItem { }       # Line items
model ProposalTemplate { }   # Templates
model ProposalGeneration { } # Generation tracking
model ProposalVersion { }    # Version history
model ProposalComment { }    # Comments
```

#### 5. Workflow Engine (3 models)
```prisma
model ProposalWorkflow { }      # Workflow instances
model WorkflowStateHistory { }  # State transitions (12 states)
model ApprovalTask { }          # Approval tasks
```

#### 6. Notification System (4 models)
```prisma
model Notification { }           # Notifications
model NotificationPreference { } # User preferences
model NotificationTemplate { }   # Templates
model NotificationBatch { }      # Batch sending
```

#### 7. Authentication & Security (3 models)
```prisma
model RefreshToken { }   # JWT refresh tokens
model TokenBlacklist { } # Revoked tokens
model ApiKey { }         # API key management
```

#### 8. Configuration & System (3 models)
```prisma
model SystemConfig { }      # System configuration
model AuditLog { }          # Audit logging
model AIGenerationConfig { } # AI generation settings
```

### Vector Search Models
- **KnowledgeChunk**: Uses `vector(1536)` type with pgvector extension
- Enables semantic search across knowledge base

---

## 4. Monitoring System Files

### lib/monitoring/ Structure (7 files, 2,776 total lines)

| File | Lines | Purpose |
|------|-------|---------|
| `backend-factory.ts` | 217 | Factory pattern for monitoring backends (Prometheus/Azure/Console) |
| `config.ts` | 118 | Monitoring configuration management |
| `connection-monitor.ts` | 540 | Database connection pool monitoring |
| `middleware.ts` | 104 | Express/Next.js monitoring middleware |
| `monitor-init.ts` | 312 | Initialization and startup logic |
| `performance-monitor.ts` | 1,025 | Core performance monitoring service |
| `telemetry.ts` | 460 | OpenTelemetry integration layer |

### monitoring/ Configuration Files

#### Prometheus Configuration
- `monitoring/prometheus/prometheus.yml` - Main Prometheus config
- `monitoring/prometheus/alerts.yml` - 46 alert rules (P1-P4 severity)

#### Grafana Dashboards (4 pre-built)
- `01-system-overview.json` - System-wide metrics
- `02-api-performance.json` - API endpoint performance
- `03-business-metrics.json` - Business KPIs
- `04-resource-usage.json` - Resource utilization

#### AlertManager
- `monitoring/alertmanager/alertmanager.yml` - Alert routing config

### Monitoring Features
- **Backend Abstraction**: Switch between Prometheus/Azure Monitor/Console
- **46 Alert Rules**: P1 (Critical), P2 (High), P3 (Medium), P4 (Low)
- **12 Metric Categories**: HTTP, Database, Cache, Queue, AI, Business, etc.
- **4 Grafana Dashboards**: Pre-configured visualizations
- **OpenTelemetry**: Vendor-neutral instrumentation

---

## 5. Core Modules in lib/

### Module Breakdown (27+ modules)

#### AI Integration (lib/ai/ - 8 files)
- `azure-openai-service.ts` - Azure OpenAI wrapper
- `chat.ts` - Chat completions
- `embeddings.ts` - Text embeddings
- `enhanced-embeddings.ts` - Advanced embedding logic
- `openai.ts` - OpenAI SDK wrapper
- `proposal-generation-service.ts` - AI proposal generation
- `types.ts` - Type definitions
- `index.ts` - Module exports

**Key Features**:
- Azure OpenAI integration
- Embeddings for vector search
- Proposal generation with AI
- Type-safe AI responses

#### Authentication (lib/auth/ + lib/auth-server.ts + lib/auth.ts - 4 files, ~430 lines)
- `azure-ad-service.ts` - Azure AD SSO integration
- `token-service.ts` - JWT token management (dual-token system)
- `auth-server.ts` - Server-side auth utilities (179 lines)
- `auth.ts` - Client-side auth utilities (73 lines)

**Key Features**:
- JWT dual-token authentication
- Azure AD SSO integration
- Token refresh & blacklisting
- Role-based access control

#### API Gateway (lib/middleware/ - 12 files)
- `api-versioning.ts` - API version management
- `cors.ts` - CORS configuration
- `https-enforcement.ts` - HTTPS redirect
- `rate-limiter.ts` - Rate limiting
- `request-id.ts` - Request ID generation
- `request-transformer.ts` - Request transformation
- `request-validator.ts` - Request validation
- `response-cache.ts` - Response caching
- `response-transformer.ts` - Response transformation
- `route-matcher.ts` - Route matching logic
- `routing-config.ts` - Routing configuration
- `security-headers.ts` - Security headers

**Key Features**:
- 10+ enterprise-grade middlewares
- Rate limiting with Redis
- Request/response transformation
- Security headers (CSP, HSTS, etc.)

#### Knowledge Base (lib/knowledge/ - 5 files)
- `analytics-service.ts` - Search analytics
- `full-text-search.ts` - Full-text search
- `index.ts` - Module exports
- `search-history-manager.ts` - Search history tracking
- `version-control.ts` - Document versioning

**Key Features**:
- Full-text + vector search hybrid
- Search analytics & history
- Document version control
- Tag management

#### Search System (lib/search/ - 9 files)
- `contextual-result-enhancer.ts` - Result enhancement
- `crm-search-adapter.ts` - CRM integration
- `pgvector-search.ts` - PostgreSQL vector search
- `query-processor.ts` - Query processing
- `result-ranker.ts` - Result ranking
- `search-analytics.ts` - Analytics tracking
- `search-suggestions.ts` - Query suggestions
- `semantic-query-processor.ts` - Semantic processing
- `vector-search.ts` - Vector search engine

**Key Features**:
- Multi-algorithm vector search
- Hybrid search (vector + full-text)
- Semantic query understanding
- Result ranking & enhancement

#### Workflow Engine (lib/workflow/ - 5 files)
- `approval-manager.ts` - Approval workflows
- `comment-system.ts` - Comments on workflows
- `engine.ts` - Core workflow engine
- `index.ts` - Module exports
- `version-control.ts` - Workflow versioning

**Key Features**:
- 12-state workflow engine
- Multi-level approval system
- Workflow versioning
- Comment threads

#### Notification System (lib/notification/ - 4 files)
- `email-service.ts` - Email notifications
- `engine.ts` - Notification engine
- `in-app-service.ts` - In-app notifications
- `index.ts` - Module exports

**Key Features**:
- Multi-channel (email, in-app)
- Template system
- User preferences
- Batch sending

#### Cache System (lib/cache/ - 2 files)
- `redis-client.ts` - Redis client wrapper
- `vector-cache.ts` - Vector search caching

**Key Features**:
- Redis dual-layer caching
- Vector embedding caching
- TTL management

#### Document Parsers (lib/parsers/ - 5 files)
- `excel-parser.ts` - Excel parsing
- `image-ocr-parser.ts` - OCR with Tesseract
- `pdf-parser.ts` - PDF parsing
- `word-parser.ts` - Word document parsing
- `index.ts` - Module exports

**Key Features**:
- PDF, Word, Excel parsing
- OCR for images
- Text extraction

#### PDF Generation (lib/pdf/ - 3 files)
- `pdf-generator.ts` - PDF generation with Puppeteer
- `proposal-pdf-template.ts` - Proposal templates
- `index.ts` - Module exports

**Key Features**:
- HTML to PDF conversion
- Template-based generation
- Puppeteer integration

#### Template Engine (lib/template/ - 3 files)
- `handlebars-helpers.ts` - Custom Handlebars helpers
- `template-engine.ts` - Template engine
- `template-manager.ts` - Template management

**Key Features**:
- Handlebars templating
- Custom helpers
- Template caching

#### Security & RBAC (lib/security/ - 11 files)
- `action-restrictions.ts` - Action-based permissions
- `audit-log-prisma.ts` - Audit logging with Prisma
- `audit-log.ts` - Audit log service
- `audit-log.test.ts` - Audit log tests
- `field-level-permissions.ts` - Field-level access
- `fine-grained-permissions.ts` - Fine-grained RBAC
- `gdpr.ts` - GDPR compliance
- `permission-middleware.ts` - Permission middleware
- `permission-middleware.test.ts` - Middleware tests
- `rbac.ts` - Core RBAC logic
- `rbac.test.ts` - RBAC tests
- `resource-conditions.ts` - Resource-based conditions
- `sensitive-fields-config.ts` - Sensitive field configuration
- `index.ts` - Module exports

**Key Features**:
- Role-based access control (RBAC)
- Fine-grained permissions
- Field-level permissions
- GDPR compliance utilities
- Audit logging

#### Performance Optimization (lib/performance/ - 6 files)
- `monitor.ts` - Performance monitoring
- `monitor.test.ts` - Monitor tests
- `query-optimizer.ts` - Database query optimization
- `query-optimizer.test.ts` - Optimizer tests
- `response-cache.ts` - Response caching
- `response-cache.test.ts` - Cache tests

**Key Features**:
- Query optimization
- Response caching
- Performance monitoring
- Unit tested

#### Resilience (lib/resilience/ - 6 files)
- `circuit-breaker.ts` - Circuit breaker pattern
- `circuit-breaker.test.ts` - Circuit breaker tests
- `health-check.ts` - Health checking
- `health-check.test.ts` - Health check tests
- `retry.ts` - Retry logic
- `retry.test.ts` - Retry tests

**Key Features**:
- Circuit breaker pattern
- Retry with exponential backoff
- Health checking
- Unit tested

#### Other Modules
- **lib/analytics/** (2 files) - User behavior tracking
- **lib/api/** (2 files) - API utilities (error handler, response helper)
- **lib/calendar/** (3 files) - Microsoft Graph calendar sync
- **lib/collaboration/** (2 files) - Real-time edit locking
- **lib/meeting/** (3 files) - Meeting intelligence & prep
- **lib/recommendation/** (2 files) - Recommendation engine
- **lib/reminder/** (3 files) - Reminder scheduling
- **lib/integrations/customer-360/** (1 file) - Customer 360 view
- **lib/integrations/dynamics365/** (3 files) - Dynamics 365 integration
- **lib/startup/** (1 file) - Application initialization

#### Root lib/ Files (7 files, 1,375 lines)
- `auth.ts` (73 lines) - Auth utilities
- `auth-server.ts` (179 lines) - Server auth
- `db.ts` (36 lines) - Database utilities
- `errors.ts` (653 lines) - Error handling
- `middleware.ts` (255 lines) - Core middleware
- `prisma.ts` (77 lines) - Prisma client
- `utils.ts` (102 lines) - General utilities

---

## 6. UI Components in components/

### Component Directory Structure (18 directories)

#### admin/ (2 components)
- `performance-dashboard.tsx` - Performance metrics dashboard
- `system-monitor.tsx` - System monitoring dashboard

#### assistant/ (3 components)
- `ChatInput.tsx` - Chat input field
- `ChatMessage.tsx` - Chat message display
- `ChatWindow.tsx` - Chat window container

#### audit/ (4 components)
- `AuditLogExport.tsx` - Export audit logs
- `AuditLogFilters.tsx` - Filter audit logs
- `AuditLogList.tsx` - Display audit logs
- `AuditLogStats.tsx` - Audit statistics

#### calendar/ (1 component)
- `CalendarView.tsx` - Calendar integration view

#### collaboration/ (1 component)
- `EditLockIndicator.tsx` - Real-time edit lock indicator

#### crm/ (1 component)
- `customer-360-view.tsx` - Customer 360 view

#### dashboard/ (7 components)
- `ai-insights.tsx` - AI-generated insights widget
- `dashboard-stats.tsx` - Statistics cards
- `quick-actions.tsx` - Quick action buttons
- `recent-activity.tsx` - Recent activity feed
- `sales-chart.tsx` - Sales charts
- `top-customers.tsx` - Top customers list

#### knowledge/ (29+ components)
Main knowledge base UI components:
- `advanced-editor-toolbar.tsx` - Rich text editor toolbar
- `advanced-search-builder.tsx` - Advanced search query builder
- `breadcrumb-navigation.tsx` - Folder breadcrumbs
- `bulk-upload.tsx` - Bulk document upload
- `document-preview.tsx` - Document preview
- `enhanced-knowledge-editor.tsx` - Rich text editor
- `enhanced-knowledge-search.tsx` - Enhanced search interface
- `folder-selector.tsx` - Folder selection UI
- `knowledge-base-filters.tsx` - Filter components
- `knowledge-base-list.tsx` - Document list
- `knowledge-base-list-optimized.tsx` - Optimized list rendering
- `knowledge-base-upload.tsx` - Single file upload
- `knowledge-create-form.tsx` - Document creation form
- `knowledge-document-edit.tsx` - Document editor
- `knowledge-document-edit-with-version.tsx` - Versioned editor
- `knowledge-document-view.tsx` - Document viewer
- `knowledge-folder-tree.tsx` - Folder tree navigation
- `knowledge-management-dashboard.tsx` - Knowledge dashboard
- `knowledge-recommendation-widget.tsx` - AI recommendations
- `knowledge-review-workflow.tsx` - Review workflow UI
- `knowledge-search.tsx` - Search interface
- `quick-jump-search.tsx` - Quick jump search
- `rich-text-editor.tsx` - TipTap rich text editor
- `search-analytics-dashboard.tsx` - Search analytics
- `search-results-optimizer.tsx` - Search result optimization
- `search-suggestions.tsx` - Search suggestions

**knowledge/analytics/** (4 components):
- `BarChart.tsx`
- `DocumentList.tsx`
- `PieChart.tsx`
- `StatsCard.tsx`

**knowledge/version/** (2 components):
- `KnowledgeVersionComparison.tsx` - Version diff view
- `KnowledgeVersionHistory.tsx` - Version history list

#### layout/ (components for app layout)
- Navigation components
- Header/Footer
- Sidebar

#### meeting-prep/ (components for meeting preparation)
- Meeting prep package UI

#### notifications/ (notification UI components)
- Notification bell
- Notification list

#### permissions/ (permission management UI)
- Permission editor
- Role management

#### recommendation/ (recommendation UI)
- AI recommendation cards

#### reminder/ (reminder UI)
- Reminder list
- Reminder editor

#### search/ (advanced search UI)
- Search filters
- Search results

#### ui/ (23 base components)
**Radix UI-based components**:
- `alert-dialog.tsx`
- `alert.tsx`
- `avatar.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `checkbox.tsx`
- `command.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `error-display.tsx`
- `input.tsx`
- `label.tsx`
- `popover.tsx`
- `progress.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `switch.tsx`
- `tabs.tsx`
- `textarea.tsx`

#### workflow/ (workflow UI components)
**Main workflow components**:
- Workflow editor
- State machine visualizer

**workflow/approval/** (approval UI):
- Approval tasks
- Approval buttons

**workflow/comments/** (comment UI):
- Comment threads
- Reply system

**workflow/version/** (version UI):
- Version comparison
- Version history

### Total Component Statistics
- **Total Components**: 80+ TSX files
- **Total Lines**: 31,650 lines
- **Largest Module**: knowledge/ (29+ components)
- **Base UI Components**: 23 Radix UI-based components

---

## 7. API Routes in app/api/

### API Route Structure (23 domains)

#### ai/ (2 routes)
- `generate-proposal/route.ts` - AI proposal generation
- `regenerate-proposal/route.ts` - Regenerate proposals

#### analytics/ (3 routes)
- `behaviors/route.ts` - User behavior tracking
- `profile/route.ts` - User profile analytics
- `track/route.ts` - Event tracking

#### assistant/ (1 route)
- `chat/route.ts` - AI assistant chat endpoint

#### audit-logs/ (3 routes)
- `export/route.ts` - Export audit logs
- `route.ts` - List audit logs
- `stats/route.ts` - Audit statistics

#### auth/ (7 routes)
- `azure-ad/callback/route.ts` - Azure AD callback
- `azure-ad/login/route.ts` - Azure AD login
- `login/route.ts` - Standard login
- `logout/route.ts` - Logout
- `me/route.ts` - Current user info
- `refresh/route.ts` - Token refresh
- `register/route.ts` - User registration

#### calendar/ (3 routes)
- `auth/route.ts` - Calendar OAuth
- `events/route.ts` - Calendar events
- `sync/route.ts` - Calendar sync

#### collaboration/ (3 routes)
- `locks/route.ts` - List locks
- `locks/lock/[lockId]/route.ts` - Lock operations
- `locks/[resourceType]/[resourceId]/status/route.ts` - Lock status

#### customers/ (2 routes)
- `route.ts` - Customer CRUD
- `[id]/360-view/route.ts` - Customer 360 view

#### health/ (1 route)
- `route.ts` - Health check endpoint

#### knowledge-base/ (15 routes)
Main knowledge base API:
- `advanced-search/route.ts` - Advanced search
- `analytics/route.ts` - Knowledge analytics
- `bulk-upload/route.ts` - Bulk document upload
- `check-duplicate/route.ts` - Duplicate detection
- `processing/route.ts` - Document processing status
- `route.ts` - Main CRUD operations
- `route-optimized.ts` - Optimized queries
- `search/route.ts` - Search endpoint
- `suggestions/route.ts` - Search suggestions
- `tags/route.ts` - Tag management
- `upload/route.ts` - Single file upload

**Dynamic routes**:
- `[id]/content/route.ts` - Document content
- `[id]/download/route.ts` - Download document
- `[id]/route.ts` - Single document CRUD
- `[id]/versions/route.ts` - Version list
- `[id]/versions/compare/route.ts` - Version comparison
- `[id]/versions/revert/route.ts` - Revert to version
- `[id]/versions/[versionId]/route.ts` - Single version

#### knowledge-folders/ (4 routes)
- `route.ts` - Folder CRUD
- `reorder/route.ts` - Reorder folders
- `[id]/move/route.ts` - Move folder
- `[id]/route.ts` - Single folder operations

#### meeting-intelligence/ (2 routes)
- `analyze/route.ts` - Analyze meeting transcripts
- `recommendations/route.ts` - Meeting recommendations

#### meeting-prep/ (1 route)
- `route.ts` - Meeting prep packages

#### mock/ (mock data endpoints for testing)

#### monitoring/ (monitoring endpoints)
- Health metrics
- Performance data

#### notifications/ (notification endpoints)
- Send notifications
- Notification preferences

#### proposals/ (proposal endpoints)
- Proposal CRUD
- Proposal generation

#### proposal-templates/ (template endpoints)
- Template CRUD
- Template management

#### recommendations/ (recommendation endpoints)
- AI recommendations
- Recommendation feedback

#### reminders/ (reminder endpoints)
- Reminder CRUD
- Reminder scheduling

#### search/ (search endpoints)
- Global search
- Search across entities

#### templates/ (template endpoints)
- Template CRUD

#### [...slug]/ (catch-all route)
- Fallback handler

### Total API Statistics
- **Total API Domains**: 23
- **Total Route Files**: 70+ route.ts files
- **Most Complex**: knowledge-base (15 routes)

---

## 8. Documentation System

### Root Documentation Files (15 files)

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `AI-ASSISTANT-GUIDE.md` | AI assistant usage guide (76KB) |
| `CLAUDE.md` | Claude Code instructions (29KB) |
| `DEPLOYMENT-GUIDE.md` | Deployment instructions (30KB) |
| `DEVELOPMENT-LOG.md` | Development journal (622KB) |
| `DEVELOPMENT-SERVICE-MANAGEMENT.md` | Service management guide |
| `FIXLOG.md` | Bug tracking log (100KB) |
| `INDEX-MAINTENANCE-GUIDE.md` | Index maintenance guide (24KB) |
| `PROJECT-INDEX.md` | Project navigation (162KB) |
| `START-SERVICES.md` | Service startup guide |
| `STARTUP-GUIDE.md` | Getting started guide (23KB) |
| `e2e-test-summary.md` | E2E test results |
| `test-execution-report.md` | Test execution report |
| `github.md` | GitHub workflow guide |

### docs/ Directory (60+ files)

#### Architecture Documentation
- `architecture.md` - System architecture
- `api-specification.md` - API specification
- `front-end-spec.md` - Frontend specification

#### Setup Guides
- `azure-openai-setup-guide.md` - Azure OpenAI setup
- `dynamics365-setup-guide.md` - Dynamics 365 setup
- `microsoft-graph-setup-guide.md` - Microsoft Graph setup

#### Monitoring Documentation
- `monitoring-operations-manual.md` - Operations manual
- `monitoring-usage-examples.md` - Usage examples
- `monitoring-migration-strategy.md` - Migration strategy
- `azure-monitor-migration-checklist.md` - Azure Monitor migration

#### Testing Documentation
- `COMPLETE-UAT-TEST-PLAN.md` - UAT test plan
- `load-testing-plan.md` - Load testing plan
- `load-testing-execution-guide.md` - Load testing guide
- `load-testing-summary.md` - Load test summary
- `load-test-execution-report-2025-10-07.md` - Load test results

#### Development Documentation
- `mvp-development-plan.md` - MVP development plan
- `mvp-implementation-checklist.md` - MVP checklist
- `future-innovations.md` - Future features
- `code-comments-enhancement-plan.md` - Code quality plan
- `code-comments-qa.md` - Code comments QA
- `ai-comment-context-analysis.md` - AI comment analysis
- `ai-comment-reference-documents.md` - Comment references
- `ai-comments-completion-report.md` - Comment completion
- `ai-full-automation-plan.md` - Automation plan

#### API Documentation
- `api/knowledge-base-api.md` - Knowledge base API docs
- `api-gateway-architecture.md` - API gateway architecture
- `api-gateway-decision.md` - API gateway decisions

#### Index Maintenance
- `index-maintenance-improvement-log.md` - Index improvements
- `index-maintenance-root-cause-analysis.md` - Index issues
- `INDEX-REMINDER-SETUP.md` - Index reminder setup

---

## 9. Configuration Files

### Environment Files (7 files)
- `.env` - Active environment variables
- `.env.local` - Local overrides
- `.env.example` - Example configuration (6.7KB)
- `.env.production.example` - Production example (6.6KB)
- `.env.monitoring.example` - Monitoring configuration (2KB)
- `.env.security.example` - Security configuration (6KB)
- `.env.test` - Test environment

### Docker Configuration (5 files)
- `docker-compose.dev.yml` - Development compose
- `docker-compose.monitoring.yml` - Monitoring stack (3.5KB)
- `docker-compose.prod.yml` - Production compose (4.6KB)
- `Dockerfile.dev` - Development image
- `Dockerfile.prod` - Production image (2KB)

### Next.js Configuration (2 files)
- `next.config.js` - Standard configuration (1.7KB)
- `next.config.optimized.js` - Optimized configuration (5.4KB)

### Testing Configuration (3 files)
- `jest.config.js` - Jest unit tests (1.3KB)
- `jest.config.workflow.js` - Workflow tests (2KB)
- `playwright.config.ts` - Playwright E2E tests (3KB)

### Build & Tooling (4 files)
- `tailwind.config.js` - Tailwind CSS configuration (5.4KB)
- `postcss.config.js` - PostCSS configuration (2.9KB)
- `tsconfig.json` - TypeScript configuration (843 bytes)
- `.eslintrc.json` - ESLint configuration (3.4KB)

### Utility Scripts
- `jest.setup.js` - Jest setup (6.5KB)
- `jest.setup.workflow.js` - Workflow test setup (2KB)
- `healthcheck.js` - Health check script (4.4KB)
- `instrumentation.ts` - OpenTelemetry instrumentation (1.3KB)

---

## 10. Test File Statistics

### Unit Tests (__tests__/ - 36 files)

**Test Coverage Areas**:
- Authentication tests
- API endpoint tests
- Utility function tests
- Monitoring tests
- Security tests (RBAC, permissions)
- Performance tests (query optimizer, cache)
- Resilience tests (circuit breaker, retry)

**Test Files with Line Counts**:
- `lib/performance/monitor.test.ts`
- `lib/performance/query-optimizer.test.ts`
- `lib/performance/response-cache.test.ts`
- `lib/resilience/circuit-breaker.test.ts`
- `lib/resilience/health-check.test.ts`
- `lib/resilience/retry.test.ts`
- `lib/security/audit-log.test.ts`
- `lib/security/permission-middleware.test.ts`
- `lib/security/rbac.test.ts`
- (+ 27 more test files)

### E2E Tests (e2e/ + tests/ - 16 files)

**E2E Test Scenarios**:
- Authentication flows (login, logout, SSO)
- Knowledge base operations (CRUD, search, upload)
- Proposal generation workflows
- Dashboard navigation
- Search functionality
- User workflows

**Test Results**:
- E2E test reports in `e2e-results/`
- Playwright reports in `playwright-report/`
- Test execution reports available

### Test Statistics Summary
- **Total Unit Tests**: 36 test files
- **Total E2E Tests**: 16 test files
- **Test Coverage**: 120+ test cases
- **Testing Framework**: Jest (unit), Playwright (E2E)
- **Test Infrastructure**: GitHub Actions CI/CD

---

## 11. Additional Project Files

### Scripts Directory
- Database migration scripts
- Seed data scripts
- Build scripts
- Deployment scripts

### Public Assets
- Images
- Icons
- Static files

### Types Directory
- Shared TypeScript type definitions
- API type definitions
- Component prop types

### Hooks Directory
- Custom React hooks
- Reusable logic hooks

### Indexes Directory
- Search index configurations
- Database index definitions

### POC Directory
- Proof of concept implementations
- Experimental features

### Temporary/Build Artifacts
- `.next/` - Next.js build output
- `node_modules/` - Dependencies
- `coverage/` - Test coverage reports
- `output/` - Build outputs
- `temp/` - Temporary files

---

## 12. Key Integration Points

### External Services Integrated
1. **Azure OpenAI** - AI completions and embeddings
2. **Azure AD** - SSO authentication
3. **Microsoft Graph** - Calendar synchronization
4. **Dynamics 365** - CRM integration
5. **Redis** - Caching layer
6. **PostgreSQL + pgvector** - Database with vector search
7. **Prometheus** - Metrics collection
8. **Grafana** - Metrics visualization
9. **AlertManager** - Alert management

### Internal Service Architecture
- **Next.js 14 App Router** - Frontend and API
- **Prisma ORM** - Database access layer
- **OpenTelemetry** - Observability
- **tRPC** - Type-safe API layer (optional)
- **React Query** - Client-side data fetching
- **Radix UI** - Component primitives
- **TipTap** - Rich text editing
- **Handlebars** - Template engine
- **Puppeteer** - PDF generation

---

## 13. Module Extraction Priority

### High Priority (Core Template)
1. **Monitoring System** (lib/monitoring/, monitoring/) - 2,776 lines
2. **API Gateway** (lib/middleware/) - 12 middlewares
3. **Authentication** (lib/auth/) - JWT + Azure AD
4. **Database Abstraction** (lib/db.ts, lib/prisma.ts)
5. **UI Component System** (components/ui/) - 23 components
6. **Base Layout** (app/layout.tsx, components/layout/)

### Medium Priority (Optional Modules)
7. **Knowledge Base** (lib/knowledge/, components/knowledge/, app/api/knowledge-base/)
8. **Search System** (lib/search/, components/search/, app/api/search/)
9. **Workflow Engine** (lib/workflow/, components/workflow/)
10. **Notification System** (lib/notification/, components/notifications/)
11. **AI Integration** (lib/ai/, app/api/ai/)
12. **Template Engine** (lib/template/)
13. **PDF Generation** (lib/pdf/)
14. **Document Parsers** (lib/parsers/)

### Low Priority (Domain-Specific)
15. **CRM Features** (components/crm/, lib/integrations/customer-360/)
16. **Dynamics 365** (lib/integrations/dynamics365/)
17. **Meeting Intelligence** (lib/meeting/, components/meeting-prep/)
18. **Calendar Sync** (lib/calendar/, components/calendar/)

---

## 14. Extraction Challenges & Considerations

### Database Dependencies
- **34 Prisma models** - Need to separate core vs optional
- **pgvector extension** - Optional for vector search
- **Multiple DB support** - Need abstraction for PostgreSQL/MySQL/MongoDB/SQLite

### Environment Variables
- **50+ environment variables** - Need template system
- **Secrets management** - Azure Key Vault integration
- **Multi-environment configs** - Dev/Staging/Production

### Monitoring Complexity
- **Vendor-neutral design** - Prometheus/Azure Monitor abstraction
- **46 alert rules** - Need to be configurable
- **4 Grafana dashboards** - Need to be optional

### Module Interdependencies
- **Knowledge Base ↔ Search** - Tightly coupled
- **Workflow ↔ Notification** - Approval notifications
- **Auth ↔ All modules** - Authentication required everywhere

### Testing Infrastructure
- **120+ tests** - Need to be modularized
- **E2E test scenarios** - Should be optional
- **CI/CD pipelines** - GitHub Actions integration

---

## 15. Recommended Template Structure

Based on this analysis, recommended template structure:

```
ai-webapp-template/
├── 00-monitoring/          # Monitoring system (extracted as-is)
├── 01-base/                # Core template (auth, DB, UI, layout)
├── 02-modules/             # Optional modules
│   ├── module-auth/
│   ├── module-api-gateway/
│   ├── module-knowledge-base/
│   ├── module-search/
│   ├── module-ai-integration/
│   ├── module-workflow/
│   ├── module-notification/
│   ├── module-cache/
│   ├── module-template/
│   ├── module-pdf/
│   ├── module-parsers/
│   ├── module-dynamics365/
│   ├── module-customer360/
│   └── module-performance/
├── 03-examples/            # Example implementations
├── 04-ui-design-system/    # Design system documentation
└── init-project.js         # Interactive CLI
```

---

## Conclusion

### Project Scale Summary
- **161,166 lines of code** across 642 files
- **27+ distinct modules** in lib/
- **34 database models** with vector search
- **80+ React components** across 18 directories
- **70+ API routes** across 23 domains
- **120+ tests** (unit + E2E)
- **45+ documentation files**

### Extraction Readiness
✅ **Well-Structured**: Clear module boundaries
✅ **Documented**: Comprehensive documentation
✅ **Tested**: Good test coverage
✅ **Configurable**: Environment-based configuration
⚠️ **Complex**: Many interdependencies to manage
⚠️ **Large**: 160K+ LOC requires careful extraction

### Next Steps
1. **Phase 1**: Extract monitoring system (2,776 lines)
2. **Phase 2**: Extract base template (auth, DB, UI)
3. **Phase 3**: Extract optional modules (knowledge base, search, workflow)
4. **Phase 4**: Create init-project.js CLI
5. **Phase 5**: Create documentation and examples

---

**Report Generated**: 2025-10-09
**Source Project**: AI Sales Enablement Platform
**Target Template**: AI Web App Template v5.0
