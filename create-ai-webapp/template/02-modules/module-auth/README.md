# Authentication Module (module-auth)

Complete JWT-based authentication system with Azure AD SSO support for the AI Web App Template.

## 📋 Features

### 1. JWT Dual Token System
- **Access Token**: Short-lived (15 minutes), contains user identity
- **Refresh Token**: Long-lived (30 days), stored in database with SHA256 hash
- **Token Rotation**: Automatic refresh token rotation on use
- **Token Blacklist**: Revoked access tokens tracked in database

### 2. User Authentication
- **Registration**: Email + password with bcrypt hashing (12 rounds)
- **Login**: Email/password validation with JWT token generation
- **Logout**: Token revocation and cookie clearing
- **Password Validation**: 8+ characters, uppercase, lowercase, number, special character

### 3. Azure AD SSO Integration
- **OAuth 2.0 Flow**: MSAL Node integration
- **Auto User Sync**: First-time login creates local user
- **Role Mapping**: Azure AD roles → application roles
- **Single Sign-Out**: Logout from Azure AD and application

### 4. Session Management
- **Multi-Device Support**: Track active sessions per device
- **Device Fingerprinting**: Device ID, IP address, User-Agent tracking
- **Session Listing**: View all active devices
- **Selective Logout**: Logout from specific device or all devices

### 5. Security Features
- **bcrypt Password Hashing**: 12 rounds, rainbow table resistant
- **JWT Signature Verification**: HS256 with secret key
- **HTTP-Only Cookies**: XSS protection
- **CSRF Protection**: SameSite=strict cookies
- **Token Expiration**: Automatic invalidation
- **Rate Limiting Ready**: Login attempt tracking structure

## 📁 Module Structure

```
02-modules/module-auth/
├── lib/
│   ├── auth.ts.template              # Client-side validation (password, email)
│   ├── auth-server.ts.template       # Server-side auth (JWT, bcrypt, user creation)
│   └── auth/
│       ├── token-service.ts.template # Token management (access, refresh, blacklist)
│       └── azure-ad-service.ts.template  # Azure AD SSO integration
│
├── api/auth/                          # API routes (copied to app/api/auth/ during init)
│   ├── login/route.ts.template       # POST /api/auth/login
│   ├── register/route.ts.template    # POST /api/auth/register
│   ├── logout/route.ts.template      # POST /api/auth/logout
│   ├── refresh/route.ts.template     # POST /api/auth/refresh
│   ├── me/route.ts.template          # GET /api/auth/me
│   └── azure-ad/
│       ├── login/route.ts.template   # GET /api/auth/azure-ad/login
│       └── callback/route.ts.template # GET /api/auth/azure-ad/callback
│
├── hooks/
│   └── use-auth.tsx.template         # React authentication hook & context
│
├── types/
│   └── auth.ts.template              # TypeScript type definitions
│
├── __tests__/
│   ├── auth/
│   │   └── login.test.tsx.template   # Component tests
│   └── api/auth/
│       ├── login.test.ts.template    # API endpoint tests
│       └── register.test.ts.template # API endpoint tests
│
├── README.md                          # This file
├── DAY15-16-SUMMARY.md               # Extraction summary
└── EXTRACTION-STATUS.md              # Extraction status tracking
```

**Note**: The `api/auth/` directory contains template files that will be copied to `app/api/auth/` in your project during initialization (Next.js 14 App Router standard).

## 🔧 Installation

### Step 1: Copy Module Files

During project initialization, the CLI will copy this module to your project root.

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# JWT Configuration (Required)
JWT_SECRET={{RANDOM_32_BYTE_STRING}}
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=30d
JWT_EXPIRES_IN=7d  # For compatibility

# Azure AD (Optional - for SSO)
AZURE_AD_CLIENT_ID={{YOUR_CLIENT_ID}}
AZURE_AD_CLIENT_SECRET={{YOUR_CLIENT_SECRET}}
AZURE_AD_TENANT_ID={{YOUR_TENANT_ID}}
NEXT_PUBLIC_APP_URL={{YOUR_APP_URL}}

# Security
NODE_ENV=production  # Enables secure cookies in production
```

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Database Schema

The authentication module requires these tables (automatically created during init):

- `User` - User accounts
- `RefreshToken` - Active refresh tokens with device tracking
- `TokenBlacklist` - Revoked access tokens

**Schema is already included in**:
- `01-base/prisma/schema.postgresql.prisma`
- `01-base/prisma/schema.mysql.prisma`
- `01-base/prisma/schema.mongodb.prisma`
- `01-base/prisma/schema.sqlite.prisma`

### Step 4: Install Dependencies

```bash
npm install jsonwebtoken bcryptjs @azure/msal-node
npm install -D @types/jsonwebtoken @types/bcryptjs
```

## 📖 Usage

### Basic Authentication Flow

#### 1. User Registration

```typescript
// POST /api/auth/register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    department: 'Sales'  // Optional
  })
})

const { user } = await response.json()
```

#### 2. User Login

```typescript
// POST /api/auth/login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Important: send cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    deviceId: 'device-123'  // Optional: for multi-device tracking
  })
})

const { user, accessToken, refreshToken, expiresIn } = await response.json()
// Tokens are also set as HTTP-only cookies
```

#### 3. Token Refresh

```typescript
// POST /api/auth/refresh
// Refresh token is automatically sent via cookie
const response = await fetch('/api/auth/refresh', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({
    rotateRefreshToken: true  // Optional: rotate refresh token
  })
})

const { accessToken, refreshToken, expiresIn } = await response.json()
```

#### 4. User Logout

```typescript
// POST /api/auth/logout
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({
    logoutAllDevices: false  // true = logout from all devices
  })
})

const { message } = await response.json()
```

#### 5. Get Current User

```typescript
// GET /api/auth/me
const response = await fetch('/api/auth/me', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${accessToken}`  // Or use cookie
  }
})

const { user } = await response.json()
```

### Azure AD SSO Flow

#### 1. Initiate Azure AD Login

```typescript
// GET /api/auth/azure-ad/login
// Redirects to Azure AD login page
window.location.href = '/api/auth/azure-ad/login'
```

#### 2. Azure AD Callback (Automatic)

```typescript
// GET /api/auth/azure-ad/callback?code=...&state=...
// Handled automatically, redirects to dashboard
// Tokens are set as HTTP-only cookies
```

#### 3. Azure AD Logout

```typescript
// 1. Logout from application
await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
})

// 2. Redirect to Azure AD logout
window.location.href = '/api/auth/azure-ad/logout-url'
```

### Server-Side Usage

```typescript
import { verifyAccessToken } from '@/lib/auth/token-service'
import { getUserFromToken } from '@/lib/auth-server'

// Verify access token
const payload = await verifyAccessToken(accessToken)
console.log(payload.userId, payload.email, payload.role)

// Get full user from token
const user = await getUserFromToken(accessToken)
```

## 🔒 Security Best Practices

### 1. Token Storage
- **Access Token**: Store in memory or sessionStorage (frontend)
- **Refresh Token**: HTTP-only cookie (automatic)
- **Never** store tokens in localStorage (XSS risk)

### 2. Token Transmission
- Always use HTTPS in production
- Send access token in `Authorization: Bearer {token}` header
- Cookies are automatically sent with `credentials: 'include'`

### 3. Token Lifecycle
- Access tokens expire in 15 minutes
- Refresh tokens expire in 30 days
- Implement auto-refresh before access token expires
- Revoke tokens on logout

### 4. Password Security
- Minimum 8 characters
- Requires uppercase, lowercase, number, special character
- bcrypt with 12 rounds (slow hashing)
- Never log or expose password hashes

### 5. CSRF Protection
- Use `SameSite=strict` cookies
- Verify state parameter in OAuth flows
- Use POST for state-changing operations

## 🗄️ Database Adapter Integration

This module uses the **database adapter pattern** to support multiple databases:

```typescript
import { databaseAdapter } from '@/lib/db/database-adapter'

// Find user by email
const user = await databaseAdapter.findUnique('user', {
  where: { email: 'user@example.com' }
})

// Create refresh token
const token = await databaseAdapter.create('refreshToken', {
  data: {
    user_id: userId,
    token_hash: hash,
    expires_at: expiresAt,
    is_active: true
  }
})

// Revoke all user tokens
await databaseAdapter.updateMany('refreshToken', {
  where: { user_id: userId, is_active: true },
  data: { is_active: false, revoked_at: new Date() }
})
```

**Supported Databases**:
- PostgreSQL
- MySQL
- MongoDB
- SQLite

## 📊 API Reference

### POST /api/auth/register

Register a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Sales"
}
```

**Response** (201):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `400` - Validation error (weak password, invalid email)
- `409` - Email already exists

### POST /api/auth/login

Authenticate user and receive tokens.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "deviceId": "device-123"
}
```

**Response** (200):
```json
{
  "user": { "id": 1, "email": "user@example.com", "role": "USER" },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Cookies Set**:
- `auth-token`: Access token (15 min)
- `refresh-token`: Refresh token (30 days)

**Errors**:
- `400` - Invalid email format
- `401` - Invalid email or password

### POST /api/auth/refresh

Refresh access token using refresh token.

**Request**:
```json
{
  "rotateRefreshToken": true,
  "deviceId": "device-123"
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Errors**:
- `401` - Invalid or expired refresh token

### POST /api/auth/logout

Logout user and revoke tokens.

**Request**:
```json
{
  "logoutAllDevices": false
}
```

**Response** (200):
```json
{
  "message": "Logout successful"
}
```

### GET /api/auth/me

Get current authenticated user.

**Headers**:
```
Authorization: Bearer {access token}
```

**Response** (200):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "USER"
  }
}
```

**Errors**:
- `401` - Invalid or missing token

### GET /api/auth/azure-ad/login

Initiate Azure AD OAuth flow (redirects to Azure AD).

### GET /api/auth/azure-ad/callback

Handle Azure AD OAuth callback (automatic).

**Query Parameters**:
- `code`: Authorization code from Azure AD
- `state`: CSRF protection state

**Redirects to**: `/dashboard` (on success)

## 🧪 Testing

### Manual Testing

1. **Register User**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

3. **Get Current User**:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

4. **Logout**:
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

### Automated Testing

See `__tests__/auth/` directory for test examples (if testing module selected).

## 🚀 Production Deployment

### Environment Checklist

- [ ] Set strong `JWT_SECRET` (32+ bytes random)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Configure allowed CORS origins
- [ ] Set up Azure AD app (if using SSO)
- [ ] Configure rate limiting (recommended)
- [ ] Set up monitoring for failed login attempts

### Performance Optimization

1. **Token Cleanup**: Run daily cleanup jobs
```typescript
import { cleanupExpiredBlacklistedTokens, cleanupExpiredRefreshTokens } from '@/lib/auth/token-service'

// Cron job or scheduled task
await cleanupExpiredBlacklistedTokens()
await cleanupExpiredRefreshTokens()
```

2. **Database Indexing**: Ensure indexes on:
- `User.email` (unique)
- `RefreshToken.user_id`
- `RefreshToken.is_active`
- `TokenBlacklist.token_jti` (unique)

3. **Token Expiration**: Adjust based on security needs
- Shorter access token = more secure, more refreshes
- Longer refresh token = less frequent re-login, higher risk

## 📝 Changelog

- **v5.0** (2025-10-05): Initial extraction from AI Sales Enablement Platform
  - JWT dual token system
  - Azure AD SSO integration
  - Multi-database support via adapter pattern
  - Comprehensive security features

## 🤝 Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- Documentation: See `/docs` directory in main project

## 📄 License

Part of AI Web App Template v5.0
