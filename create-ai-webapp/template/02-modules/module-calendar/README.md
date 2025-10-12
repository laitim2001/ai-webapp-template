# Calendar Module (module-calendar)

企業級日曆整合模組，支援 Google Calendar 和 Outlook Calendar 的雙向同步。

## 📋 功能特性

### 1. Google Calendar 整合
- **OAuth 2.0 認證**: 安全的 Google 帳戶授權
- **事件管理**: 建立、讀取、更新、刪除行事曆事件
- **循環事件**: 完整支援 RRULE 格式的循環模式
- **與會者管理**: 邀請與會者、追蹤回覆狀態
- **提醒設定**: 彈出式提醒、電子郵件提醒
- **多行事曆支援**: 管理多個 Google 行事曆
- **時區處理**: 自動時區轉換和顯示
- **附件支援**: 為事件附加檔案

### 2. Outlook Calendar 整合
- **Microsoft Graph API**: 使用 Microsoft Graph 存取 Outlook 行事曆
- **OAuth 2.0 認證**: Azure AD 安全認證
- **事件管理**: 完整的 CRUD 操作
- **循環事件**: 支援複雜的循環模式
- **會議室預訂**: 尋找和預訂會議室
- **行事曆共享**: 管理行事曆權限和共享
- **Teams 整合**: 建立 Teams 會議
- **自由/忙碌查詢**: 檢查與會者可用時間

### 3. 雙向同步
- **智慧同步**: 雙向同步 Google 和 Outlook 行事曆
- **衝突偵測**: 自動偵測時間衝突
- **衝突解決**: 可設定的衝突解決策略
- **增量同步**: 只同步變更的事件
- **同步狀態追蹤**: 記錄同步歷史和狀態
- **錯誤復原**: 同步失敗自動重試
- **變更通知**: Webhook 即時變更通知

## 📁 模組結構

```
02-modules/module-calendar/
├── lib/
│   └── calendar/
│       ├── google-calendar.ts.template      # Google Calendar 整合 (~600 lines)
│       ├── outlook-calendar.ts.template     # Outlook Calendar 整合 (~500 lines)
│       ├── calendar-sync.ts.template        # 雙向同步引擎 (~288 lines)
│       ├── index.ts.template                # 統一匯出 (~50 lines)
│       └── __tests__/
│           ├── google-calendar.test.ts.template    # Google Calendar 測試 (~300 lines)
│           ├── outlook-calendar.test.ts.template   # Outlook Calendar 測試 (~300 lines)
│           └── calendar-sync.test.ts.template      # 同步引擎測試 (~200 lines)
│
├── types/
│   └── calendar.d.ts.template               # TypeScript 類型定義 (~400 lines)
│
└── README.md                                 # 本文件
```

## 🔧 安裝設定

### 步驟 1: 複製模組檔案

專案初始化時，CLI 會自動複製此模組到專案根目錄。

### 步驟 2: 環境變數設定

新增到 `.env.local`:

```bash
# Google Calendar API
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Microsoft Outlook Calendar (Microsoft Graph API)
AZURE_TENANT_ID=your-tenant-id
OUTLOOK_CLIENT_ID=your-outlook-client-id
OUTLOOK_CLIENT_SECRET=your-outlook-client-secret
OUTLOOK_REDIRECT_URI=http://localhost:3000/api/auth/outlook/callback

# Calendar Sync Settings
CALENDAR_SYNC_INTERVAL=300000  # 5 分鐘 (毫秒)
CALENDAR_SYNC_RETRY_ATTEMPTS=3
CALENDAR_CONFLICT_STRATEGY=latest  # latest | oldest | manual
```

### 步驟 3: 資料庫 Schema

需要以下資料表：

- `CalendarConnection` - 行事曆連線設定
- `CalendarEvent` - 行事曆事件
- `CalendarSync` - 同步記錄
- `CalendarConflict` - 衝突記錄

### 步驟 4: 安裝依賴套件

```bash
npm install googleapis               # Google Calendar API
npm install @microsoft/microsoft-graph-client  # Microsoft Graph API
npm install rrule                    # 循環事件規則
npm install date-fns-tz              # 時區處理
npm install isomorphic-fetch         # Graph API 依賴
```

### 步驟 5: Google Cloud Console 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 **Google Calendar API**
4. 建立 OAuth 2.0 憑證 (Web 應用程式)
5. 設定授權重新導向 URI: `http://localhost:3000/api/auth/google/callback`
6. 複製 Client ID 和 Client Secret 到 `.env.local`

### 步驟 6: Azure AD 設定

1. 前往 [Azure Portal](https://portal.azure.com/)
2. 註冊新應用程式或選擇現有應用程式
3. 新增 API 權限:
   - `Calendars.ReadWrite` - 讀寫行事曆
   - `Calendars.ReadWrite.Shared` - 讀寫共享行事曆
   - `User.Read` - 讀取使用者資訊
4. 設定重新導向 URI: `http://localhost:3000/api/auth/outlook/callback`
5. 建立 Client Secret
6. 複製 Tenant ID、Client ID 和 Client Secret 到 `.env.local`

## 📖 使用範例

### Google Calendar - 建立事件

```typescript
import { GoogleCalendarService } from '@/lib/calendar';

const googleCalendar = new GoogleCalendarService({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!
});

// 設定存取 token (從 OAuth 流程取得)
await googleCalendar.setCredentials({
  access_token: 'user-access-token',
  refresh_token: 'user-refresh-token'
});

// 建立單次事件
const event = await googleCalendar.createEvent({
  summary: '專案會議',
  description: '討論 Q1 專案進度',
  location: '會議室 A',
  start: {
    dateTime: '2025-10-15T14:00:00',
    timeZone: 'Asia/Taipei'
  },
  end: {
    dateTime: '2025-10-15T15:00:00',
    timeZone: 'Asia/Taipei'
  },
  attendees: [
    { email: 'john@example.com' },
    { email: 'jane@example.com' }
  ],
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 1440 },  // 1 天前
      { method: 'popup', minutes: 30 }      // 30 分鐘前
    ]
  }
});

console.log('事件已建立:', event.id);
```

### Google Calendar - 建立循環事件

```typescript
import { GoogleCalendarService } from '@/lib/calendar';
import { RRule } from 'rrule';

const googleCalendar = new GoogleCalendarService(config);
await googleCalendar.setCredentials(credentials);

// 每週一、三、五的站立會議
const event = await googleCalendar.createEvent({
  summary: '每日站立會議',
  start: {
    dateTime: '2025-10-15T09:00:00',
    timeZone: 'Asia/Taipei'
  },
  end: {
    dateTime: '2025-10-15T09:30:00',
    timeZone: 'Asia/Taipei'
  },
  recurrence: [
    'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=20'
  ]
});
```

### Outlook Calendar - 建立事件

```typescript
import { OutlookCalendarService } from '@/lib/calendar';

const outlookCalendar = new OutlookCalendarService({
  clientId: process.env.OUTLOOK_CLIENT_ID!,
  clientSecret: process.env.OUTLOOK_CLIENT_SECRET!,
  tenantId: process.env.AZURE_TENANT_ID!,
  redirectUri: process.env.OUTLOOK_REDIRECT_URI!
});

// 設定存取 token
await outlookCalendar.setCredentials({
  access_token: 'user-access-token',
  refresh_token: 'user-refresh-token'
});

// 建立 Teams 會議事件
const event = await outlookCalendar.createEvent({
  subject: '產品評審會議',
  body: {
    contentType: 'HTML',
    content: '<h1>議程</h1><ul><li>產品展示</li><li>功能討論</li></ul>'
  },
  start: {
    dateTime: '2025-10-20T15:00:00',
    timeZone: 'Asia/Taipei'
  },
  end: {
    dateTime: '2025-10-20T16:00:00',
    timeZone: 'Asia/Taipei'
  },
  location: {
    displayName: '線上會議'
  },
  attendees: [
    {
      emailAddress: { address: 'team@example.com' },
      type: 'required'
    }
  ],
  isOnlineMeeting: true,
  onlineMeetingProvider: 'teamsForBusiness'
});

console.log('Teams 會議已建立:', event.onlineMeeting?.joinUrl);
```

### Outlook Calendar - 尋找空閒時間

```typescript
import { OutlookCalendarService } from '@/lib/calendar';

const outlookCalendar = new OutlookCalendarService(config);
await outlookCalendar.setCredentials(credentials);

// 查詢多位與會者的空閒時間
const freeSlots = await outlookCalendar.findFreeBusyTime({
  attendees: [
    'john@example.com',
    'jane@example.com',
    'bob@example.com'
  ],
  startTime: '2025-10-20T00:00:00',
  endTime: '2025-10-20T23:59:59',
  timeZone: 'Asia/Taipei',
  meetingDuration: 60  // 60 分鐘
});

console.log('可用時段:', freeSlots);
```

### 雙向同步

```typescript
import { CalendarSyncService } from '@/lib/calendar';

const syncService = new CalendarSyncService({
  googleCalendar: googleCalendarInstance,
  outlookCalendar: outlookCalendarInstance,
  conflictStrategy: 'latest',  // 使用最新的事件
  syncInterval: 300000  // 5 分鐘
});

// 啟動自動同步
await syncService.startSync({
  userId: 123,
  googleCalendarId: 'primary',
  outlookCalendarId: 'user@example.com',
  direction: 'bidirectional'  // 雙向同步
});

// 手動同步
const result = await syncService.syncNow({
  userId: 123,
  googleCalendarId: 'primary',
  outlookCalendarId: 'user@example.com'
});

console.log('同步結果:', {
  created: result.created,
  updated: result.updated,
  deleted: result.deleted,
  conflicts: result.conflicts
});

// 停止同步
await syncService.stopSync(123);
```

### 衝突處理

```typescript
import { CalendarSyncService } from '@/lib/calendar';

const syncService = new CalendarSyncService({
  // ... 設定
  conflictStrategy: 'manual'  // 手動處理衝突
});

// 取得衝突列表
const conflicts = await syncService.getConflicts(userId);

// 解決衝突
for (const conflict of conflicts) {
  await syncService.resolveConflict({
    conflictId: conflict.id,
    resolution: 'use_google',  // 使用 Google 版本
    // resolution: 'use_outlook',  // 或使用 Outlook 版本
    // resolution: 'merge'  // 或合併
  });
}
```

## ⚠️ 資料庫轉接器轉換需求

**狀態**: 🚧 初始提取 - 需要資料庫轉接器轉換

此模組目前直接使用 Prisma。需要轉換：

- `google-calendar.ts`: ~8 個 Prisma 呼叫 → 資料庫轉接器
- `outlook-calendar.ts`: ~8 個 Prisma 呼叫 → 資料庫轉接器
- `calendar-sync.ts`: ~15 個 Prisma 呼叫 → 資料庫轉接器

**轉換範例**:

```typescript
// ❌ 目前寫法
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const connection = await prisma.calendarConnection.create({ data: {...} });

// ✅ 轉換後
import { databaseAdapter } from '@/lib/db/database-adapter';
const connection = await databaseAdapter.create('calendarConnection', { data: {...} });
```

## 📊 API 參考

### GoogleCalendarService

#### `constructor(config)`
初始化 Google Calendar 服務。

**參數**:
- `clientId` - Google OAuth Client ID
- `clientSecret` - Google OAuth Client Secret
- `redirectUri` - OAuth 重新導向 URI

#### `setCredentials(tokens)`
設定使用者的存取 token。

**參數**:
- `access_token` - OAuth 存取 token
- `refresh_token` - OAuth 刷新 token (可選)

#### `createEvent(event)`
建立行事曆事件。

**參數**:
- `summary` - 事件標題
- `description` - 事件描述 (可選)
- `location` - 地點 (可選)
- `start` - 開始時間 `{ dateTime, timeZone }`
- `end` - 結束時間 `{ dateTime, timeZone }`
- `attendees` - 與會者陣列 (可選)
- `recurrence` - RRULE 循環規則陣列 (可選)
- `reminders` - 提醒設定 (可選)

**回傳**: Promise\<CalendarEvent\>

#### `updateEvent(eventId, updates)`
更新現有事件。

#### `deleteEvent(eventId)`
刪除事件。

#### `listEvents(options)`
列出事件。

**參數**:
- `calendarId` - 行事曆 ID (預設: 'primary')
- `timeMin` - 開始時間 (可選)
- `timeMax` - 結束時間 (可選)
- `maxResults` - 最大結果數 (可選)

### OutlookCalendarService

#### `constructor(config)`
初始化 Outlook Calendar 服務。

**參數**:
- `clientId` - Azure AD Client ID
- `clientSecret` - Azure AD Client Secret
- `tenantId` - Azure AD Tenant ID
- `redirectUri` - OAuth 重新導向 URI

#### `createEvent(event)`
建立行事曆事件。

**參數**:
- `subject` - 事件標題
- `body` - 事件內容 `{ contentType, content }`
- `start` - 開始時間 `{ dateTime, timeZone }`
- `end` - 結束時間 `{ dateTime, timeZone }`
- `location` - 地點 (可選)
- `attendees` - 與會者陣列 (可選)
- `isOnlineMeeting` - 是否為線上會議 (可選)
- `onlineMeetingProvider` - 'teamsForBusiness' | 'skypeForBusiness' (可選)

#### `findFreeBusyTime(options)`
查詢空閒時間。

**參數**:
- `attendees` - 與會者電子郵件陣列
- `startTime` - 開始時間
- `endTime` - 結束時間
- `timeZone` - 時區
- `meetingDuration` - 會議時長 (分鐘)

**回傳**: Promise\<FreeSlot[]\>

### CalendarSyncService

#### `constructor(config)`
初始化同步服務。

**參數**:
- `googleCalendar` - GoogleCalendarService 實例
- `outlookCalendar` - OutlookCalendarService 實例
- `conflictStrategy` - 'latest' | 'oldest' | 'manual'
- `syncInterval` - 同步間隔 (毫秒)

#### `startSync(options)`
啟動自動同步。

**參數**:
- `userId` - 使用者 ID
- `googleCalendarId` - Google 行事曆 ID
- `outlookCalendarId` - Outlook 行事曆 ID
- `direction` - 'bidirectional' | 'google_to_outlook' | 'outlook_to_google'

#### `syncNow(options)`
立即執行同步。

**回傳**: Promise\<SyncResult\>

#### `stopSync(userId)`
停止自動同步。

#### `getConflicts(userId)`
取得同步衝突。

**回傳**: Promise\<CalendarConflict[]\>

#### `resolveConflict(options)`
解決衝突。

**參數**:
- `conflictId` - 衝突 ID
- `resolution` - 'use_google' | 'use_outlook' | 'merge'

## 🔐 安全最佳實踐

1. **Token 安全**: 加密儲存 OAuth refresh tokens
2. **權限範圍**: 只請求必要的 API 權限
3. **Token 刷新**: 實作自動 token 刷新機制
4. **HTTPS**: 生產環境必須使用 HTTPS
5. **資料驗證**: 驗證所有使用者輸入
6. **錯誤處理**: 不要在錯誤訊息中洩漏敏感資訊
7. **速率限制**: 遵守 API 配額和速率限制
8. **存取控制**: 驗證使用者對行事曆的存取權限

## 🚀 進階功能

### Webhook 變更通知

Google Calendar 支援 webhook 來即時接收變更通知：

```typescript
import { GoogleCalendarService } from '@/lib/calendar';

const googleCalendar = new GoogleCalendarService(config);

// 設定 webhook
const channel = await googleCalendar.watchEvents({
  calendarId: 'primary',
  webhookUrl: 'https://yourapp.com/api/calendar/webhook',
  ttl: 604800000  // 7 天
});

// 處理 webhook 通知 (在 API route 中)
export async function POST(req: Request) {
  const notification = await req.json();

  // 驗證通知來源
  if (!googleCalendar.verifyWebhook(notification)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 同步變更
  await syncService.syncNow({
    userId: notification.userId,
    googleCalendarId: notification.calendarId
  });

  return new Response('OK', { status: 200 });
}
```

### 批次操作

```typescript
import { GoogleCalendarService } from '@/lib/calendar';

const googleCalendar = new GoogleCalendarService(config);

// 批次建立多個事件
const events = await googleCalendar.batchCreateEvents([
  { summary: '會議 1', start: {...}, end: {...} },
  { summary: '會議 2', start: {...}, end: {...} },
  { summary: '會議 3', start: {...}, end: {...} }
]);

// 批次更新
await googleCalendar.batchUpdateEvents([
  { id: 'event1', updates: { summary: '更新標題' } },
  { id: 'event2', updates: { location: '新地點' } }
]);
```

### 時區轉換

```typescript
import { convertTimeZone, formatEventTime } from '@/lib/calendar';

// 轉換時區
const taipeiTime = '2025-10-15T14:00:00';
const newYorkTime = convertTimeZone(
  taipeiTime,
  'Asia/Taipei',
  'America/New_York'
);

console.log(newYorkTime);  // '2025-10-15T02:00:00'

// 格式化事件時間
const formattedTime = formatEventTime(event, 'Asia/Taipei', 'zh-TW');
console.log(formattedTime);  // '2025年10月15日 下午2:00'
```

## 🧪 測試

執行測試：

```bash
# 單元測試
npm test lib/calendar

# 測試覆蓋率
npm test -- --coverage lib/calendar

# 特定測試檔案
npm test google-calendar.test.ts
npm test outlook-calendar.test.ts
npm test calendar-sync.test.ts
```

測試涵蓋範圍：
- ✅ Google Calendar 事件 CRUD
- ✅ Outlook Calendar 事件 CRUD
- ✅ 循環事件處理
- ✅ 雙向同步邏輯
- ✅ 衝突偵測和解決
- ✅ 錯誤處理和重試
- ✅ Token 刷新機制
- ✅ 時區轉換

## 📈 效能考量

1. **批次操作**: 使用批次 API 減少請求次數
2. **增量同步**: 只同步變更的事件
3. **快取**: 快取常用的行事曆資料
4. **速率限制**: 實作請求佇列避免超過 API 配額
5. **並行處理**: 平行處理多個行事曆的同步

## 🐛 常見問題

### Q: Google Calendar API 配額不足？
A: Google Calendar API 有每日配額限制。考慮：
- 使用批次操作減少請求
- 實作請求快取
- 延長同步間隔
- 申請更高配額

### Q: Outlook Calendar 同步緩慢？
A: 可能原因：
- 網路延遲
- 大量事件需要同步
- 建議使用增量同步 (delta queries)
- 使用 webhook 取代輪詢

### Q: 時區處理不正確？
A: 確保：
- 事件建立時指定正確的 `timeZone`
- 使用 `date-fns-tz` 進行時區轉換
- 伺服器時區設定正確

### Q: OAuth token 過期？
A: 實作自動刷新機制：
```typescript
googleCalendar.on('token-refresh', async (tokens) => {
  await saveTokens(userId, tokens);
});
```

## 📝 變更日誌

- **v5.0** (2025-10-10): 初始建立
  - Google Calendar 完整整合
  - Outlook Calendar 完整整合
  - 雙向同步引擎
  - 衝突偵測和解決
  - 循環事件支援
  - 時區處理
  - 完整測試套件 (50+ 測試)
  - 需要資料庫轉接器轉換

## 📄 授權

屬於 AI Web App Template v5.0
