# API Gateway Module

Enterprise-grade API Gateway with comprehensive middleware system for Next.js applications.

## Overview

The API Gateway module provides a production-ready middleware stack for building robust, secure, and scalable APIs. It includes error handling, security, validation, transformation, caching, routing, and versioning capabilities.

## Features

### Core Error Handling
- **Unified Error System** - Structured error types with severity levels
- **Error Classification** - Automatic categorization of Prisma, JWT, network errors
- **Error Logging** - Environment-aware logging with structured output
- **Error Metrics** - Real-time error statistics and tracking
- **API Response Helpers** - Standardized success/error response utilities

### Security & Validation
- **Rate Limiting** - Memory/Redis-based request throttling with 5 presets
- **CORS Handling** - Dynamic origin validation with wildcard support
- **Security Headers** - OWASP-compliant headers (CSP, HSTS, X-Frame-Options)
- **Request Validation** - Zod-based schema validation for body/query/params/headers

### Request/Response Processing
- **Request ID Generation** - UUID/timestamp/short ID strategies for tracing
- **Request Transformation** - Field naming, data cleaning, flatten/unflatten, batch processing
- **Response Transformation** - Multi-format (JSON/XML/CSV), pagination, HATEOAS links
- **Response Caching** - HTTP caching with ETag, Cache-Control, 304 Not Modified

### Routing & Versioning
- **API Versioning** - URL/header/query/accept-header version extraction
- **Route Matching** - String/regex/wildcard patterns with LRU caching
- **Routing Configuration** - Centralized route config with auth/rate-limit/CORS

## Architecture

```
module-api-gateway/
├── lib/
│   ├── errors.ts.template                    # Core error system (530 lines)
│   ├── api/
│   │   ├── error-handler.ts.template         # API error handling (450 lines)
│   │   └── response-helper.ts.template       # Response utilities (300 lines)
│   └── middleware/
│       ├── rate-limiter.ts.template           # Rate limiting (370 lines)
│       ├── cors.ts.template                   # CORS handling (480 lines)
│       ├── security-headers.ts.template       # Security headers (550 lines)
│       ├── request-validator.ts.template      # Request validation (635 lines)
│       ├── request-id.ts.template             # Request ID generation (310 lines)
│       ├── request-transformer.ts.template    # Request transformation (820 lines)
│       ├── response-transformer.ts.template   # Response transformation (760 lines)
│       ├── response-cache.ts.template         # Response caching (800 lines)
│       ├── api-versioning.ts.template         # API versioning (595 lines)
│       ├── route-matcher.ts.template          # Route matching (490 lines)
│       └── routing-config.ts.template         # Route configuration (360 lines)
└── README.md                                  # This file

Total: 14 files, ~7,450 lines
```

## Installation

### 1. Copy Module Files

During project initialization, select the "API Gateway" module:

```bash
node init-project.js
# Select: "Module API Gateway"
```

Or manually copy files to your project:

```bash
cp -r 02-modules/module-api-gateway/lib/* lib/
```

### 2. Install Dependencies

```bash
npm install zod
```

### 3. Configure Environment Variables

Add to `.env.local`:

```bash
# API Gateway Configuration
NODE_ENV=development # or production

# Rate Limiting (optional - uses memory by default)
# REDIS_URL=redis://localhost:6379

# CORS Origins (production only, comma-separated)
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. Update Route Configuration

Edit `lib/middleware/routing-config.ts` to add your business routes:

```typescript
export const routeConfigs: RouteConfig[] = [
  // Your custom routes
  {
    name: 'my-api',
    pattern: /^\/api\/my-api/,
    priority: 50,
    auth: {
      required: true,
      methods: ['jwt']
    },
    rateLimit: {
      windowMs: 60000,
      maxRequests: 100
    }
  },
  // ... other routes
]
```

## Usage Examples

### Error Handling

```typescript
// app/api/users/route.ts
import { withErrorHandling, ApiErrorHandler } from '@/lib/api/error-handler'
import { AppError } from '@/lib/errors'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const users = await db.user.findMany()

  if (!users) {
    throw AppError.notFound('Users not found')
  }

  return ApiErrorHandler.createSuccessResponse(users, request)
})
```

### Rate Limiting

```typescript
// middleware.ts or app/api/upload/route.ts
import { createRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limiter'

const uploadLimiter = createRateLimit(RateLimitPresets.FILE_UPLOAD)

export async function POST(request: NextRequest) {
  const limitResult = await uploadLimiter(request)
  if (limitResult) return limitResult // 429 if rate limited

  // Process upload
  return NextResponse.json({ success: true })
}
```

### Request Validation

```typescript
import { createRequestValidator } from '@/lib/middleware/request-validator'
import { z } from 'zod'

const validator = createRequestValidator({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email()
  })
})

export async function POST(request: NextRequest) {
  const result = await validator.handle(request)
  if (result instanceof NextResponse) return result // Validation error

  const { body } = result.data!
  // Use validated body
  return NextResponse.json({ success: true })
}
```

### CORS Configuration

```typescript
// middleware.ts
import { CorsMiddleware, CorsPresets } from '@/lib/middleware/cors'

const cors = new CorsMiddleware(CorsPresets.production)

export function middleware(request: NextRequest) {
  return cors.handle(request)
}

export const config = {
  matcher: '/api/:path*'
}
```

### Security Headers

```typescript
// middleware.ts
import { SecurityHeadersMiddleware, SecurityPresets } from '@/lib/middleware/security-headers'

const security = new SecurityHeadersMiddleware(SecurityPresets.production)

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  return security.apply(response)
}
```

### Request Transformation

```typescript
import { createRequestTransformer } from '@/lib/middleware/request-transformer'

const transformer = createRequestTransformer({
  fieldNaming: 'camelCase',
  trimStrings: true,
  removeEmpty: true
})

export async function POST(request: NextRequest) {
  const transformed = await transformer.transform(request)
  const body = await transformed.json()
  // All field names converted to camelCase, strings trimmed
  return NextResponse.json({ success: true })
}
```

### Response Transformation

```typescript
import { createResponseTransformer } from '@/lib/middleware/response-transformer'

const transformer = createResponseTransformer({
  enableLinks: true,
  allowedFormats: ['json', 'xml', 'csv']
})

export async function GET(request: NextRequest) {
  const users = await db.user.findMany({ take: 10 })

  return transformer.transform(request, users, {
    paginate: true,
    pagination: { page: 1, limit: 10, total: 100 }
  })
}
```

### Response Caching

```typescript
import { createResponseCache, CachePresets } from '@/lib/middleware/response-cache'

const cache = createResponseCache(CachePresets.api)

export async function GET(request: NextRequest) {
  return cache.handle(request, async () => {
    const data = await expensiveOperation()
    return NextResponse.json(data)
  })
}
```

### API Versioning

```typescript
// middleware.ts
import { createApiVersioning } from '@/lib/middleware/api-versioning'

const versioning = createApiVersioning({
  strategies: ['url', 'header'],
  defaultVersion: 'v2'
})

export function middleware(request: NextRequest) {
  const resolution = versioning.resolve(request)
  console.log('API Version:', resolution.version)

  return versioning.handle(request)
}
```

### Route Matching

```typescript
// middleware.ts
import { createRouteMatcher } from '@/lib/middleware/route-matcher'
import { routeConfigs } from '@/lib/middleware/routing-config'

const matcher = createRouteMatcher(routeConfigs)

export function middleware(request: NextRequest) {
  const result = matcher.match(request.nextUrl.pathname)

  if (result.matched && result.config) {
    console.log('Matched route:', result.config.name)
    console.log('Requires auth:', result.config.auth.required)
  }

  return NextResponse.next()
}
```

## Presets & Defaults

### Rate Limit Presets

```typescript
RateLimitPresets.GENERAL_API     // 60 req/min
RateLimitPresets.FILE_UPLOAD     // 5 req/min
RateLimitPresets.AUTH_ATTEMPT    // 5 req/15min
RateLimitPresets.SEARCH_API      // 30 req/min
RateLimitPresets.STRICT_API      // 10 req/min
```

### CORS Presets

```typescript
CorsPresets.development  // Localhost origins, all methods
CorsPresets.production   // Production domains, GET/POST/PUT/DELETE
CorsPresets.publicApi    // All origins, no credentials
CorsPresets.strict       // Single origin, strict settings
```

### Security Presets

```typescript
SecurityPresets.development  // Relaxed for dev
SecurityPresets.production   // Full security for prod
SecurityPresets.maximum      // Maximum security restrictions
SecurityPresets.api          // API-specific security
```

### Cache Presets

```typescript
CachePresets.short      // 1 minute
CachePresets.medium     // 5 minutes
CachePresets.long       // 1 hour
CachePresets.immutable  // 1 year
CachePresets.private    // Client-side only
CachePresets.api        // API response caching with stale-while-revalidate
CachePresets.none       // Disable caching
```

## Middleware Chain Example

Complete middleware chain for production API:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteMatcher } from '@/lib/middleware/route-matcher'
import { routeConfigs } from '@/lib/middleware/routing-config'
import { createApiVersioning } from '@/lib/middleware/api-versioning'
import { CorsMiddleware, CorsPresets } from '@/lib/middleware/cors'
import { SecurityHeadersMiddleware, SecurityPresets } from '@/lib/middleware/security-headers'
import { generateRequestId } from '@/lib/middleware/request-id'

const routeMatcher = createRouteMatcher(routeConfigs)
const versioning = createApiVersioning()
const cors = new CorsMiddleware(CorsPresets.production)
const security = new SecurityHeadersMiddleware(SecurityPresets.production)

export async function middleware(request: NextRequest) {
  // 1. Generate request ID
  const requestId = generateRequestId()

  // 2. Route matching
  const routeMatch = routeMatcher.match(request.nextUrl.pathname)

  // 3. API versioning
  const versionResolution = versioning.resolve(request)

  // 4. CORS check
  if (request.method === 'OPTIONS') {
    return cors.handle(request)
  }

  // 5. Continue to route handler
  const response = NextResponse.next()

  // 6. Add headers
  response.headers.set('X-Request-ID', requestId)

  // 7. Apply CORS
  const corsResponse = cors.handle(request, response)

  // 8. Apply security headers
  return security.apply(corsResponse)
}

export const config = {
  matcher: '/api/:path*'
}
```

## Configuration Reference

### Error Types

- `UNAUTHORIZED` - Authentication failed (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `NOT_FOUND` - Resource not found (404)
- `VALIDATION_ERROR` - Input validation failed (400)
- `RATE_LIMITED` - Rate limit exceeded (429)
- `SERVICE_UNAVAILABLE` - External service unavailable (503)
- And 14+ more types

### Response Format

Success:
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "requestId": "uuid",
    "timestamp": "ISO8601",
    "processingTime": 45
  }
}
```

Error:
```json
{
  "success": false,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Invalid input",
    "statusCode": 400,
    "timestamp": "ISO8601"
  },
  "metadata": {
    "requestId": "uuid",
    "timestamp": "ISO8601",
    "processingTime": 12
  }
}
```

## Production Considerations

### Performance
- **Rate Limiter**: Use Redis instead of memory for multi-instance deployments
- **Route Matcher**: Enable caching (default: 1000 entries LRU)
- **Response Cache**: Use Redis CacheStorage for distributed caching

### Security
- **CORS**: Update `ENVIRONMENT_ORIGINS` with your production domains
- **Security Headers**: Review CSP directives for your app's requirements
- **Rate Limits**: Adjust presets based on your API's expected traffic

### Monitoring
- Error metrics are automatically tracked via `ErrorMetrics`
- Request IDs enable distributed tracing
- Response cache includes `X-Cache: HIT/MISS` headers
- Rate limit headers show remaining quota

## Advanced Features

### Custom Error Types

```typescript
// Extend ErrorType enum in lib/errors.ts
export enum ErrorType {
  // ... existing types
  CUSTOM_ERROR = 'CUSTOM_ERROR'
}

// Use in your code
throw new AppError(
  'Custom error occurred',
  ErrorType.CUSTOM_ERROR,
  500,
  ErrorSeverity.HIGH
)
```

### Custom Rate Limit Key Generator

```typescript
const customLimiter = createRateLimit({
  windowMs: 60000,
  maxRequests: 100,
  keyGenerator: (req) => {
    // Rate limit by user ID instead of IP
    const userId = req.headers.get('x-user-id')
    return userId ? `user:${userId}` : `ip:${req.ip}`
  }
})
```

### Custom Cache Storage

```typescript
import { CacheStorage, CachedResponse } from '@/lib/middleware/response-cache'

class RedisCacheStorage implements CacheStorage {
  async get(key: string): Promise<CachedResponse | null> {
    // Your Redis implementation
  }
  // ... implement other methods
}

const cache = createResponseCache({
  storage: new RedisCacheStorage()
})
```

## Testing

### Unit Test Example

```typescript
import { AppError } from '@/lib/errors'
import { createRateLimit } from '@/lib/middleware/rate-limiter'

describe('Rate Limiter', () => {
  it('should allow requests within limit', async () => {
    const limiter = createRateLimit({
      windowMs: 60000,
      maxRequests: 2
    })

    const req1 = await limiter(mockRequest)
    const req2 = await limiter(mockRequest)
    const req3 = await limiter(mockRequest)

    expect(req1).toBeNull()
    expect(req2).toBeNull()
    expect(req3.status).toBe(429) // Rate limited
  })
})
```

## Troubleshooting

### Rate Limiter Not Working
- Check if `keyGenerator` is returning unique keys per user/IP
- Verify memory/Redis connection for distributed deployments

### CORS Errors
- Update `ENVIRONMENT_ORIGINS` in `lib/middleware/cors.ts`
- Check `ALLOWED_ORIGINS` environment variable in production

### Cache Not Hitting
- Verify `enableCache: true` in options
- Check if `Cache-Control: no-store` is set elsewhere
- Ensure cache keys are stable (URL + query params)

### Validation Errors
- Check Zod schema matches request body structure
- Verify `Content-Type: application/json` header is set
- Review validation error messages in response

## License

Part of AI Web App Template v5.0 - See main repository LICENSE
