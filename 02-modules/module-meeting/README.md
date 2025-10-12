# Meeting 會議管理模組

**版本**: 5.0
**狀態**: 生產就緒
**創建日期**: 2025-10-10

## 📋 概述

Meeting 模組為您的 Next.js 應用提供全面的會議管理功能,包括 Microsoft Teams 整合、智能會議調度、AI 驅動的會議智能分析。從 AI 銷售賦能平台提取,經過生產環境驗證。

## 🎯 功能特性

### 1. Microsoft Teams 整合 (`lib/meeting/teams-integration.ts`)
- **Teams 會議創建**: 通過 Microsoft Graph API 創建和管理 Teams 線上會議
- **日曆整合**: 創建和管理 Outlook 日曆事件與 Teams 會議
- **參與者管理**: 添加/移除參與者,設置角色和權限
- **會議設置**: 配置大廳設置、錄製選項、演示者權限
- **音頻會議**: 支持撥入號碼和會議 ID
- **出席報告**: 獲取會議出席記錄和統計
- **會議室查找**: 搜索可用的會議室資源
- **用戶狀態**: 查詢參與者的在線狀態
- **會議邀請**: 發送包含會議詳情的電子郵件邀請

### 2. 會議調度 (`lib/meeting/meeting-scheduler.ts`)
- **智能時段查找**: 基於參與者可用性查找最佳會議時間
- **衝突檢測**: 自動檢測和報告日程衝突
- **時區處理**: 跨時區智能調度
- **循環會議**: 支持每日、每週、每月循環會議模式
- **工作時間**: 遵守工作時間和排除週末設置
- **會議室預訂**: 查找和預訂可用的會議室
- **緩衝時間**: 會議前後的緩衝時間支持
- **最佳時間建議**: AI 驅動的跨時區最佳時間推薦

### 3. 會議智能 (`lib/meeting/meeting-intelligence.ts`)
- **自動摘要**: 使用 Azure OpenAI 生成會議摘要
- **行動項目提取**: 自動識別和提取會議中的任務
- **關鍵點識別**: 提取會議的主要討論點和決策
- **主題分析**: 識別會議討論的主要主題
- **情感分析**: 分析會議整體情緒(積極/中性/消極)
- **會議分析**: 計算發言時間、參與率、參與度分數
- **會議筆記生成**: 自動生成 Markdown 格式的會議筆記
- **行動項目追蹤**: 管理和更新行動項目狀態

## 📦 安裝配置

### 1. 模組整合

複製模組到您的項目:
```bash
cp -r 02-modules/module-meeting/lib/meeting lib/
cp -r 02-modules/module-meeting/types/meeting.d.ts types/
```

### 2. 依賴安裝

添加必需的依賴到 `package.json`:
```json
{
  "dependencies": {
    "@microsoft/microsoft-graph-client": "^3.0.7",
    "@azure/openai": "^1.0.0-beta.12",
    "isomorphic-fetch": "^3.0.0",
    "date-fns": "^3.0.0",
    "date-fns-tz": "^2.0.0"
  }
}
```

然後運行:
```bash
npm install
```

### 3. 環境變量

添加到您的 `.env.local`:
```bash
# Microsoft Teams / Graph API
AZURE_TENANT_ID=your-tenant-id
TEAMS_CLIENT_ID=your-teams-client-id
TEAMS_CLIENT_SECRET=your-teams-client-secret
TEAMS_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Azure OpenAI (用於會議智能)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_KEY=your-openai-key
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### 4. Azure 應用註冊

1. 訪問 [Azure Portal](https://portal.azure.com)
2. 導航到 **Azure Active Directory** → **App registrations**
3. 創建新應用註冊:
   - 名稱: 您的應用名稱
   - 支持的帳戶類型: 選擇適當的選項
   - 重定向 URI: `http://localhost:3000/api/auth/callback`

4. 配置 API 權限:
   - `OnlineMeetings.ReadWrite` - 創建和管理 Teams 會議
   - `Calendars.ReadWrite` - 管理日曆事件
   - `User.Read.All` - 讀取用戶信息
   - `Place.Read.All` - 查找會議室

5. 創建客戶端密鑰:
   - 在 **Certificates & secrets** 下創建新密鑰
   - 複製值到 `TEAMS_CLIENT_SECRET`

## 🚀 使用方法

### Teams 整合

#### 創建 Teams 會議

```typescript
import { createTeamsIntegration } from '@/lib/meeting/teams-integration';

const teamsIntegration = createTeamsIntegration();
await teamsIntegration.initialize();

const meeting = await teamsIntegration.createOnlineMeeting(
  'Product Planning Meeting',
  '2025-10-15T10:00:00Z',
  '2025-10-15T11:00:00Z',
  [
    { email: 'user1@example.com', name: 'Alice', role: 'presenter' },
    { email: 'user2@example.com', name: 'Bob', role: 'attendee' }
  ],
  {
    allowedPresenters: 'organization',
    recordAutomatically: true,
    lobbyBypassScope: 'organization'
  }
);

console.log('Join URL:', meeting.joinUrl);
console.log('Meeting ID:', meeting.id);
```

#### 創建日曆事件與 Teams 會議

```typescript
const event = await teamsIntegration.createCalendarEvent('me', {
  subject: 'Weekly Team Sync',
  start: {
    dateTime: '2025-10-15T14:00:00',
    timeZone: 'Asia/Taipei'
  },
  end: {
    dateTime: '2025-10-15T15:00:00',
    timeZone: 'Asia/Taipei'
  },
  attendees: [
    {
      emailAddress: { address: 'colleague@example.com', name: 'Colleague' },
      type: 'required'
    }
  ],
  isOnlineMeeting: true,
  onlineMeetingProvider: 'teamsForBusiness',
  body: {
    contentType: 'HTML',
    content: '<h2>Agenda</h2><ul><li>Status updates</li><li>Blockers</li></ul>'
  }
});
```

#### 獲取和更新會議

```typescript
// 獲取會議詳情
const meetingDetails = await teamsIntegration.getMeeting('meeting-id');

// 更新會議
const updated = await teamsIntegration.updateMeeting('meeting-id', {
  subject: 'Updated Meeting Title',
  recordAutomatically: true,
  allowedPresenters: 'organizer'
});

// 刪除會議
await teamsIntegration.deleteMeeting('meeting-id');
```

#### 獲取日曆事件

```typescript
const events = await teamsIntegration.getCalendarEvents(
  'me',
  '2025-10-01T00:00:00Z',
  '2025-10-31T23:59:59Z',
  50
);

events.forEach(event => {
  console.log(`${event.subject} - ${event.start.dateTime}`);
});
```

#### 發送會議邀請

```typescript
await teamsIntegration.sendMeetingInvitation(
  'me',
  ['user1@example.com', 'user2@example.com'],
  meeting
);
```

### 會議調度

#### 查找最佳會議時間

```typescript
import { createMeetingScheduler } from '@/lib/meeting/meeting-scheduler';

const scheduler = createMeetingScheduler();

const schedule = {
  duration: 60, // 60 分鐘
  participants: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
  workingHours: { start: 9, end: 17 },
  excludeWeekends: true,
  timeZone: 'Asia/Taipei',
  buffer: 15 // 會議前後 15 分鐘緩衝
};

const availabilityData = [
  {
    email: 'user1@example.com',
    timeZone: 'Asia/Taipei',
    availability: [
      // 用戶的忙碌時段
      {
        start: new Date('2025-10-15T10:00:00Z'),
        end: new Date('2025-10-15T11:00:00Z'),
        available: false
      }
    ]
  },
  // ... 其他參與者
];

const result = await scheduler.findOptimalTimeSlots(
  schedule,
  availabilityData,
  {
    start: new Date('2025-10-15'),
    end: new Date('2025-10-22')
  }
);

console.log('推薦時段:', result.recommendedSlots);
console.log('可用時段數:', result.statistics.availableSlots);
console.log('衝突:', result.conflicts);
```

#### 檢測調度衝突

```typescript
const conflicts = await scheduler.detectConflicts(
  ['user1@example.com', 'user2@example.com'],
  new Date('2025-10-15T14:00:00Z'),
  60,
  existingMeetings
);

if (conflicts.length > 0) {
  conflicts.forEach(conflict => {
    console.log(`${conflict.participant} 有 ${conflict.conflictingMeetings.length} 個衝突`);
  });
}
```

#### 生成循環會議

```typescript
const instances = scheduler.generateRecurringInstances(
  new Date('2025-10-15T10:00:00Z'),
  {
    type: 'weekly',
    interval: 1,
    daysOfWeek: [1, 3, 5], // 週一、週三、週五
    occurrences: 12
  },
  60
);

console.log(`生成了 ${instances.length} 個會議實例`);
```

#### 查找可用會議室

```typescript
const rooms = [
  { id: 'room-1', name: '小會議室', capacity: 6, availability: [] },
  { id: 'room-2', name: '中會議室', capacity: 12, availability: [] },
  { id: 'room-3', name: '大會議室', capacity: 30, availability: [] }
];

const availableRooms = await scheduler.findAvailableRooms(
  new Date('2025-10-15T14:00:00Z'),
  new Date('2025-10-15T15:00:00Z'),
  10, // 需要容納 10 人
  rooms
);

console.log('可用會議室:', availableRooms.map(r => r.name));
```

#### 跨時區最佳時間建議

```typescript
const suggestions = await scheduler.suggestOptimalTime(
  [
    { email: 'user1@example.com', timeZone: 'Asia/Taipei' },
    { email: 'user2@example.com', timeZone: 'America/New_York' },
    { email: 'user3@example.com', timeZone: 'Europe/London' }
  ],
  60,
  {
    start: new Date('2025-10-15'),
    end: new Date('2025-10-22')
  }
);

suggestions.forEach((slot, index) => {
  console.log(`建議 ${index + 1}: ${slot.start.toISOString()}`);
});
```

### 會議智能

#### 生成會議摘要

```typescript
import { createMeetingIntelligence } from '@/lib/meeting/meeting-intelligence';

const intelligence = createMeetingIntelligence();

const transcript = {
  meetingId: 'meeting-123',
  segments: [
    {
      speaker: 'Alice',
      timestamp: 0,
      text: '歡迎大家參加本次產品規劃會議。'
    },
    {
      speaker: 'Bob',
      timestamp: 15,
      text: '我們需要在兩週內完成功能開發。'
    },
    {
      speaker: 'Charlie',
      timestamp: 30,
      text: '我負責後端開發,Alice 負責前端。'
    }
  ],
  duration: 1800,
  participants: ['Alice', 'Bob', 'Charlie']
};

const summary = await intelligence.generateSummary(transcript, {
  title: '產品規劃會議',
  date: new Date('2025-10-15'),
  participants: ['Alice', 'Bob', 'Charlie']
});

console.log('摘要:', summary.fullSummary);
console.log('關鍵點:', summary.keyPoints);
console.log('決策:', summary.decisions);
console.log('行動項目:', summary.actionItems);
console.log('情感:', summary.sentiment);
```

#### 提取行動項目

```typescript
const actionItems = await intelligence.extractActionItems(transcript);

actionItems.forEach(item => {
  console.log(`任務: ${item.description}`);
  console.log(`負責人: ${item.assignee || '未指派'}`);
  console.log(`截止日期: ${item.dueDate || '未設定'}`);
  console.log(`優先級: ${item.priority}`);
  console.log('---');
});
```

#### 生成會議分析

```typescript
const analytics = await intelligence.generateAnalytics(transcript);

console.log('發言時間:');
Object.entries(analytics.speakingTime).forEach(([speaker, time]) => {
  console.log(`  ${speaker}: ${Math.floor(time / 60)} 分鐘`);
});

console.log('\n參與率:');
Object.entries(analytics.participationRate).forEach(([speaker, rate]) => {
  console.log(`  ${speaker}: ${rate.toFixed(1)}%`);
});

console.log('\n參與度分數:', analytics.engagementScore.toFixed(1));

console.log('\n主題:');
analytics.topics.forEach(topic => {
  console.log(`  ${topic.name} (${Math.floor(topic.duration / 60)} 分鐘, 相關性: ${topic.relevance})`);
});
```

#### 生成會議筆記

```typescript
const notes = intelligence.generateMeetingNotes(summary);

// 保存到文件
import fs from 'fs';
fs.writeFileSync('meeting-notes.md', notes);

// 或返回給用戶
return new Response(notes, {
  headers: {
    'Content-Type': 'text/markdown',
    'Content-Disposition': 'attachment; filename="meeting-notes.md"'
  }
});
```

#### 更新行動項目狀態

```typescript
const updatedItems = intelligence.updateActionItemStatus(
  'action-item-id',
  'completed',
  actionItems
);

// 保存更新的行動項目到數據庫
await db.actionItems.update({
  where: { id: 'action-item-id' },
  data: { status: 'completed', completedAt: new Date() }
});
```

## 🔄 完整工作流示例

### 端到端會議管理

```typescript
// 1. 初始化服務
const teamsIntegration = createTeamsIntegration();
const scheduler = createMeetingScheduler();
const intelligence = createMeetingIntelligence();

await teamsIntegration.initialize();

// 2. 查找最佳會議時間
const optimalSlots = await scheduler.findOptimalTimeSlots(
  {
    duration: 60,
    participants: ['alice@example.com', 'bob@example.com'],
    workingHours: { start: 9, end: 17 },
    excludeWeekends: true
  },
  availabilityData,
  { start: new Date(), end: addDays(new Date(), 7) }
);

const bestSlot = optimalSlots.recommendedSlots[0];

// 3. 創建 Teams 會議
const meeting = await teamsIntegration.createOnlineMeeting(
  'Product Planning',
  bestSlot.start.toISOString(),
  bestSlot.end.toISOString(),
  [
    { email: 'alice@example.com', name: 'Alice', role: 'presenter' },
    { email: 'bob@example.com', name: 'Bob', role: 'attendee' }
  ],
  { recordAutomatically: true }
);

// 4. 發送邀請
await teamsIntegration.sendMeetingInvitation(
  'me',
  ['alice@example.com', 'bob@example.com'],
  meeting
);

// 5. 會議後 - 生成摘要和行動項目
const summary = await intelligence.generateSummary(transcript, {
  title: 'Product Planning',
  date: new Date(),
  participants: ['Alice', 'Bob']
});

// 6. 生成會議筆記
const notes = intelligence.generateMeetingNotes(summary);

// 7. 保存到數據庫
await db.meetings.create({
  data: {
    teamsId: meeting.id,
    title: meeting.subject,
    summary: summary.fullSummary,
    actionItems: {
      create: summary.actionItems.map(item => ({
        description: item.description,
        assignee: item.assignee,
        priority: item.priority,
        status: item.status
      }))
    }
  }
});
```

## 📊 API 路由示例

### 創建會議 API

```typescript
// app/api/meetings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createTeamsIntegration } from '@/lib/meeting/teams-integration';
import { createMeetingScheduler } from '@/lib/meeting/meeting-scheduler';

export async function POST(request: NextRequest) {
  try {
    const { title, duration, participants, startDate, endDate } = await request.json();

    const teamsIntegration = createTeamsIntegration();
    const scheduler = createMeetingScheduler();

    await teamsIntegration.initialize();

    // 查找最佳時間
    const slots = await scheduler.findOptimalTimeSlots(
      {
        duration,
        participants: participants.map((p: any) => p.email),
        workingHours: { start: 9, end: 17 },
        excludeWeekends: true
      },
      [], // 從數據庫獲取可用性數據
      { start: new Date(startDate), end: new Date(endDate) }
    );

    if (slots.recommendedSlots.length === 0) {
      return NextResponse.json(
        { error: '未找到可用時段' },
        { status: 400 }
      );
    }

    const bestSlot = slots.recommendedSlots[0];

    // 創建 Teams 會議
    const meeting = await teamsIntegration.createOnlineMeeting(
      title,
      bestSlot.start.toISOString(),
      bestSlot.end.toISOString(),
      participants,
      { recordAutomatically: true }
    );

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        title: meeting.subject,
        startTime: meeting.startDateTime,
        endTime: meeting.endDateTime,
        joinUrl: meeting.joinUrl
      }
    });
  } catch (error) {
    console.error('創建會議失敗:', error);
    return NextResponse.json(
      { error: '創建會議失敗' },
      { status: 500 }
    );
  }
}
```

### 生成會議摘要 API

```typescript
// app/api/meetings/[id]/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createMeetingIntelligence } from '@/lib/meeting/meeting-intelligence';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { transcript } = await request.json();
    const intelligence = createMeetingIntelligence();

    // 從數據庫獲取會議信息
    const meeting = await db.meetings.findUnique({
      where: { id: params.id }
    });

    if (!meeting) {
      return NextResponse.json(
        { error: '會議不存在' },
        { status: 404 }
      );
    }

    const summary = await intelligence.generateSummary(transcript, {
      title: meeting.title,
      date: meeting.startTime,
      participants: meeting.participants
    });

    // 保存摘要到數據庫
    await db.meetings.update({
      where: { id: params.id },
      data: {
        summary: summary.fullSummary,
        keyPoints: summary.keyPoints,
        decisions: summary.decisions,
        actionItems: {
          create: summary.actionItems.map(item => ({
            description: item.description,
            assignee: item.assignee,
            priority: item.priority,
            status: item.status
          }))
        }
      }
    });

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('生成摘要失敗:', error);
    return NextResponse.json(
      { error: '生成摘要失敗' },
      { status: 500 }
    );
  }
}
```

## 🧪 測試

模組包含 55+ 測試的完整測試套件:

```bash
# 運行所有會議模組測試
npm test -- lib/meeting

# 運行特定測試文件
npm test -- lib/meeting/__tests__/teams-integration.test.ts
npm test -- lib/meeting/__tests__/meeting-scheduler.test.ts
npm test -- lib/meeting/__tests__/meeting-intelligence.test.ts

# 運行測試覆蓋率
npm test -- --coverage lib/meeting
```

測試覆蓋包括:
- ✅ Teams 會議創建和管理
- ✅ 日曆事件整合
- ✅ 認證和授權
- ✅ 時段查找算法
- ✅ 衝突檢測
- ✅ 循環會議生成
- ✅ 會議室預訂
- ✅ 跨時區調度
- ✅ AI 摘要生成
- ✅ 行動項目提取
- ✅ 會議分析計算
- ✅ 錯誤處理

## 📈 最佳實踐

### 1. 認證管理

```typescript
// 使用單例模式管理 Teams 整合實例
let teamsInstance: TeamsIntegration | null = null;

export function getTeamsIntegration(): TeamsIntegration {
  if (!teamsInstance) {
    teamsInstance = createTeamsIntegration();
  }
  return teamsInstance;
}

// 在應用啟動時初始化
const teams = getTeamsIntegration();
await teams.initialize();
```

### 2. 錯誤處理

```typescript
try {
  const meeting = await teamsIntegration.createOnlineMeeting(
    title,
    startTime,
    endTime,
    participants
  );
} catch (error) {
  if (error.message.includes('Authentication failed')) {
    // 重新認證
    await teamsIntegration.initialize();
    // 重試
  } else if (error.message.includes('conflict')) {
    // 處理衝突
    const conflicts = await scheduler.detectConflicts(...);
    // 建議替代時間
  } else {
    // 記錄錯誤
    console.error('會議創建失敗:', error);
    throw error;
  }
}
```

### 3. 性能優化

```typescript
// 批量獲取可用性數據
const availabilityData = await Promise.all(
  participants.map(async (email) => {
    const events = await teamsIntegration.getCalendarEvents(
      email,
      startDate,
      endDate
    );
    return {
      email,
      timeZone: userTimeZones[email],
      availability: events.map(event => ({
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        available: false
      }))
    };
  })
);
```

### 4. 緩存策略

```typescript
// 緩存用戶可用性數據
const CACHE_TTL = 5 * 60 * 1000; // 5 分鐘

async function getCachedAvailability(email: string, dateRange: any) {
  const cacheKey = `availability:${email}:${dateRange.start}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const availability = await fetchAvailability(email, dateRange);
  await cache.set(cacheKey, JSON.stringify(availability), CACHE_TTL);

  return availability;
}
```

### 5. 循環會議管理

```typescript
// 創建循環會議系列
const baseDate = new Date('2025-10-15T10:00:00Z');
const pattern = {
  type: 'weekly',
  interval: 1,
  daysOfWeek: [1, 3], // 週一和週三
  occurrences: 8
};

const instances = scheduler.generateRecurringInstances(baseDate, pattern, 60);

// 為每個實例創建 Teams 會議
const meetings = await Promise.all(
  instances.map(instance =>
    teamsIntegration.createOnlineMeeting(
      'Weekly Standup',
      instance.start.toISOString(),
      instance.end.toISOString(),
      participants
    )
  )
);

// 保存系列信息
await db.meetingSeries.create({
  data: {
    recurrencePattern: pattern,
    instances: {
      create: meetings.map((m, index) => ({
        teamsId: m.id,
        startTime: instances[index].start,
        endTime: instances[index].end
      }))
    }
  }
});
```

## 🔗 與其他模組整合

### 與通知模組整合

```typescript
import { createNotificationService } from '@/lib/notification/service';

// 會議創建後發送通知
const meeting = await teamsIntegration.createOnlineMeeting(...);

const notificationService = createNotificationService();
await notificationService.sendNotification({
  type: 'email',
  recipients: participants.map(p => p.email),
  subject: `會議邀請: ${meeting.subject}`,
  body: `您已被邀請參加會議。點擊加入: ${meeting.joinUrl}`
});

// 會議前提醒
await notificationService.scheduleNotification({
  type: 'email',
  recipients: participants.map(p => p.email),
  subject: `會議提醒: ${meeting.subject}`,
  body: `您的會議將在 15 分鐘後開始`,
  scheduledAt: new Date(meeting.startDateTime).getTime() - 15 * 60 * 1000
});
```

### 與工作流模組整合

```typescript
import { createWorkflowEngine } from '@/lib/workflow/engine';

// 會議後自動觸發工作流
const summary = await intelligence.generateSummary(transcript, meetingInfo);

const workflow = createWorkflowEngine();
await workflow.createInstance({
  workflowType: 'meeting-followup',
  data: {
    meetingId: meeting.id,
    actionItems: summary.actionItems,
    decisions: summary.decisions
  }
});

// 為每個行動項目創建任務
for (const item of summary.actionItems) {
  if (item.assignee) {
    await workflow.createTask({
      title: item.description,
      assignee: item.assignee,
      dueDate: item.dueDate,
      priority: item.priority
    });
  }
}
```

### 與 AI 整合模組整合

```typescript
import { createAIService } from '@/lib/ai/service';

// 使用 AI 生成會議議程
const aiService = createAIService();

const agenda = await aiService.generateText({
  prompt: `為以下會議生成詳細議程:
    標題: ${meeting.subject}
    參與者: ${participants.join(', ')}
    持續時間: ${duration} 分鐘
    目的: 產品規劃討論`,
  maxTokens: 500
});

// 更新會議說明
await teamsIntegration.updateMeeting(meeting.id, {
  subject: meeting.subject,
  // body: agenda // 如果 API 支持
});
```

## 🐛 故障排除

### Teams 認證失敗

**問題**: 收到 "Authentication failed" 錯誤

**解決方案**:
1. 檢查 Azure 應用註冊配置
2. 驗證環境變量正確設置
3. 確認客戶端密鑰未過期
4. 檢查 API 權限是否已授予管理員同意

```typescript
// 測試認證
try {
  await teamsIntegration.initialize();
  console.log('認證成功');
} catch (error) {
  console.error('認證失敗:', error);
  // 檢查環境變量
  console.log('Tenant ID:', process.env.AZURE_TENANT_ID);
  console.log('Client ID:', process.env.TEAMS_CLIENT_ID);
}
```

### 無法找到可用時段

**問題**: `findOptimalTimeSlots` 返回空結果

**解決方案**:
1. 擴大搜索日期範圍
2. 調整工作時間設置
3. 減少必需參與者數量
4. 檢查可用性數據是否正確

```typescript
// 調試時段查找
const result = await scheduler.findOptimalTimeSlots(
  schedule,
  availabilityData,
  dateRange
);

console.log('檢查的時段數:', result.statistics.totalSlotsChecked);
console.log('可用時段數:', result.statistics.availableSlots);
console.log('衝突:', result.conflicts);
```

### AI 摘要生成失敗

**問題**: Azure OpenAI API 調用失敗

**解決方案**:
1. 檢查 Azure OpenAI 端點和密鑰
2. 驗證部署名稱正確
3. 確認配額未超限
4. 檢查網絡連接

```typescript
// 測試 OpenAI 連接
const intelligence = createMeetingIntelligence();
try {
  const summary = await intelligence.generateSummary(
    simpleTranscript,
    meetingInfo
  );
  console.log('AI 服務正常');
} catch (error) {
  console.error('AI 服務錯誤:', error);
  // 檢查配置
  console.log('Endpoint:', process.env.AZURE_OPENAI_ENDPOINT);
  console.log('Deployment:', process.env.AZURE_OPENAI_DEPLOYMENT);
}
```

### 時區問題

**問題**: 跨時區調度時間不正確

**解決方案**:
1. 確保所有日期使用 ISO 8601 格式
2. 明確指定時區
3. 使用 `date-fns-tz` 進行時區轉換

```typescript
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// 正確的時區處理
const userTimeZone = 'Asia/Taipei';
const utcTime = new Date('2025-10-15T10:00:00Z');
const localTime = utcToZonedTime(utcTime, userTimeZone);

console.log('UTC 時間:', utcTime.toISOString());
console.log('本地時間:', localTime.toLocaleString('zh-TW', { timeZone: userTimeZone }));
```

## 📚 類型定義

模組提供完整的 TypeScript 類型定義:

```typescript
import type {
  Meeting,
  MeetingParticipant,
  TeamsOnlineMeeting,
  CalendarEvent,
  MeetingSchedule,
  TimeSlot,
  RecurrencePattern,
  MeetingTranscript,
  MeetingSummary,
  ActionItem,
  MeetingAnalytics
} from '@/types/meeting';
```

詳細類型定義請參考 `types/meeting.d.ts`。

## 📄 授權

MIT 授權 - 查看根目錄 LICENSE 文件

## 🤝 貢獻

此模組從 AI 銷售賦能平台提取。如有問題或改進建議,請提交到主倉庫。

## 📞 支持

如有問題、疑問或貢獻:
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- 文檔: 查看主項目的 `/docs` 目錄

---

**版本歷史**:
- v5.0 (2025-10-10): 初始版本,從 AI 銷售賦能平台提取
