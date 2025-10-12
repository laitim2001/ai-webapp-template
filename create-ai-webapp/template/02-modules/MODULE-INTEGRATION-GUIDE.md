# 模組整合指南
# Module Integration Guide

**AI Web App Template v5.0**

本指南說明如何在項目中整合和組合多個模組，建立完整的應用功能。

---

## 📋 目錄

1. [整合準備](#整合準備)
2. [常見整合場景](#常見整合場景)
3. [模組依賴管理](#模組依賴管理)
4. [完整應用範例](#完整應用範例)

---

## 🔧 整合準備

### 環境配置檢查表

在整合模組前，確保以下環境配置正確：

```bash
# 1. 數據庫配置
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# 2. 認證相關（如使用 module-auth）
JWT_SECRET="your-32-byte-secret-key"
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN_EXPIRES_IN="30d"

# 3. AI功能（如使用 module-ai-integration）
OPENAI_API_KEY="sk-..."
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
AZURE_OPENAI_KEY="your-azure-key"

# 4. 緩存（如使用 module-cache）
REDIS_URL="redis://localhost:6379"

# 5. 郵件服務（如使用 module-notification）
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

---

## 🎯 常見整合場景

### 場景 1: 完整的用戶系統

**需要的模組**：
- `module-auth` - 認證與授權
- `module-notification` - 郵件通知
- `module-template` - 郵件模板

**整合步驟**：

```typescript
// 1. 用戶註冊流程
// app/api/auth/register/route.ts (基於 module-auth 擴展)

import { createUser } from '@/lib/auth-server';
import { sendEmail } from '@/lib/notification/email-service';
import { renderTemplate } from '@/lib/template/template-manager';

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  try {
    // 1. 創建用戶 (module-auth)
    const user = await createUser({ email, password, name });

    // 2. 渲染歡迎郵件 (module-template)
    const emailHtml = await renderTemplate('welcome-email', {
      userName: name,
      activationLink: `${process.env.NEXT_PUBLIC_APP_URL}/activate/${user.id}`,
    });

    // 3. 發送歡迎郵件 (module-notification)
    await sendEmail({
      to: email,
      subject: 'Welcome to Our Platform!',
      html: emailHtml,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### 場景 2: AI驅動的知識庫

**需要的模組**：
- `module-knowledge-base` - 文檔管理
- `module-ai-integration` - AI嵌入與搜索
- `module-search` - 智能查詢處理
- `module-cache` - 結果緩存

**整合步驟**：

```typescript
// lib/services/intelligent-search-service.ts

import { parseQuery } from '@/lib/search/query-processor';
import { generateEmbedding } from '@/lib/ai/embeddings';
import { searchDocuments } from '@/lib/knowledge/knowledge-base-service';
import { redisClient } from '@/lib/cache/redis-client';

export async function intelligentSearch(query: string, userId: string) {
  // 1. 檢查緩存 (module-cache)
  const cacheKey = `search:${query}:${userId}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. 解析查詢意圖 (module-search)
  const parsedQuery = await parseQuery(query);

  // 3. 生成查詢嵌入 (module-ai-integration)
  const queryEmbedding = await generateEmbedding(parsedQuery.cleanedQuery);

  // 4. 向量搜索文檔 (module-knowledge-base)
  const results = await searchDocuments({
    query: parsedQuery.cleanedQuery,
    embedding: queryEmbedding,
    limit: 10,
    intent: parsedQuery.intent,
  });

  // 5. 緩存結果 (5分鐘)
  await redisClient.set(cacheKey, JSON.stringify(results), 'EX', 300);

  return results;
}
```

---

### 場景 3: 工作流程審批系統

**需要的模組**：
- `module-workflow` - 工作流引擎
- `module-auth` - 用戶認證
- `module-notification` - 審批通知
- `module-pdf` - 生成審批文檔

**整合步驟**：

```typescript
// lib/services/approval-workflow-service.ts

import { createWorkflow, approveWorkflow } from '@/lib/workflow/engine';
import { sendEmail } from '@/lib/notification/email-service';
import { generateProposalPDF } from '@/lib/pdf/proposal-pdf-template';

export async function submitProposalForApproval(proposalId: string, userId: string) {
  // 1. 創建審批工作流 (module-workflow)
  const workflow = await createWorkflow({
    entityType: 'proposal',
    entityId: proposalId,
    currentState: 'PENDING_APPROVAL',
    metadata: { submittedBy: userId },
  });

  // 2. 生成PDF文檔 (module-pdf)
  const proposal = await getProposal(proposalId);
  const pdfBuffer = await generateProposalPDF(proposal);

  // 3. 通知審批人 (module-notification)
  const approvers = await getApprovers(proposal.departmentId);

  for (const approver of approvers) {
    await sendEmail({
      to: approver.email,
      subject: `New Proposal Requires Your Approval: ${proposal.title}`,
      template: 'approval-request',
      data: {
        approverName: approver.name,
        proposalTitle: proposal.title,
        submitterName: proposal.submitter.name,
        reviewLink: `${process.env.NEXT_PUBLIC_APP_URL}/approvals/${workflow.id}`,
      },
      attachments: [
        {
          filename: `proposal-${proposalId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  }

  return workflow;
}
```

---

### 場景 4: CRM整合與客戶管理

**需要的模組**：
- `module-dynamics365` - CRM整合
- `module-customer360` - 客戶360視圖
- `module-knowledge-base` - 客戶相關文檔
- `module-cache` - 數據緩存

**整合步驟**：

```typescript
// lib/services/customer-management-service.ts

import { Dynamics365Client } from '@/lib/dynamics365/client';
import { getCustomer360View } from '@/lib/customer360/service';
import { searchDocuments } from '@/lib/knowledge/knowledge-base-service';
import { redisClient } from '@/lib/cache/redis-client';

export async function getComprehensiveCustomerView(customerId: string) {
  // 1. 從Dynamics 365獲取CRM數據
  const d365 = new Dynamics365Client();
  const crmData = await d365.getAccount(customerId);

  // 2. 獲取本地360視圖
  const customer360 = await getCustomer360View(customerId);

  // 3. 搜索相關文檔
  const relatedDocs = await searchDocuments({
    query: `customer ${crmData.name}`,
    category: 'CUSTOMER_FILES',
    limit: 5,
  });

  // 4. 組合完整視圖
  const comprehensiveView = {
    crm: crmData,
    local: customer360,
    documents: relatedDocs,
    lastSynced: new Date(),
  };

  // 5. 緩存結果
  await redisClient.set(
    `customer:comprehensive:${customerId}`,
    JSON.stringify(comprehensiveView),
    'EX',
    1800  // 30分鐘
  );

  return comprehensiveView;
}
```

---

## 📦 模組依賴管理

### 依賴關係圖

```
module-auth (核心)
├── 被依賴: workflow, notification, customer360
└── 依賴: 無

module-api-gateway (基礎)
├── 被依賴: 所有API路由
└── 依賴: 無

module-knowledge-base
├── 被依賴: customer360, search
└── 依賴: ai-integration (可選), search (可選)

module-ai-integration
├── 被依賴: knowledge-base, customer360
└── 依賴: cache (可選)

module-workflow
├── 被依賴: 業務流程
└── 依賴: auth, notification (可選)

module-notification
├── 被依賴: workflow, auth
└── 依賴: template (可選)

module-cache
├── 被依賴: ai-integration, knowledge-base, customer360
└── 依賴: 無

module-template
├── 被依賴: notification, pdf
└── 依賴: 無

module-pdf
├── 被依賴: workflow, customer360
└── 依賴: template (可選)

module-parsers
├── 被依賴: knowledge-base
└── 依賴: 無

module-dynamics365
├── 被依賴: customer360
└── 依賴: auth

module-customer360
├── 被依賴: 業務應用
└── 依賴: knowledge-base, dynamics365 (可選), ai-integration (可選)

module-search
├── 被依賴: knowledge-base
└── 依賴: 無
```

### 安裝順序建議

```bash
# 第一層：核心基礎模組（無依賴）
1. module-auth
2. module-api-gateway
3. module-cache
4. module-template
5. module-search
6. module-parsers

# 第二層：功能模組（依賴第一層）
7. module-ai-integration  (可選依賴 cache)
8. module-notification    (可選依賴 template)
9. module-pdf            (可選依賴 template)

# 第三層：業務模組（依賴前兩層）
10. module-knowledge-base (依賴 ai-integration, search)
11. module-workflow      (依賴 auth, notification)
12. module-dynamics365   (依賴 auth)

# 第四層：高級業務模組（依賴前三層）
13. module-customer360   (依賴 knowledge-base, dynamics365, ai-integration)
```

---

## 🚀 完整應用範例

### 企業級知識管理平台

這個範例展示如何整合多個模組構建完整應用：

```typescript
// app/api/documents/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { applyMiddleware } from '@/lib/middleware/apply-middleware';
import { authMiddleware } from '@/lib/middleware/auth';
import { rateLimiterMiddleware } from '@/lib/middleware/rate-limiter';
import { createDocument } from '@/lib/knowledge/knowledge-base-service';
import { generateEmbedding } from '@/lib/ai/embeddings';
import { createWorkflow } from '@/lib/workflow/engine';
import { sendEmail } from '@/lib/notification/email-service';

export async function POST(request: NextRequest) {
  // 1. 應用中間件 (module-api-gateway + module-auth)
  const middlewareResult = await applyMiddleware(request, [
    authMiddleware,
    rateLimiterMiddleware({ max: 10, window: 60000 }),
  ]);

  if (!middlewareResult.success) {
    return middlewareResult.response;
  }

  const user = middlewareResult.user;
  const { title, content, category, tags } = await request.json();

  try {
    // 2. 生成AI嵌入 (module-ai-integration)
    const embedding = await generateEmbedding(content);

    // 3. 創建文檔 (module-knowledge-base)
    const document = await createDocument({
      title,
      content,
      category,
      tags,
      embedding,
      authorId: user.id,
    });

    // 4. 如果是重要文檔，創建審批工作流 (module-workflow)
    if (category === 'POLICY' || category === 'PROCEDURE') {
      const workflow = await createWorkflow({
        entityType: 'document',
        entityId: document.id,
        currentState: 'PENDING_REVIEW',
        metadata: {
          documentTitle: title,
          authorId: user.id,
        },
      });

      // 5. 通知審核人 (module-notification)
      const reviewers = await getReviewers(category);
      for (const reviewer of reviewers) {
        await sendEmail({
          to: reviewer.email,
          subject: `New Document Requires Review: ${title}`,
          template: 'document-review-request',
          data: {
            reviewerName: reviewer.name,
            documentTitle: title,
            authorName: user.name,
            reviewLink: `${process.env.NEXT_PUBLIC_APP_URL}/review/${workflow.id}`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      document,
      message: 'Document created successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 📚 延伸閱讀

- [模組最佳實踐](./MODULE-BEST-PRACTICES.md)
- [模組使用範例](./MODULE-USAGE-EXAMPLES.md)
- 各模組的詳細README文檔

---

**版本**: 1.0.0
**最後更新**: 2025-10-06
**維護者**: AI Web App Template Team
