# Reminder 提醒模組

智能提醒模組，提供時間調度、循環提醒、位置提醒、智能時機優化等完整提醒管理功能。

## 功能特性

### 核心功能
- ✅ **時間調度** - 基於 Cron 的靈活時間調度
- 🔄 **循環提醒** - 支持日/周/月循環模式
- 📍 **位置提醒** - 基於地理圍欄的提醒觸發
- 🤖 **智能時機** - AI 優化的最佳提醒時間
- 📨 **多通道推送** - Email、應用內、推送通知
- ⏰ **稍後提醒** - 用戶可自主管理提醒

### 技術特性
- TypeScript 嚴格模式
- 85%+ 測試覆蓋率
- 優先隊列管理
- 時區自動處理
- 衝突檢測
- 批量調度支持
- 重試機制
- 分析集成

## 安裝配置

### 1. 依賴安裝

模組依賴以下 npm 包：

```json
{
  "node-cron": "^3.0.3",
  "rrule": "^2.8.1",
  "date-fns": "^3.0.0"
}
```

這些依賴會在項目初始化時自動添加到 `package.json`。

### 2. 數據庫配置

**PostgreSQL Schema**:

```prisma
model Reminder {
  id              String          @id @default(cuid())
  userId          String
  title           String
  description     String?
  type            ReminderType
  status          ReminderStatus  @default(PENDING)
  priority        Int             @default(3)

  // 時間調度
  scheduledAt     DateTime
  timezone        String          @default("UTC")
  recurrenceRule  String?         // RRule format

  // 位置信息
  locationLat     Float?
  locationLng     Float?
  locationRadius  Float?          // meters

  // 推送渠道
  channels        Json            // DeliveryChannel[]

  // 智能時機
  smartTiming     Boolean         @default(false)
  optimalTime     DateTime?

  // 狀態追蹤
  deliveredAt     DateTime?
  snoozedUntil    DateTime?
  dismissedAt     DateTime?

  // 重試邏輯
  retryCount      Int             @default(0)
  maxRetries      Int             @default(3)
  lastRetryAt     DateTime?

  // 元數據
  metadata        Json?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([userId, status])
  @@index([scheduledAt])
  @@index([status, scheduledAt])
}

enum ReminderType {
  ONE_TIME
  RECURRING
  LOCATION_BASED
  SMART
}

enum ReminderStatus {
  PENDING
  SCHEDULED
  DELIVERED
  SNOOZED
  DISMISSED
  FAILED
  EXPIRED
}
```

**MySQL Schema**: 同上，將 `Json` 改為 `JSON`

**MongoDB Schema**:

```prisma
model Reminder {
  id              String          @id @default(auto()) @map("_id") @db.ObjectId
  userId          String
  title           String
  description     String?
  type            String          // ReminderType
  status          String          @default("PENDING")
  priority        Int             @default(3)

  scheduledAt     DateTime
  timezone        String          @default("UTC")
  recurrenceRule  String?

  locationLat     Float?
  locationLng     Float?
  locationRadius  Float?

  channels        Json

  smartTiming     Boolean         @default(false)
  optimalTime     DateTime?

  deliveredAt     DateTime?
  snoozedUntil    DateTime?
  dismissedAt     DateTime?

  retryCount      Int             @default(0)
  maxRetries      Int             @default(3)
  lastRetryAt     DateTime?

  metadata        Json?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
```

### 3. 環境變量

添加到 `.env.local`:

```bash
# Reminder Configuration
REMINDER_CRON_ENABLED=true
REMINDER_BATCH_SIZE=100
REMINDER_PROCESSING_INTERVAL=60000  # 1 minute
REMINDER_MAX_RETRIES=3
REMINDER_RETRY_DELAY=300000         # 5 minutes

# Smart Timing AI
REMINDER_SMART_TIMING_ENABLED=true
REMINDER_ML_ENDPOINT=https://your-ml-service.com/predict

# Location Services
REMINDER_LOCATION_ENABLED=true
REMINDER_GEOFENCE_CHECK_INTERVAL=300000  # 5 minutes
```

## 使用指南

### 基礎使用

#### 1. 創建單次提醒

```typescript
import { ReminderScheduler } from '@/lib/reminder/reminder-scheduler';

const scheduler = new ReminderScheduler();

const reminder = await scheduler.scheduleReminder({
  userId: 'user123',
  title: '團隊會議',
  description: '每週產品評審會議',
  type: 'ONE_TIME',
  scheduledAt: new Date('2025-10-15T10:00:00Z'),
  timezone: 'Asia/Taipei',
  channels: [
    { type: 'EMAIL', enabled: true },
    { type: 'IN_APP', enabled: true }
  ],
  priority: 1
});

console.log('提醒已調度:', reminder.id);
```

#### 2. 創建循環提醒

```typescript
import { RRule } from 'rrule';

// 每週一上午9點
const rrule = new RRule({
  freq: RRule.WEEKLY,
  byweekday: [RRule.MO],
  byhour: [9],
  byminute: [0],
  dtstart: new Date('2025-10-10T09:00:00Z')
});

const recurringReminder = await scheduler.scheduleReminder({
  userId: 'user123',
  title: '週會提醒',
  type: 'RECURRING',
  scheduledAt: new Date('2025-10-14T09:00:00Z'),
  recurrenceRule: rrule.toString(),
  timezone: 'Asia/Taipei',
  channels: [{ type: 'IN_APP', enabled: true }]
});
```

#### 3. 創建位置提醒

```typescript
const locationReminder = await scheduler.scheduleReminder({
  userId: 'user123',
  title: '到達辦公室後查看文件',
  type: 'LOCATION_BASED',
  scheduledAt: new Date(), // 立即生效
  locationLat: 25.0330,
  locationLng: 121.5654,
  locationRadius: 200, // 200米
  channels: [{ type: 'PUSH', enabled: true }]
});
```

#### 4. 智能時機提醒

```typescript
import { SmartTiming } from '@/lib/reminder/smart-timing';

const smartTiming = new SmartTiming();

// 預測最佳時間
const optimalTime = await smartTiming.predictOptimalTime('user123', {
  taskType: 'review_document',
  urgency: 'medium',
  estimatedDuration: 15 // minutes
});

const smartReminder = await scheduler.scheduleReminder({
  userId: 'user123',
  title: '審閱重要文件',
  type: 'SMART',
  scheduledAt: optimalTime,
  smartTiming: true,
  channels: [{ type: 'IN_APP', enabled: true }]
});
```

### 高級功能

#### 1. 批量調度

```typescript
const reminders = [
  {
    userId: 'user123',
    title: '任務1',
    scheduledAt: new Date('2025-10-15T10:00:00Z'),
    channels: [{ type: 'EMAIL', enabled: true }]
  },
  {
    userId: 'user123',
    title: '任務2',
    scheduledAt: new Date('2025-10-15T14:00:00Z'),
    channels: [{ type: 'IN_APP', enabled: true }]
  }
];

const scheduled = await scheduler.scheduleBatch(reminders);
console.log(`成功調度 ${scheduled.length} 個提醒`);
```

#### 2. 更新提醒

```typescript
await scheduler.updateReminder('reminder_id', {
  scheduledAt: new Date('2025-10-16T10:00:00Z'),
  priority: 1
});
```

#### 3. 稍後提醒（Snooze）

```typescript
await scheduler.snoozeReminder('reminder_id', 30); // 30分鐘後
```

#### 4. 取消提醒

```typescript
await scheduler.cancelReminder('reminder_id');
```

#### 5. 衝突檢測

```typescript
const conflicts = await scheduler.checkConflicts('user123', {
  startTime: new Date('2025-10-15T10:00:00Z'),
  endTime: new Date('2025-10-15T11:00:00Z'),
  priorityThreshold: 2 // 只檢查優先級 >= 2 的提醒
});

if (conflicts.length > 0) {
  console.log('發現時間衝突:', conflicts);
}
```

### 提醒處理器

#### 1. 啟動處理器

```typescript
import { ReminderProcessor } from '@/lib/reminder/reminder-processor';

const processor = new ReminderProcessor();

// 啟動自動處理
await processor.start();

console.log('提醒處理器已啟動');
```

#### 2. 手動處理

```typescript
// 處理單個提醒
await processor.processReminder('reminder_id');

// 處理批次
const processed = await processor.processBatch(100);
console.log(`處理了 ${processed} 個提醒`);
```

#### 3. 監聽事件

```typescript
processor.on('reminder:delivered', (reminder) => {
  console.log('提醒已送達:', reminder.id);
});

processor.on('reminder:failed', (reminder, error) => {
  console.error('提醒失敗:', reminder.id, error);
});

processor.on('reminder:retry', (reminder, attempt) => {
  console.log('重試提醒:', reminder.id, '第', attempt, '次');
});
```

#### 4. 停止處理器

```typescript
await processor.stop();
console.log('提醒處理器已停止');
```

### 智能時機分析

#### 1. 分析用戶行為模式

```typescript
const smartTiming = new SmartTiming();

const patterns = await smartTiming.analyzeUserPatterns('user123', {
  startDate: new Date('2025-09-01'),
  endDate: new Date('2025-10-01')
});

console.log('活躍時段:', patterns.activeHours);
console.log('響應率:', patterns.responseRate);
console.log('最佳時段:', patterns.optimalWindows);
```

#### 2. 優化現有提醒

```typescript
const optimized = await smartTiming.optimizeReminders('user123');

console.log(`優化了 ${optimized.length} 個提醒的時間`);
```

#### 3. 評估提醒時機

```typescript
const score = await smartTiming.evaluateTiming('user123', {
  proposedTime: new Date('2025-10-15T14:00:00Z'),
  taskType: 'review_document',
  urgency: 'high'
});

if (score > 0.8) {
  console.log('優秀的提醒時機');
} else {
  console.log('建議調整時間');
}
```

## API 參考

### ReminderScheduler

#### 方法

**scheduleReminder(data: ReminderInput): Promise<Reminder>**
- 創建並調度提醒
- 自動處理時區轉換
- 返回創建的提醒對象

**scheduleBatch(reminders: ReminderInput[]): Promise<Reminder[]>**
- 批量調度提醒
- 事務性操作，全部成功或全部失敗
- 返回創建的提醒數組

**updateReminder(id: string, data: Partial<ReminderInput>): Promise<Reminder>**
- 更新提醒信息
- 重新計算調度時間（如需要）

**cancelReminder(id: string): Promise<void>**
- 取消提醒
- 更新狀態為 DISMISSED

**snoozeReminder(id: string, minutes: number): Promise<Reminder>**
- 稍後提醒
- 更新調度時間和狀態

**checkConflicts(userId: string, options: ConflictCheckOptions): Promise<Reminder[]>**
- 檢測時間衝突
- 支持優先級過濾

**getUpcoming(userId: string, limit?: number): Promise<Reminder[]>**
- 獲取即將到來的提醒
- 按時間排序

**getRecurring(userId: string): Promise<Reminder[]>**
- 獲取所有循環提醒

### ReminderProcessor

#### 方法

**start(): Promise<void>**
- 啟動處理器
- 開始定時任務

**stop(): Promise<void>**
- 停止處理器
- 清理定時任務

**processReminder(id: string): Promise<boolean>**
- 處理單個提醒
- 返回是否成功

**processBatch(limit: number): Promise<number>**
- 批量處理提醒
- 返回處理數量

**retryFailed(): Promise<number>**
- 重試失敗的提醒
- 返回重試數量

#### 事件

- `reminder:delivered` - 提醒成功送達
- `reminder:failed` - 提醒失敗
- `reminder:retry` - 提醒重試
- `reminder:expired` - 提醒過期
- `batch:complete` - 批次處理完成

### SmartTiming

#### 方法

**predictOptimalTime(userId: string, context: TimingContext): Promise<Date>**
- 預測最佳提醒時間
- 基於用戶行為模式

**analyzeUserPatterns(userId: string, options: AnalysisOptions): Promise<UserPattern>**
- 分析用戶行為模式
- 識別活躍時段和響應率

**optimizeReminders(userId: string): Promise<Reminder[]>**
- 優化現有提醒時間
- 批量調整到最佳時段

**evaluateTiming(userId: string, options: EvaluationOptions): Promise<number>**
- 評估提醒時機質量
- 返回 0-1 分數

**getOptimalWindows(userId: string): Promise<TimeWindow[]>**
- 獲取用戶的最佳時間窗口
- 按響應率排序

## 最佳實踐

### 1. 時區處理

```typescript
// ✅ 正確：明確指定時區
await scheduler.scheduleReminder({
  scheduledAt: new Date('2025-10-15T10:00:00Z'),
  timezone: 'Asia/Taipei',
  // ...
});

// ❌ 錯誤：依賴本地時區
await scheduler.scheduleReminder({
  scheduledAt: new Date('2025-10-15T10:00:00'),
  // 未指定 timezone
});
```

### 2. 循環規則

```typescript
// ✅ 正確：使用 RRule 庫
import { RRule } from 'rrule';

const rule = new RRule({
  freq: RRule.DAILY,
  interval: 2,
  count: 10
});

// ❌ 錯誤：手寫規則字符串
const rule = 'FREQ=DAILY;INTERVAL=2;COUNT=10'; // 容易出錯
```

### 3. 優先級管理

```typescript
// ✅ 正確：使用語義化優先級
enum Priority {
  URGENT = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  OPTIONAL = 5
}

await scheduler.scheduleReminder({
  priority: Priority.URGENT,
  // ...
});

// ❌ 錯誤：魔術數字
await scheduler.scheduleReminder({
  priority: 1, // 什麼意思？
});
```

### 4. 錯誤處理

```typescript
// ✅ 正確：完整錯誤處理
try {
  await scheduler.scheduleReminder(data);
} catch (error) {
  if (error.code === 'CONFLICT') {
    // 處理衝突
  } else if (error.code === 'INVALID_TIME') {
    // 處理時間錯誤
  } else {
    // 其他錯誤
  }
}

// ❌ 錯誤：忽略錯誤
await scheduler.scheduleReminder(data); // 可能靜默失敗
```

### 5. 資源清理

```typescript
// ✅ 正確：正確清理資源
const processor = new ReminderProcessor();
await processor.start();

process.on('SIGTERM', async () => {
  await processor.stop();
  process.exit(0);
});

// ❌ 錯誤：不清理
const processor = new ReminderProcessor();
await processor.start();
// 進程退出時可能有未完成的任務
```

## 性能優化

### 1. 批量操作

```typescript
// ✅ 好：批量調度
const reminders = [...]; // 100 個提醒
await scheduler.scheduleBatch(reminders);

// ❌ 差：逐個調度
for (const reminder of reminders) {
  await scheduler.scheduleReminder(reminder); // 慢 100 倍
}
```

### 2. 索引優化

確保以下字段有索引：

```prisma
@@index([userId, status])
@@index([scheduledAt])
@@index([status, scheduledAt])
```

### 3. 分頁查詢

```typescript
// ✅ 好：使用分頁
const upcoming = await scheduler.getUpcoming('user123', 20);

// ❌ 差：查詢所有
const allReminders = await prisma.reminder.findMany({
  where: { userId: 'user123' }
}); // 可能很慢
```

## 監控與日誌

### 關鍵指標

```typescript
// 調度成功率
const scheduleSuccessRate = scheduledCount / totalAttempts;

// 送達成功率
const deliverySuccessRate = deliveredCount / scheduledCount;

// 平均處理時間
const avgProcessingTime = totalProcessingTime / processedCount;

// 重試率
const retryRate = retryCount / deliveredCount;
```

### 日誌記錄

```typescript
processor.on('reminder:delivered', (reminder) => {
  logger.info('Reminder delivered', {
    reminderId: reminder.id,
    userId: reminder.userId,
    channels: reminder.channels,
    duration: Date.now() - reminder.scheduledAt.getTime()
  });
});

processor.on('reminder:failed', (reminder, error) => {
  logger.error('Reminder failed', {
    reminderId: reminder.id,
    error: error.message,
    retryCount: reminder.retryCount
  });
});
```

## 故障排查

### 常見問題

**Q: 提醒沒有被送達？**

```typescript
// 檢查處理器狀態
const isRunning = processor.isRunning();
console.log('處理器運行中:', isRunning);

// 檢查提醒狀態
const reminder = await prisma.reminder.findUnique({
  where: { id: 'reminder_id' }
});
console.log('提醒狀態:', reminder.status);

// 檢查日誌
processor.on('reminder:failed', (reminder, error) => {
  console.error('失敗原因:', error);
});
```

**Q: 循環提醒不工作？**

```typescript
// 驗證 RRule 格式
import { RRule } from 'rrule';

try {
  const rule = RRule.fromString(reminder.recurrenceRule);
  console.log('下次執行時間:', rule.after(new Date()));
} catch (error) {
  console.error('RRule 格式錯誤:', error);
}
```

**Q: 智能時機預測不準確？**

```typescript
// 檢查訓練數據量
const patterns = await smartTiming.analyzeUserPatterns('user123');
console.log('數據點數量:', patterns.dataPoints);

// 至少需要 30 天數據
if (patterns.dataPoints < 100) {
  console.log('數據不足，使用默認時間');
}
```

## 測試

運行測試：

```bash
npm test lib/reminder
```

測試覆蓋：

```bash
npm run test:coverage -- lib/reminder
```

## 依賴關係

### 必需模組
- 無（獨立模組）

### 可選集成
- **module-notification**: 多通道推送
- **module-workflow**: 工作流集成
- **module-ai-integration**: AI 時機優化

## 授權

MIT License

## 更新日誌

### v1.0.0 (2025-10-10)
- ✅ 初始版本
- ✅ 時間調度功能
- ✅ 循環提醒支持
- ✅ 位置提醒
- ✅ 智能時機優化
- ✅ 多通道推送
- ✅ 85%+ 測試覆蓋

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 支持

- 文檔：本 README
- Issues: GitHub Issues
- 討論：GitHub Discussions
