# 模組使用範例
# Module Usage Examples

**AI Web App Template v5.0**

本文檔提供所有模組的實用程式碼範例，幫助您快速開始使用各個模組。

---

## 📋 目錄

1. [認證模組 (module-auth)](#認證模組-module-auth)
2. [API Gateway模組 (module-api-gateway)](#api-gateway模組-module-api-gateway)
3. [知識庫模組 (module-knowledge-base)](#知識庫模組-module-knowledge-base)
4. [AI整合模組 (module-ai-integration)](#ai整合模組-module-ai-integration)
5. [工作流程模組 (module-workflow)](#工作流程模組-module-workflow)
6. [通知系統模組 (module-notification)](#通知系統模組-module-notification)
7. [緩存系統模組 (module-cache)](#緩存系統模組-module-cache)
8. [模板引擎模組 (module-template)](#模板引擎模組-module-template)
9. [PDF生成模組 (module-pdf)](#pdf生成模組-module-pdf)
10. [文件解析模組 (module-parsers)](#文件解析模組-module-parsers)
11. [Dynamics 365模組 (module-dynamics365)](#dynamics-365模組-module-dynamics365)
12. [Customer 360模組 (module-customer360)](#customer-360模組-module-customer360)
13. [搜索模組 (module-search)](#搜索模組-module-search)

---

## 🔐 認證模組 (module-auth)

### 基礎用戶註冊與登入

```typescript
// app/api/auth/register/route.ts (已包含在模組中)
// 前端調用範例

// 1. 註冊新用戶
async function registerUser() {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'StrongP@ss123',
      name: 'John Doe',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  console.log('User created:', data.user);
}

// 2. 用戶登入
async function loginUser() {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'StrongP@ss123',
    }),
  });

  const data = await response.json();

  // Access token 會自動設置在HTTP-only cookie中
  console.log('Login successful:', data.user);

  // Refresh token 也在cookie中
  return data.user;
}
```

### 使用 React Hook

```typescript
// components/LoginForm.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Azure AD SSO登入

```typescript
// 前端觸發Azure AD登入
function azureAdLogin() {
  window.location.href = '/api/auth/azure-ad/login';
}

// Azure AD會自動處理回調
// 用戶將在登入後被重定向到 /dashboard
```

---

## 🌐 API Gateway模組 (module-api-gateway)

### 添加中間件到API路由

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { applyMiddleware } from '@/lib/middleware/apply-middleware';
import { corsMiddleware } from '@/lib/middleware/cors';
import { rateLimiterMiddleware } from '@/lib/middleware/rate-limiter';
import { securityHeadersMiddleware } from '@/lib/middleware/security-headers';

export async function GET(request: NextRequest) {
  // 應用多個中間件
  const middlewareResult = await applyMiddleware(request, [
    corsMiddleware,
    rateLimiterMiddleware({ max: 100, window: 60000 }), // 100次/分鐘
    securityHeadersMiddleware,
  ]);

  if (!middlewareResult.success) {
    return middlewareResult.response;
  }

  // 業務邏輯
  const users = await getUsers();
  return NextResponse.json(users);
}
```

### 使用錯誤處理

```typescript
// app/api/products/[id]/route.ts
import { handleApiError } from '@/lib/errors/api-error-handler';
import { AppError, ErrorCode } from '@/lib/errors/app-error';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id);

    if (!product) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        'Product not found',
        { productId: params.id }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error);  // 自動轉換為適當的HTTP響應
  }
}
```

---

## 📚 知識庫模組 (module-knowledge-base)

### 創建和搜索知識庫文檔

```typescript
// lib/knowledge-base-service.ts
import { createDocument, searchDocuments } from '@/lib/knowledge/knowledge-base-service';
import { generateEmbedding } from '@/lib/ai/embeddings';

// 1. 創建文檔
async function createKnowledgeDocument() {
  const document = await createDocument({
    title: 'API Authentication Guide',
    content: 'This guide explains how to authenticate with our API...',
    category: 'DOCUMENTATION',
    tags: ['api', 'authentication', 'guide'],
    authorId: currentUser.id,
  });

  console.log('Document created:', document.id);
  return document;
}

// 2. 向量搜索
async function searchKnowledge(query: string) {
  // 生成查詢的嵌入向量
  const queryEmbedding = await generateEmbedding(query);

  // 執行向量搜索
  const results = await searchDocuments({
    query,
    embedding: queryEmbedding,
    limit: 10,
    category: 'DOCUMENTATION',
  });

  console.log(`Found ${results.length} documents`);
  return results;
}
```

### 使用版本控制

```typescript
import { createVersion, getVersionHistory } from '@/lib/knowledge/version-control';

// 創建新版本
async function updateDocument(documentId: string, newContent: string) {
  const version = await createVersion({
    documentId,
    content: newContent,
    versionNumber: 2,
    changes: 'Updated authentication examples',
    userId: currentUser.id,
  });

  return version;
}

// 查看版本歷史
async function viewHistory(documentId: string) {
  const history = await getVersionHistory(documentId);

  history.forEach(version => {
    console.log(`v${version.versionNumber}: ${version.changes}`);
  });
}
```

---

## 🤖 AI整合模組 (module-ai-integration)

### 使用OpenAI聊天

```typescript
import { openaiClient } from '@/lib/ai/openai-client';

async function chatWithAI(userMessage: string) {
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant for our knowledge base system.',
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const response = completion.choices[0].message.content;
  return response;
}
```

### 生成嵌入向量

```typescript
import { generateEmbedding, generateBatchEmbeddings } from '@/lib/ai/embeddings';

// 單個文本
async function embedText() {
  const embedding = await generateEmbedding(
    'How do I authenticate with the API?'
  );

  console.log('Embedding dimensions:', embedding.length);  // 1536
  return embedding;
}

// 批量生成
async function embedMultiple() {
  const texts = [
    'What is the API rate limit?',
    'How do I reset my password?',
    'Where can I find the documentation?',
  ];

  const embeddings = await generateBatchEmbeddings(texts);
  console.log(`Generated ${embeddings.length} embeddings`);
  return embeddings;
}
```

---

## 🔄 工作流程模組 (module-workflow)

### 創建和管理工作流程

```typescript
import { createWorkflow, transitionState, approveWorkflow } from '@/lib/workflow/engine';

// 1. 創建新工作流程（例如：提案審批）
async function createProposalWorkflow(proposalId: string) {
  const workflow = await createWorkflow({
    entityType: 'proposal',
    entityId: proposalId,
    currentState: 'DRAFT',
    metadata: {
      proposalTitle: 'Q4 Marketing Campaign',
      requestedBy: currentUser.id,
    },
  });

  return workflow;
}

// 2. 狀態轉換
async function submitForReview(workflowId: string) {
  const updated = await transitionState(workflowId, {
    fromState: 'DRAFT',
    toState: 'PENDING_REVIEW',
    userId: currentUser.id,
    comment: 'Submitting for manager review',
  });

  return updated;
}

// 3. 審批
async function approveProposal(workflowId: string) {
  const approved = await approveWorkflow(workflowId, {
    approverId: currentUser.id,
    decision: 'APPROVED',
    comment: 'Looks good, approved!',
  });

  // 自動轉換到下一個狀態
  return approved;
}
```

---

## 📢 通知系統模組 (module-notification)

### 發送各種類型的通知

```typescript
import { sendEmail } from '@/lib/notification/email-service';
import { createNotification } from '@/lib/notification/notification-service';

// 1. 發送郵件
async function sendWelcomeEmail(user: User) {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Our Platform!',
    template: 'welcome',
    data: {
      userName: user.name,
      loginUrl: 'https://app.example.com/login',
    },
  });
}

// 2. 創建站內通知
async function notifyUser(userId: string) {
  const notification = await createNotification({
    userId,
    type: 'PROPOSAL_APPROVED',
    title: 'Your proposal has been approved',
    message: 'Congratulations! Your Q4 campaign proposal has been approved.',
    link: '/proposals/123',
    priority: 'HIGH',
  });

  return notification;
}

// 3. Webhook通知（用於整合外部系統）
async function sendWebhook(eventType: string, data: any) {
  await fetch(process.env.WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: eventType,
      timestamp: new Date().toISOString(),
      data,
    }),
  });
}
```

---

## ⚡ 緩存系統模組 (module-cache)

### 使用Redis緩存

```typescript
import { redisClient } from '@/lib/cache/redis-client';

// 1. 基本鍵值操作
async function cacheUserData(userId: string, userData: any) {
  const key = `user:${userId}`;

  // 存儲（TTL: 1小時）
  await redisClient.set(key, JSON.stringify(userData), 'EX', 3600);

  // 讀取
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
}

// 2. 列表操作
async function cacheRecentActivities(userId: string, activity: any) {
  const key = `activities:${userId}`;

  // 添加到列表頭部
  await redisClient.lpush(key, JSON.stringify(activity));

  // 保留最近100條
  await redisClient.ltrim(key, 0, 99);

  // 讀取最近10條
  const recent = await redisClient.lrange(key, 0, 9);
  return recent.map(item => JSON.parse(item));
}

// 3. 集合操作（用於標籤、分類等）
async function manageUserTags(userId: string) {
  const key = `user:${userId}:tags`;

  // 添加標籤
  await redisClient.sadd(key, 'premium', 'verified', 'early-adopter');

  // 檢查是否有特定標籤
  const hasPremium = await redisClient.sismember(key, 'premium');

  // 獲取所有標籤
  const allTags = await redisClient.smembers(key);

  return allTags;
}
```

---

## 📝 模板引擎模組 (module-template)

### 使用Handlebars模板

```typescript
import { TemplateEngine } from '@/lib/template/template-engine';
import { createTemplate, renderTemplate } from '@/lib/template/template-manager';

const engine = new TemplateEngine();

// 1. 創建郵件模板
async function createEmailTemplate() {
  const template = await createTemplate({
    name: 'welcome-email',
    content: `
      <h1>Welcome, {{userName}}!</h1>
      <p>Thank you for joining {{companyName}}.</p>
      <p>Your account details:</p>
      <ul>
        <li>Email: {{userEmail}}</li>
        <li>Account Type: {{accountType}}</li>
      </ul>
      {{#if isPremium}}
        <p>You have premium access! Enjoy exclusive features.</p>
      {{/if}}
    `,
    type: 'EMAIL',
    category: 'ONBOARDING',
  });

  return template;
}

// 2. 渲染模板
async function sendWelcomeEmail(user: User) {
  const html = await renderTemplate('welcome-email', {
    userName: user.name,
    userEmail: user.email,
    companyName: 'Your Company',
    accountType: user.subscription,
    isPremium: user.subscription === 'PREMIUM',
  });

  // 使用html發送郵件
  await sendEmail({
    to: user.email,
    subject: 'Welcome!',
    html,
  });
}
```

---

## 📄 PDF生成模組 (module-pdf)

### 生成PDF文檔

```typescript
import { generatePDF } from '@/lib/pdf/pdf-generator';
import { generateProposalPDF } from '@/lib/pdf/proposal-pdf-template';

// 1. 從HTML生成PDF
async function createCustomPDF() {
  const html = `
    <h1>Invoice #12345</h1>
    <p>Customer: John Doe</p>
    <table>
      <tr><th>Item</th><th>Quantity</th><th>Price</th></tr>
      <tr><td>Product A</td><td>2</td><td>$50</td></tr>
      <tr><td>Product B</td><td>1</td><td>$30</td></tr>
    </table>
    <p><strong>Total: $130</strong></p>
  `;

  const pdfBuffer = await generatePDF(html, {
    format: 'A4',
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
  });

  return pdfBuffer;
}

// 2. 使用預定義模板
async function createProposalPDF(proposalData: any) {
  const pdfBuffer = await generateProposalPDF(proposalData);

  // 保存或發送PDF
  return pdfBuffer;
}
```

---

## 📊 文件解析模組 (module-parsers)

### 解析不同類型的文件

```typescript
import {
  parsePDF,
  parseWord,
  parseExcel,
  parseImageWithOCR,
} from '@/lib/parsers';

// 1. PDF解析
async function extractPDFText(file: File) {
  const buffer = await file.arrayBuffer();
  const result = await parsePDF(Buffer.from(buffer));

  console.log('Text:', result.text);
  console.log('Page count:', result.pageCount);
  console.log('Metadata:', result.metadata);

  return result;
}

// 2. Word文檔解析
async function extractWordContent(file: File) {
  const buffer = await file.arrayBuffer();
  const result = await parseWord(Buffer.from(buffer));

  console.log('Content:', result.content);
  console.log('Images:', result.images.length);

  return result;
}

// 3. Excel解析
async function extractExcelData(file: File) {
  const buffer = await file.arrayBuffer();
  const result = await parseExcel(Buffer.from(buffer));

  result.sheets.forEach(sheet => {
    console.log(`Sheet: ${sheet.name}`);
    console.log(`Rows: ${sheet.data.length}`);
  });

  return result;
}

// 4. OCR圖像識別
async function extractImageText(imageFile: File) {
  const buffer = await imageFile.arrayBuffer();
  const result = await parseImageWithOCR(Buffer.from(buffer), {
    lang: 'eng+chi_tra',  // 英文 + 繁體中文
  });

  console.log('Extracted text:', result.text);
  console.log('Confidence:', result.confidence);

  return result;
}
```

---

## 🔗 Dynamics 365模組 (module-dynamics365)

### 與Dynamics 365整合

```typescript
import { Dynamics365Client } from '@/lib/dynamics365/client';
import { syncCustomers, syncOpportunities } from '@/lib/dynamics365/sync';

const d365 = new Dynamics365Client();

// 1. 查詢客戶
async function searchD365Customers() {
  const customers = await d365.queryAccounts({
    filter: "industrycode eq 1",  // 過濾條件
    top: 10,
  });

  customers.forEach(customer => {
    console.log(`${customer.name} - ${customer.emailaddress1}`);
  });

  return customers;
}

// 2. 創建商機
async function createD365Opportunity() {
  const opportunity = await d365.createOpportunity({
    name: 'Q4 Enterprise Deal',
    customerid: 'account-id-here',
    estimatedvalue: 100000,
    estimatedclosedate: new Date('2025-12-31'),
  });

  return opportunity;
}

// 3. 雙向同步
async function syncWithD365() {
  // 從Dynamics 365同步到本地
  await syncCustomers({
    direction: 'pull',
    lastSyncDate: new Date('2025-10-01'),
  });

  // 從本地同步到Dynamics 365
  await syncOpportunities({
    direction: 'push',
    filter: { status: 'NEW' },
  });
}
```

---

## 👤 Customer 360模組 (module-customer360)

### 獲取客戶360度視圖

```typescript
import { getCustomer360View } from '@/lib/customer360/service';

async function viewCustomerProfile(customerId: string) {
  const customer360 = await getCustomer360View(customerId);

  // 基本信息
  console.log('Name:', customer360.basicInfo.name);
  console.log('Email:', customer360.basicInfo.email);
  console.log('Segment:', customer360.basicInfo.segment);

  // 互動歷史
  console.log('Total interactions:', customer360.interactions.total);
  customer360.interactions.recent.forEach(interaction => {
    console.log(`- ${interaction.type}: ${interaction.summary}`);
  });

  // 購買歷史
  console.log('Total spent:', customer360.purchases.totalValue);
  console.log('Orders:', customer360.purchases.orderCount);

  // AI洞察
  console.log('Churn risk:', customer360.insights.churnRisk);
  console.log('Recommendations:', customer360.insights.recommendations);

  return customer360;
}
```

---

## 🔍 搜索模組 (module-search)

### 智能查詢處理

```typescript
import { parseQuery, detectQueryIntent } from '@/lib/search/query-processor';

async function processSearchQuery(userInput: string) {
  // 解析查詢
  const queryResult = await parseQuery(userInput);

  console.log('Cleaned query:', queryResult.cleanedQuery);
  console.log('Keywords:', queryResult.keywords);
  console.log('Intent:', queryResult.intent);
  console.log('Language:', queryResult.language);

  // 根據意圖執行不同搜索
  switch (queryResult.intent) {
    case 'specific_document':
      // 精確搜索特定文檔
      break;
    case 'how_to_guide':
      // 優先搜索教學文檔
      break;
    case 'troubleshooting':
      // 搜索故障排除指南
      break;
    default:
      // 一般搜索
  }

  return queryResult;
}
```

---

## 📚 延伸閱讀

- [模組最佳實踐](./MODULE-BEST-PRACTICES.md)
- [模組整合指南](./MODULE-INTEGRATION-GUIDE.md)
- 各模組的詳細README文檔

---

**版本**: 1.0.0
**最後更新**: 2025-10-06
**維護者**: AI Web App Template Team
