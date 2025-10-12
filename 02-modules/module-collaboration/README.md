# Collaboration Module (module-collaboration)

實時協作編輯模組，支援多用戶同時編輯、衝突解決、用戶狀態追蹤和版本控制。

## 📋 功能特性

### 1. 實時協作編輯
- **CRDT 同步**: 使用 Yjs CRDT 實現無衝突協作
- **即時同步**: WebSocket 實時數據傳輸
- **自動衝突解決**: CRDT 算法自動處理並發編輯
- **變更追蹤**: 記錄所有文檔變更歷史
- **版本控制**: 創建和管理文檔版本

### 2. 用戶狀態管理
- **在線狀態**: 實時追蹤用戶在線/離線狀態
- **光標追蹤**: 顯示所有用戶的光標位置
- **選擇範圍**: 追蹤用戶選擇的文本範圍
- **打字指示**: 顯示正在輸入的用戶
- **心跳機制**: 自動檢測超時用戶

### 3. 會話管理
- **多會話支持**: 同一文檔支援多個協作會話
- **會話狀態**: 追蹤同步狀態和變更計數
- **自動清理**: 清理不活躍的會話和過期數據

### 4. React 集成
- **Context Provider**: React Context 提供協作功能
- **自定義 Hook**: `useCollaboration` Hook 訪問協作狀態
- **UI 組件**: 光標覆蓋層、用戶列表、同步狀態指示器

## 📁 模組結構

```
02-modules/module-collaboration/
├── lib/collaboration/
│   ├── collaborative-editing.ts.template  # 協作編輯核心服務
│   ├── presence.ts.template               # 用戶狀態管理服務
│   └── __tests__/
│       ├── collaborative-editing.test.ts.template  # 編輯服務測試
│       └── presence.test.ts.template               # 狀態服務測試
│
├── components/
│   └── CollaborationProvider.tsx.template # React Context Provider
│
├── types/
│   └── collaboration.d.ts.template        # TypeScript 類型定義
│
└── README.md                              # 本文件
```

## 🔧 安裝

### 步驟 1: 複製模組文件

在項目初始化期間，CLI 會將此模組複製到項目根目錄。

### 步驟 2: 環境變量

添加到 `.env.local`:

```bash
# WebSocket 配置 (可選)
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:1234  # Y-WebSocket 服務器地址
```

### 步驟 3: 數據庫架構

協作模組需要以下數據表 (初始化時自動創建):

**CollaborationSession** - 協作會話
```prisma
model CollaborationSession {
  id            String   @id @default(cuid())
  document_id   String
  user_id       String
  started_at    DateTime @default(now())
  ended_at      DateTime?
  is_active     Boolean  @default(true)
  sync_status   String   @default("disconnected")
  last_sync_at  DateTime?
  change_count  Int      @default(0)
  version       Int      @default(1)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  @@index([document_id])
  @@index([user_id])
  @@index([is_active])
}
```

**DocumentChange** - 文檔變更記錄
```prisma
model DocumentChange {
  id          String   @id @default(cuid())
  document_id String
  user_id     String
  type        String   # insert, delete, replace
  position    Int
  content     String   @db.Text
  length      Int?
  created_at  DateTime @default(now())

  @@index([document_id])
  @@index([user_id])
  @@index([created_at])
}
```

**DocumentVersion** - 文檔版本
```prisma
model DocumentVersion {
  id          String   @id @default(cuid())
  document_id String
  version     Int
  content     String   @db.Text
  created_by  String
  created_at  DateTime @default(now())
  comment     String?

  @@unique([document_id, version])
  @@index([document_id])
}
```

### 步驟 4: 安裝依賴

```bash
npm install yjs y-websocket y-protocols
```

### 步驟 5: WebSocket 服務器

需要運行 Y-WebSocket 服務器以支持實時同步:

```bash
# 使用 y-websocket 服務器
npx y-websocket-server

# 或自定義服務器 (參考 Yjs 文檔)
```

## 📖 使用方法

### 基礎協作流程

#### 1. 設置 Provider

```tsx
import { CollaborationProvider } from '@/components/CollaborationProvider'

function App() {
  return (
    <CollaborationProvider
      documentId="doc-123"
      userId="user-456"
      userName="John Doe"
      userEmail="john@example.com"
      websocketUrl="ws://localhost:1234"
      autoConnect={true}
    >
      <YourEditorComponent />
    </CollaborationProvider>
  )
}
```

#### 2. 使用協作 Hook

```tsx
import { useCollaboration } from '@/components/CollaborationProvider'

function Editor() {
  const {
    content,
    updateContent,
    activeUsers,
    isConnected,
    syncStatus
  } = useCollaboration()

  const handleChange = (newContent: string) => {
    updateContent(newContent)
  }

  return (
    <div>
      <div>Status: {syncStatus}</div>
      <div>Users: {activeUsers.length}</div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  )
}
```

#### 3. 顯示活躍用戶

```tsx
import { ActiveUsersList } from '@/components/CollaborationProvider'

function Toolbar() {
  return (
    <div className="toolbar">
      <ActiveUsersList />
    </div>
  )
}
```

#### 4. 顯示光標覆蓋層

```tsx
import { CursorOverlay } from '@/components/CollaborationProvider'

function EditorWrapper() {
  return (
    <div className="relative">
      <Editor />
      <CursorOverlay />
    </div>
  )
}
```

#### 5. 同步狀態指示器

```tsx
import { SyncStatusIndicator } from '@/components/CollaborationProvider'

function StatusBar() {
  return (
    <div className="status-bar">
      <SyncStatusIndicator />
    </div>
  )
}
```

### 高級功能

#### 光標位置更新

```tsx
function Editor() {
  const { updateCursor } = useCollaboration()
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const handleCursorMove = () => {
    const editor = editorRef.current
    if (!editor) return

    const { selectionStart } = editor
    const { left, top } = getCaretCoordinates(editor, selectionStart)

    updateCursor({
      x: left,
      y: top,
      line: getLineNumber(editor, selectionStart),
      column: getColumnNumber(editor, selectionStart)
    })
  }

  return (
    <textarea
      ref={editorRef}
      onSelect={handleCursorMove}
      onClick={handleCursorMove}
    />
  )
}
```

#### 選擇範圍更新

```tsx
function Editor() {
  const { updateSelection } = useCollaboration()
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const handleSelectionChange = () => {
    const editor = editorRef.current
    if (!editor) return

    const { selectionStart, selectionEnd } = editor

    if (selectionStart !== selectionEnd) {
      updateSelection({
        start: {
          line: getLineNumber(editor, selectionStart),
          column: getColumnNumber(editor, selectionStart)
        },
        end: {
          line: getLineNumber(editor, selectionEnd),
          column: getColumnNumber(editor, selectionEnd)
        }
      })
    } else {
      updateSelection(null)
    }
  }

  return (
    <textarea
      ref={editorRef}
      onSelect={handleSelectionChange}
    />
  )
}
```

#### 打字狀態指示

```tsx
function Editor() {
  const { setTyping } = useCollaboration()
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>()

  const handleInput = () => {
    setTyping(true)

    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    const timeout = setTimeout(() => {
      setTyping(false)
    }, 1000)

    setTypingTimeout(timeout)
  }

  return (
    <textarea onInput={handleInput} />
  )
}
```

#### 創建版本

```tsx
function VersionControl() {
  const { createVersion, currentVersion } = useCollaboration()

  const handleCreateVersion = async () => {
    await createVersion('Manual save point')
    alert(`Version ${currentVersion + 1} created`)
  }

  return (
    <div>
      <span>Current version: {currentVersion}</span>
      <button onClick={handleCreateVersion}>
        Create Version
      </button>
    </div>
  )
}
```

### 服務器端使用

#### 直接使用服務

```typescript
import { collaborativeEditingService } from '@/lib/collaboration/collaborative-editing'
import { presenceService } from '@/lib/collaboration/presence'

// 創建會話
const session = await collaborativeEditingService.createSession(
  'doc-123',
  'user-456',
  'Initial content'
)

// 應用變更
collaborativeEditingService.applyChanges('doc-123', 'user-456', [
  {
    document_id: 'doc-123',
    user_id: 'user-456',
    type: 'insert',
    position: 0,
    content: 'Hello ',
    created_at: new Date()
  }
])

// 獲取文檔內容
const content = collaborativeEditingService.getDocumentContent('doc-123')

// 創建版本
const version = await collaborativeEditingService.createVersion(
  'doc-123',
  'user-456',
  'First version'
)

// 離開會話
await collaborativeEditingService.leaveSession(session.id)
```

#### 狀態服務

```typescript
// 初始化狀態 (需要 WebSocket provider)
const presence = presenceService.initializePresence(
  'user-123',
  'doc-456',
  provider,
  {
    name: 'John Doe',
    email: 'john@example.com',
    color: '#FF6B6B'
  }
)

// 更新光標
presenceService.updateCursor('user-123', {
  x: 100,
  y: 200,
  line: 5,
  column: 10
})

// 更新選擇
presenceService.updateSelection('user-123', {
  start: { line: 1, column: 0 },
  end: { line: 3, column: 15 }
})

// 更新打字狀態
presenceService.updateTypingStatus('user-123', true)

// 獲取活躍用戶
const activeUsers = presenceService.getActiveUsers('doc-456')

// 獲取狀態統計
const stats = presenceService.getPresenceStats('doc-456')
console.log(`${stats.onlineUsers} users online, ${stats.typingUsers} typing`)
```

## 🔒 安全最佳實踐

### 1. 訪問控制
- 驗證用戶對文檔的訪問權限
- 在創建/加入會話前檢查權限
- 使用用戶 ID 而非敏感信息

### 2. WebSocket 安全
- 生產環境使用 WSS (WebSocket Secure)
- 實施 WebSocket 連接認證
- 限制單個用戶的連接數

### 3. 數據驗證
- 驗證所有變更操作的合法性
- 檢查位置和長度參數
- 過濾惡意內容

### 4. 性能優化
- 限制變更歷史記錄大小
- 定期清理過期會話
- 批量處理變更操作

## 🗄️ 數據庫適配器集成

此模組使用**數據庫適配器模式**支持多種數據庫:

```typescript
import { databaseAdapter } from '@/lib/db/database-adapter'

// 創建會話
const session = await databaseAdapter.create('collaborationSession', {
  data: {
    document_id: 'doc-123',
    user_id: 'user-456',
    is_active: true,
    sync_status: 'connecting'
  }
})

// 查找活躍會話
const activeSessions = await databaseAdapter.findMany('collaborationSession', {
  where: {
    document_id: 'doc-123',
    is_active: true
  }
})

// 更新會話
await databaseAdapter.update('collaborationSession', {
  where: { id: sessionId },
  data: { sync_status: 'synced' }
})
```

**支持的數據庫**:
- PostgreSQL
- MySQL
- MongoDB
- SQLite

## 📊 API 參考

### CollaborativeEditingService

#### `createSession(documentId, userId, initialContent?)`
創建新的協作會話。

**參數**:
- `documentId: string` - 文檔 ID
- `userId: string` - 用戶 ID
- `initialContent?: string` - 初始內容

**返回**: `Promise<CollaborationSession>`

#### `joinSession(documentId, userId)`
加入現有協作會話。

**參數**:
- `documentId: string` - 文檔 ID
- `userId: string` - 用戶 ID

**返回**: `Promise<CollaborationSession>`

#### `leaveSession(sessionId)`
離開協作會話。

**參數**:
- `sessionId: string` - 會話 ID

**返回**: `Promise<void>`

#### `applyChanges(documentId, userId, changes)`
應用文檔變更。

**參數**:
- `documentId: string` - 文檔 ID
- `userId: string` - 用戶 ID
- `changes: DocumentChange[]` - 變更列表

**返回**: `void`

#### `getDocumentContent(documentId)`
獲取文檔當前內容。

**參數**:
- `documentId: string` - 文檔 ID

**返回**: `string`

#### `createVersion(documentId, userId, comment?)`
創建文檔版本。

**參數**:
- `documentId: string` - 文檔 ID
- `userId: string` - 用戶 ID
- `comment?: string` - 版本註釋

**返回**: `Promise<DocumentVersion>`

### PresenceService

#### `initializePresence(userId, documentId, provider, userData?)`
初始化用戶狀態。

**參數**:
- `userId: string` - 用戶 ID
- `documentId: string` - 文檔 ID
- `provider: WebsocketProvider` - WebSocket provider
- `userData?: object` - 用戶數據 (name, email, avatar, color)

**返回**: `UserPresence`

#### `updateCursor(userId, cursor)`
更新光標位置。

**參數**:
- `userId: string` - 用戶 ID
- `cursor: CursorPosition | null` - 光標位置

**返回**: `void`

#### `updateSelection(userId, selection)`
更新選擇範圍。

**參數**:
- `userId: string` - 用戶 ID
- `selection: UserSelection | null` - 選擇範圍

**返回**: `void`

#### `updateTypingStatus(userId, isTyping)`
更新打字狀態。

**參數**:
- `userId: string` - 用戶 ID
- `isTyping: boolean` - 是否正在打字

**返回**: `void`

#### `getActiveUsers(documentId)`
獲取活躍用戶列表。

**參數**:
- `documentId: string` - 文檔 ID

**返回**: `UserPresence[]`

#### `getPresenceState(documentId)`
獲取狀態概覽。

**參數**:
- `documentId: string` - 文檔 ID

**返回**: `PresenceState`

### React Hook: `useCollaboration()`

```typescript
const {
  // 會話管理
  session,              // 當前會話
  isConnected,          // 連接狀態
  syncStatus,           // 同步狀態

  // 文檔操作
  content,              // 文檔內容
  updateContent,        // 更新內容
  applyChange,          // 應用單個變更

  // 狀態管理
  activeUsers,          // 活躍用戶列表
  currentUser,          // 當前用戶
  updateCursor,         // 更新光標
  updateSelection,      // 更新選擇
  setTyping,            // 設置打字狀態

  // 版本控制
  createVersion,        // 創建版本
  currentVersion,       // 當前版本號

  // 連接管理
  connect,              // 連接
  disconnect,           // 斷開連接
  reconnect             // 重新連接
} = useCollaboration()
```

## 🧪 測試

### 運行測試

```bash
npm test -- module-collaboration
```

### 測試覆蓋率

模組包含 35+ 個測試用例，覆蓋率 85%+:

- **collaborative-editing.test.ts**: 25+ 測試
  - 會話創建和管理
  - 文檔變更應用
  - 版本控制
  - 同步狀態

- **presence.test.ts**: 20+ 測試
  - 狀態初始化
  - 光標和選擇更新
  - 用戶列表管理
  - 統計信息

## 🚀 生產部署

### 環境檢查清單

- [ ] 配置 WebSocket 服務器 (生產環境)
- [ ] 使用 WSS (WebSocket Secure)
- [ ] 設置適當的 CORS 策略
- [ ] 配置數據庫索引
- [ ] 實施訪問控制
- [ ] 設置會話清理計劃任務
- [ ] 配置監控和日誌

### 性能優化

1. **數據庫索引**:
```sql
-- CollaborationSession
CREATE INDEX idx_collaboration_session_document ON CollaborationSession(document_id);
CREATE INDEX idx_collaboration_session_user ON CollaborationSession(user_id);
CREATE INDEX idx_collaboration_session_active ON CollaborationSession(is_active);

-- DocumentChange
CREATE INDEX idx_document_change_document ON DocumentChange(document_id);
CREATE INDEX idx_document_change_created ON DocumentChange(created_at);

-- DocumentVersion
CREATE INDEX idx_document_version_document ON DocumentVersion(document_id);
```

2. **清理計劃任務**:
```typescript
import { collaborativeEditingService } from '@/lib/collaboration/collaborative-editing'
import { presenceService } from '@/lib/collaboration/presence'

// 每小時清理一次
setInterval(async () => {
  await collaborativeEditingService.cleanupInactiveSessions()
  presenceService.cleanupExpiredPresences()
}, 3600000)
```

3. **WebSocket 配置**:
```typescript
// 生產環境 WebSocket 服務器
const wsServer = new WebSocket.Server({
  port: 1234,
  perMessageDeflate: true,
  maxPayload: 100 * 1024 * 1024 // 100MB
})
```

## 📈 監控指標

推薦監控以下指標:

- **連接數**: 當前活躍 WebSocket 連接
- **會話數**: 活躍協作會話數量
- **同步延遲**: 變更同步平均延遲
- **錯誤率**: 連接失敗和同步錯誤率
- **用戶活躍度**: 每個文檔的用戶數

## 🔧 故障排除

### WebSocket 連接失敗

```typescript
// 檢查 WebSocket 服務器狀態
const ws = new WebSocket('ws://localhost:1234')
ws.onerror = (error) => {
  console.error('WebSocket error:', error)
}
```

### 同步不工作

```typescript
// 檢查 Yjs 文檔狀態
const yDoc = service.getYDoc(documentId)
console.log('Document state:', yDoc.getState())
```

### 光標不顯示

```typescript
// 確保光標位置正確計算
const handleCursorMove = () => {
  const cursor = getCursorPosition(editorRef.current)
  console.log('Cursor position:', cursor)
  updateCursor(cursor)
}
```

## 📝 變更日誌

- **v5.0** (2025-10-10): 初始提取自 AI Sales Enablement Platform
  - Yjs CRDT 實時協作
  - WebSocket 同步
  - 用戶狀態追蹤
  - 版本控制
  - React 集成

## 🤝 支持

如有問題、疑問或貢獻建議:
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- 文檔: 查看主項目 `/docs` 目錄

## 📄 許可證

AI Web App Template v5.0 的一部分
