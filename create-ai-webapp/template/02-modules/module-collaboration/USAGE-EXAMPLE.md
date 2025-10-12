# Collaboration Module - Usage Example

完整的實時協作編輯器實現示例。

## 基礎實現

### 1. 設置項目結構

```
app/
├── editor/
│   └── [documentId]/
│       └── page.tsx          # 編輯器頁面
├── api/
│   └── collaboration/
│       └── documents/
│           └── [id]/
│               └── route.ts  # 文檔 API
└── layout.tsx
```

### 2. 編輯器頁面 (`app/editor/[documentId]/page.tsx`)

```tsx
'use client'

import { CollaborationProvider, useCollaboration } from '@/components/CollaborationProvider'
import { CursorOverlay, ActiveUsersList, SyncStatusIndicator } from '@/components/CollaborationProvider'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

// 編輯器組件
function Editor() {
  const {
    content,
    updateContent,
    activeUsers,
    syncStatus,
    updateCursor,
    updateSelection,
    setTyping,
    createVersion
  } = useCollaboration()

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>()

  // 處理內容變更
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    updateContent(newContent)

    // 打字指示
    setTyping(true)
    if (typingTimeout) clearTimeout(typingTimeout)
    const timeout = setTimeout(() => setTyping(false), 1000)
    setTypingTimeout(timeout)
  }

  // 處理光標移動
  const handleCursorMove = () => {
    const editor = editorRef.current
    if (!editor) return

    const { selectionStart } = editor
    const rect = editor.getBoundingClientRect()

    // 計算光標位置
    const lines = editor.value.substring(0, selectionStart).split('\n')
    const line = lines.length - 1
    const column = lines[lines.length - 1].length

    updateCursor({
      x: rect.left + (column * 8), // 假設字符寬度為 8px
      y: rect.top + (line * 20),   // 假設行高為 20px
      line,
      column
    })
  }

  // 處理選擇變更
  const handleSelectionChange = () => {
    const editor = editorRef.current
    if (!editor) return

    const { selectionStart, selectionEnd } = editor

    if (selectionStart !== selectionEnd) {
      const lines = editor.value.split('\n')
      let startLine = 0, startCol = 0, endLine = 0, endCol = 0
      let currentPos = 0

      // 計算開始位置
      for (let i = 0; i < lines.length; i++) {
        if (currentPos + lines[i].length + 1 > selectionStart) {
          startLine = i
          startCol = selectionStart - currentPos
          break
        }
        currentPos += lines[i].length + 1
      }

      // 計算結束位置
      currentPos = 0
      for (let i = 0; i < lines.length; i++) {
        if (currentPos + lines[i].length + 1 > selectionEnd) {
          endLine = i
          endCol = selectionEnd - currentPos
          break
        }
        currentPos += lines[i].length + 1
      }

      updateSelection({
        start: { line: startLine, column: startCol },
        end: { line: endLine, column: endCol }
      })
    } else {
      updateSelection(null)
    }
  }

  // 創建版本
  const handleSaveVersion = async () => {
    const comment = prompt('Version comment:')
    if (comment) {
      await createVersion(comment)
      alert('Version saved!')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 工具欄 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Collaborative Editor</h1>
          <SyncStatusIndicator />
        </div>
        <div className="flex items-center gap-4">
          <ActiveUsersList />
          <button
            onClick={handleSaveVersion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Version
          </button>
        </div>
      </div>

      {/* 編輯器區域 */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleChange}
          onSelect={handleSelectionChange}
          onClick={handleCursorMove}
          onKeyUp={handleCursorMove}
          className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
          placeholder="Start typing..."
        />
        <CursorOverlay />
      </div>

      {/* 狀態欄 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t text-sm text-gray-600">
        <div>
          {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''} online
        </div>
        <div>
          {syncStatus === 'synced' && '✓ Saved'}
          {syncStatus === 'syncing' && '⟳ Saving...'}
          {syncStatus === 'disconnected' && '✕ Disconnected'}
        </div>
      </div>
    </div>
  )
}

// 頁面組件
export default function EditorPage() {
  const params = useParams()
  const { data: session } = useSession()
  const documentId = params.documentId as string

  if (!session?.user) {
    return <div>Please sign in to collaborate</div>
  }

  return (
    <CollaborationProvider
      documentId={documentId}
      userId={session.user.id}
      userName={session.user.name || 'Anonymous'}
      userEmail={session.user.email || undefined}
      userAvatar={session.user.image || undefined}
      websocketUrl={process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:1234'}
      autoConnect={true}
    >
      <Editor />
    </CollaborationProvider>
  )
}
```

### 3. 文檔 API (`app/api/collaboration/documents/[id]/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { collaborativeEditingService } from '@/lib/collaboration/collaborative-editing'
import { databaseAdapter } from '@/lib/db/database-adapter'

// 獲取文檔
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id

    // 獲取文檔內容
    const content = collaborativeEditingService.getDocumentContent(documentId)

    // 獲取活躍會話
    const activeSessions = collaborativeEditingService.getActiveSessions(documentId)

    // 獲取變更歷史
    const changeHistory = await collaborativeEditingService.getChangeHistory(documentId, 10)

    return NextResponse.json({
      documentId,
      content,
      activeSessions,
      changeHistory
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Document not found' },
      { status: 404 }
    )
  }
}

// 創建版本
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const { userId, comment } = await request.json()

    const version = await collaborativeEditingService.createVersion(
      documentId,
      userId,
      comment
    )

    return NextResponse.json({ version })
  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    )
  }
}
```

## 高級功能

### 1. 富文本編輯器集成 (使用 TipTap)

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

function RichTextEditor() {
  const { session } = useCollaboration()
  const provider = (collaborativeEditingService as any).providers.get(session?.documentId)
  const yDoc = (collaborativeEditingService as any).yDocs.get(session?.documentId)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: yDoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: session?.userId,
          color: '#FF0000',
        },
      }),
    ],
  })

  return <EditorContent editor={editor} />
}
```

### 2. 評論和註解

```tsx
function CommentSidebar() {
  const { content, currentUser, activeUsers } = useCollaboration()
  const [comments, setComments] = useState<Comment[]>([])

  const addComment = async (position: number, text: string) => {
    const comment = {
      id: generateId(),
      documentId: session.documentId,
      userId: currentUser?.userId,
      userName: currentUser?.name,
      position,
      text,
      createdAt: new Date()
    }

    // 保存到數據庫
    await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify(comment)
    })

    setComments([...comments, comment])
  }

  return (
    <div className="w-80 border-l p-4">
      <h3 className="font-semibold mb-4">Comments</h3>
      {comments.map(comment => (
        <div key={comment.id} className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{comment.userName}</span>
            <span className="text-xs text-gray-500">
              {comment.createdAt.toLocaleString()}
            </span>
          </div>
          <p className="text-sm">{comment.text}</p>
        </div>
      ))}
    </div>
  )
}
```

### 3. 版本歷史查看器

```tsx
function VersionHistory() {
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const { documentId } = useCollaboration()

  useEffect(() => {
    loadVersions()
  }, [documentId])

  const loadVersions = async () => {
    const response = await fetch(`/api/documents/${documentId}/versions`)
    const data = await response.json()
    setVersions(data.versions)
  }

  const restoreVersion = async (version: number) => {
    if (confirm(`Restore version ${version}?`)) {
      await fetch(`/api/documents/${documentId}/restore`, {
        method: 'POST',
        body: JSON.stringify({ version })
      })
      window.location.reload()
    }
  }

  return (
    <div className="w-80 border-l p-4">
      <h3 className="font-semibold mb-4">Version History</h3>
      <div className="space-y-2">
        {versions.map(version => (
          <div
            key={version.id}
            className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => restoreVersion(version.version)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">v{version.version}</span>
              <span className="text-xs text-gray-500">
                {new Date(version.created_at).toLocaleString()}
              </span>
            </div>
            {version.comment && (
              <p className="text-sm text-gray-600 mt-1">{version.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## WebSocket 服務器配置

### 自定義 Y-WebSocket 服務器

```javascript
// server/websocket.js
const WebSocket = require('ws')
const http = require('http')
const { setupWSConnection } = require('y-websocket/bin/utils')

const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req, {
    // 認證回調
    authenticate: async (token) => {
      // 驗證 JWT token
      return verifyToken(token)
    },
    // 文檔訪問控制
    docAccess: async (docName, userId) => {
      // 檢查用戶是否有權訪問文檔
      return checkDocumentAccess(docName, userId)
    }
  })
})

server.listen(1234, () => {
  console.log('WebSocket server running on port 1234')
})
```

## 部署指南

### 1. Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# WebSocket 服務器
EXPOSE 1234

# Next.js 應用
EXPOSE 3000

CMD ["npm", "start"]
```

### 2. docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "1234:1234"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/dbname
      - NEXT_PUBLIC_WEBSOCKET_URL=wss://your-domain.com:1234
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=dbname
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 監控和日誌

```typescript
// lib/collaboration/monitoring.ts
import { collaborativeEditingService } from './collaborative-editing'
import { presenceService } from './presence'

export function setupCollaborationMonitoring() {
  // 每分鐘記錄統計
  setInterval(() => {
    const documents = new Set<string>()

    // 收集所有文檔 ID
    const sessions = Array.from(
      (collaborativeEditingService as any).sessions.values()
    )

    sessions.forEach(session => documents.add(session.documentId))

    // 記錄每個文檔的統計
    documents.forEach(docId => {
      const stats = presenceService.getPresenceStats(docId)
      const activeSessions = collaborativeEditingService.getActiveSessions(docId)

      console.log(`[Collaboration] Document ${docId}:`, {
        onlineUsers: stats.onlineUsers,
        typingUsers: stats.typingUsers,
        activeSessions: activeSessions.length,
        activeCursors: stats.activeCursors
      })
    })
  }, 60000)
}
```

## 故障排除

### 常見問題

1. **WebSocket 連接失敗**
   - 檢查防火牆設置
   - 確認 WebSocket URL 正確
   - 驗證 WSS/WS 協議匹配

2. **同步延遲**
   - 檢查網絡延遲
   - 優化變更批處理
   - 增加服務器資源

3. **內存泄漏**
   - 定期清理不活躍會話
   - 限制變更歷史記錄
   - 監控內存使用
