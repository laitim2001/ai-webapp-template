# Dynamics 365 Integration Module

Production-ready Dynamics 365 CRM integration with OAuth authentication and comprehensive API coverage.

## 📋 Overview

This module provides seamless integration with Microsoft Dynamics 365 CRM:
- OAuth 2.0 authentication with token management
- CRUD operations for all major entities
- Batch operations and pagination support
- Automatic sync with local database
- Query builder and data transformation
- Error handling and retry logic

## 📦 Module Contents

**Total**: 3 files, 1,228 lines of code

### Core Files
- `lib/integrations/dynamics365/auth.ts` (259 lines) - OAuth authentication
- `lib/integrations/dynamics365/client.ts` (460 lines) - API client
- `lib/integrations/dynamics365/sync.ts` (509 lines) - Data synchronization

## 🚀 Features

### 1. OAuth Authentication
- Client credentials flow
- Automatic token refresh
- Token caching and management
- Multi-tenant support
- Secure credential storage

### 2. Entity Support
- **Account** - Customer companies
- **Contact** - Contact persons
- **Opportunity** - Sales opportunities
- **Product** - Product catalog
- **Activity** - Activity records (emails, calls, meetings)

### 3. CRUD Operations
- Create entities
- Read with OData queries
- Update entity fields
- Delete entities
- Batch operations (multiple entities)

### 4. Advanced Querying
- OData query syntax support
- Field selection ($select)
- Filtering ($filter)
- Sorting ($orderby)
- Pagination ($top, $skip)
- Expand related entities ($expand)

### 5. Data Synchronization
- Bi-directional sync (D365 ↔ Local DB)
- Incremental sync (only changes)
- Conflict resolution strategies
- Scheduled sync jobs
- Sync status tracking

### 6. Error Handling
- Automatic retry with exponential backoff
- Rate limit handling (429 responses)
- Authentication error recovery
- Detailed error logging
- Graceful degradation

## 🔧 Installation

### Dependencies
```bash
npm install @azure/msal-node  # Microsoft Authentication Library
npm install axios              # HTTP client
npm install node-cron          # Scheduled tasks (optional)
```

### Environment Variables
```env
# Dynamics 365 Configuration
DYNAMICS_365_TENANT_ID=your-tenant-id
DYNAMICS_365_CLIENT_ID=your-client-id
DYNAMICS_365_CLIENT_SECRET=your-client-secret
DYNAMICS_365_RESOURCE_URL=https://yourorg.crm.dynamics.com
DYNAMICS_365_API_VERSION=9.2

# Sync Configuration (optional)
DYNAMICS_365_SYNC_ENABLED=true
DYNAMICS_365_SYNC_INTERVAL=3600000  # 1 hour in ms
```

## 📖 Usage Examples

### Authentication Setup
```typescript
import { getDynamics365AuthHeaders } from '@/lib/integrations/dynamics365/auth';

// Get authenticated headers for API requests
const headers = await getDynamics365AuthHeaders();

// Headers include:
// {
//   'Authorization': 'Bearer <access_token>',
//   'OData-MaxVersion': '4.0',
//   'OData-Version': '4.0',
//   'Accept': 'application/json',
//   'Content-Type': 'application/json'
// }
```

### CRUD Operations

#### Create Account
```typescript
import { Dynamics365Client } from '@/lib/integrations/dynamics365/client';

const client = new Dynamics365Client();

const newAccount = await client.createAccount({
  name: 'Acme Corporation',
  emailaddress1: 'info@acme.com',
  telephone1: '+1-555-0123',
  websiteurl: 'https://acme.com',
  industrycode: 1,  // Manufacturing
  numberofemployees: 500,
  address1_city: 'San Francisco',
  address1_country: 'USA'
});

console.log('Created account:', newAccount.accountid);
```

#### Read with Filters
```typescript
// Get all accounts in technology industry
const accounts = await client.getAccounts({
  filter: "industrycode eq 3",  // Technology
  select: ['accountid', 'name', 'emailaddress1', 'telephone1'],
  orderby: 'name asc',
  top: 50
});

console.log(`Found ${accounts.length} accounts`);
```

#### Update Contact
```typescript
const updatedContact = await client.updateContact(contactId, {
  jobtitle: 'Senior Sales Manager',
  telephone1: '+1-555-9876',
  emailaddress1: 'new.email@company.com'
});
```

#### Delete Opportunity
```typescript
await client.deleteOpportunity(opportunityId);
console.log('Opportunity deleted');
```

### Advanced Queries

#### Query with Expansion
```typescript
// Get accounts with related contacts
const accountsWithContacts = await client.getAccounts({
  select: ['accountid', 'name'],
  expand: 'contact_customer_accounts($select=contactid,firstname,lastname)',
  top: 10
});

accountsWithContacts.forEach(account => {
  console.log(`Account: ${account.name}`);
  account.contacts.forEach(contact => {
    console.log(`  - ${contact.firstname} ${contact.lastname}`);
  });
});
```

#### Complex Filtering
```typescript
// Get high-value opportunities closing this quarter
const opportunities = await client.getOpportunities({
  filter: `estimatedvalue ge 100000 and estimatedclosedate ge ${startDate} and estimatedclosedate le ${endDate}`,
  orderby: 'estimatedvalue desc',
  top: 20
});
```

#### Pagination
```typescript
let allAccounts = [];
let skip = 0;
const pageSize = 100;

while (true) {
  const batch = await client.getAccounts({
    top: pageSize,
    skip: skip
  });

  allAccounts = [...allAccounts, ...batch];

  if (batch.length < pageSize) break;  // Last page
  skip += pageSize;
}

console.log(`Total accounts: ${allAccounts.length}`);
```

### Batch Operations
```typescript
// Create multiple contacts in one request
const contactsToCreate = [
  { firstname: 'John', lastname: 'Doe', emailaddress1: 'john@example.com' },
  { firstname: 'Jane', lastname: 'Smith', emailaddress1: 'jane@example.com' }
];

const createdContacts = await client.batchCreateContacts(contactsToCreate);
console.log(`Created ${createdContacts.length} contacts`);
```

### Data Synchronization

#### Sync Accounts to Local DB
```typescript
import { syncAccountsFromDynamics } from '@/lib/integrations/dynamics365/sync';

// Full sync - sync all accounts
const result = await syncAccountsFromDynamics({ fullSync: true });
console.log(`Synced ${result.synced} accounts, ${result.created} new, ${result.updated} updated`);

// Incremental sync - only changes since last sync
const incrementalResult = await syncAccountsFromDynamics({
  fullSync: false,
  lastSyncTime: new Date('2025-01-01')
});
```

#### Bi-directional Sync
```typescript
import { bidirectionalSync } from '@/lib/integrations/dynamics365/sync';

// Sync local changes to D365 and D365 changes to local
const syncResult = await bidirectionalSync({
  entities: ['accounts', 'contacts', 'opportunities'],
  strategy: 'last-write-wins'  // or 'dynamics-wins' or 'local-wins'
});

console.log('Sync completed:', syncResult);
```

#### Scheduled Sync
```typescript
import cron from 'node-cron';
import { syncAllEntities } from '@/lib/integrations/dynamics365/sync';

// Sync every hour
cron.schedule('0 * * * *', async () => {
  console.log('Starting scheduled D365 sync...');
  await syncAllEntities({ fullSync: false });
  console.log('Sync completed');
});
```

### API Route Integration
```typescript
// app/api/dynamics/accounts/route.ts
import { Dynamics365Client } from '@/lib/integrations/dynamics365/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const client = new Dynamics365Client();

    const searchParams = req.nextUrl.searchParams;
    const industry = searchParams.get('industry');

    const accounts = await client.getAccounts({
      filter: industry ? `industrycode eq ${industry}` : undefined,
      top: 50
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = new Dynamics365Client();
    const accountData = await req.json();

    const newAccount = await client.createAccount(accountData);

    return NextResponse.json(
      { account: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
```

## 🏗️ Architecture

### Authentication Flow
1. **Token Request** - Request access token using client credentials
2. **Token Cache** - Store token with expiration time
3. **Token Refresh** - Auto-refresh before expiration
4. **Header Generation** - Add token to API request headers
5. **Error Recovery** - Re-authenticate on 401 errors

### API Client Architecture
```typescript
class Dynamics365Client {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.DYNAMICS_365_RESOURCE_URL}/api/data/v${process.env.DYNAMICS_365_API_VERSION}`;
  }

  // Generic request method
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const headers = await getDynamics365AuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  // Entity-specific methods
  async getAccounts(options: QueryOptions): Promise<DynamicsAccount[]> {
    const query = this.buildODataQuery(options);
    return this.request('GET', `/accounts${query}`);
  }

  // ... more methods
}
```

### Sync Architecture
```typescript
// Sync flow
1. Fetch last sync timestamp from local DB
2. Query D365 for records modified since last sync
3. Compare D365 records with local records
4. Resolve conflicts using strategy (last-write-wins, etc.)
5. Update local DB with D365 changes
6. Push local changes to D365
7. Update sync timestamp
```

## 🔒 Security Considerations

### Credential Management
```typescript
// Use environment variables, never hardcode
const config = {
  tenantId: process.env.DYNAMICS_365_TENANT_ID!,
  clientId: process.env.DYNAMICS_365_CLIENT_ID!,
  clientSecret: process.env.DYNAMICS_365_CLIENT_SECRET!
};

// For production, use Azure Key Vault
import { SecretClient } from '@azure/keyvault-secrets';

const client = new SecretClient(vaultUrl, credential);
const secret = await client.getSecret('D365-Client-Secret');
```

### Token Security
- Store tokens in memory only
- Never log tokens
- Use HTTPS for all requests
- Implement token encryption if persisting

### Data Access Control
```typescript
// Restrict data access based on user permissions
export async function getAccountsForUser(userId: string) {
  const client = new Dynamics365Client();

  // Get user's allowed accounts from permissions table
  const allowedAccountIds = await getUserAllowedAccounts(userId);

  return client.getAccounts({
    filter: `accountid in (${allowedAccountIds.join(',')})`
  });
}
```

## ⚡ Performance Tips

### 1. Use Field Selection
```typescript
// Bad - fetches all fields
const accounts = await client.getAccounts({});

// Good - fetch only needed fields
const accounts = await client.getAccounts({
  select: ['accountid', 'name', 'emailaddress1']
});
```

### 2. Implement Caching
```typescript
import { cache } from 'react';

export const getCachedAccounts = cache(async (industryCode: number) => {
  const cacheKey = `d365:accounts:${industryCode}`;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached);

  const accounts = await client.getAccounts({
    filter: `industrycode eq ${industryCode}`
  });

  await redis.set(cacheKey, JSON.stringify(accounts), 'EX', 900); // 15 min

  return accounts;
});
```

### 3. Batch Operations
```typescript
// Bad - multiple API calls
for (const account of accounts) {
  await client.createAccount(account);
}

// Good - single batch request
await client.batchCreateAccounts(accounts);
```

### 4. Parallel Sync
```typescript
// Sync multiple entities in parallel
await Promise.all([
  syncAccountsFromDynamics(),
  syncContactsFromDynamics(),
  syncOpportunitiesFromDynamics()
]);
```

## 🧪 Testing

### Unit Tests
```typescript
import { Dynamics365Client } from '@/lib/integrations/dynamics365/client';

describe('Dynamics365Client', () => {
  it('should fetch accounts', async () => {
    const client = new Dynamics365Client();
    const accounts = await client.getAccounts({ top: 10 });

    expect(accounts).toBeInstanceOf(Array);
    expect(accounts.length).toBeLessThanOrEqual(10);
  });

  it('should create account', async () => {
    const client = new Dynamics365Client();
    const newAccount = await client.createAccount({
      name: 'Test Company'
    });

    expect(newAccount.accountid).toBeDefined();
    expect(newAccount.name).toBe('Test Company');
  });
});
```

### Mock D365 API
```typescript
import { rest } from 'msw';

const handlers = [
  rest.get('*/api/data/v9.2/accounts', (req, res, ctx) => {
    return res(
      ctx.json({
        value: [
          { accountid: '1', name: 'Test Account' }
        ]
      })
    );
  })
];
```

## 📊 Monitoring

### Key Metrics
- API call success/failure rate
- Token refresh frequency
- Sync job duration
- Data sync lag (time since last sync)
- Rate limit violations

### Example Monitoring
```typescript
import { metrics } from '@/lib/monitoring';

export async function getAccounts(options: QueryOptions) {
  const startTime = Date.now();

  try {
    const accounts = await client.getAccounts(options);

    metrics.recordD365ApiCall({
      endpoint: 'accounts',
      duration: Date.now() - startTime,
      success: true,
      recordCount: accounts.length
    });

    return accounts;
  } catch (error) {
    metrics.recordD365ApiCall({
      endpoint: 'accounts',
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    });
    throw error;
  }
}
```

## 🐛 Common Issues

### Issue: Authentication fails (401)
**Solution**: Verify credentials and tenant configuration
```typescript
// Check environment variables
console.log('Tenant ID:', process.env.DYNAMICS_365_TENANT_ID?.slice(0, 8) + '...');
console.log('Resource URL:', process.env.DYNAMICS_365_RESOURCE_URL);

// Test authentication
const headers = await getDynamics365AuthHeaders();
console.log('Auth successful:', !!headers.Authorization);
```

### Issue: Rate limit exceeded (429)
**Solution**: Implement retry with exponential backoff
```typescript
// Already implemented in client with automatic retry
// Adjust MAX_RETRIES in client.ts if needed
```

### Issue: Sync conflicts
**Solution**: Choose appropriate conflict resolution strategy
```typescript
// Last-write-wins (default)
await bidirectionalSync({ strategy: 'last-write-wins' });

// D365 always wins
await bidirectionalSync({ strategy: 'dynamics-wins' });

// Local always wins
await bidirectionalSync({ strategy: 'local-wins' });
```

## 📚 Resources

- [Dynamics 365 Web API Reference](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/webapi/web-api-service-documents)
- [OData Query Options](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/webapi/query-data-web-api)
- [OAuth with MSAL](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)

## 🔄 Version History

- **v1.0.0** - Initial extraction from AI Sales Enablement Platform
  - OAuth authentication
  - CRUD operations for 5 entity types
  - Bi-directional sync
  - Batch operations
  - Error handling and retry logic

---

Part of **AI Web App Template v5.0**
