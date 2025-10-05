# 組件使用指南

本文檔提供 AI Web App Template 中所有 UI 組件的詳細使用指南，包括 API 說明、使用範例和最佳實踐。

## 📋 目錄

- [按鈕組件](#按鈕組件)
- [輸入組件](#輸入組件)
- [卡片組件](#卡片組件)
- [對話框組件](#對話框組件)
- [下拉選單組件](#下拉選單組件)
- [表單組件](#表單組件)
- [反饋組件](#反饋組件)
- [導航組件](#導航組件)

---

## 按鈕組件

### Button - 基礎按鈕

**引入方式**:
```tsx
import { Button } from '@/components/ui/button'
```

**Props API**:
| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| variant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | 按鈕樣式變體 |
| size | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | 按鈕尺寸 |
| asChild | `boolean` | `false` | 作為子元素渲染 |
| disabled | `boolean` | `false` | 禁用狀態 |

**基礎用法**:
```tsx
// 標準按鈕
<Button>點擊我</Button>

// 危險操作按鈕
<Button variant="destructive">刪除</Button>

// 次要按鈕
<Button variant="outline">取消</Button>

// 文字按鈕
<Button variant="link">了解更多</Button>
```

**尺寸變體**:
```tsx
<Button size="sm">小按鈕</Button>
<Button size="default">標準按鈕</Button>
<Button size="lg">大按鈕</Button>

// 圖示按鈕（正方形）
<Button size="icon">
  <Search className="h-4 w-4" />
</Button>
```

**帶圖示的按鈕**:
```tsx
<Button>
  <Mail className="mr-2 h-4 w-4" />
  發送郵件
</Button>

<Button variant="outline">
  下載
  <Download className="ml-2 h-4 w-4" />
</Button>
```

**載入狀態**:
```tsx
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  處理中...
</Button>
```

**作為連結使用**:
```tsx
import { Link } from 'next/link'

<Button asChild>
  <Link href="/dashboard">前往儀表板</Link>
</Button>
```

**最佳實踐**:
- ✅ 主要操作使用 `variant="default"`
- ✅ 危險操作使用 `variant="destructive"`
- ✅ 次要操作使用 `variant="outline"` 或 `variant="ghost"`
- ✅ 載入狀態時禁用按鈕並顯示 spinner
- ❌ 避免在小區域使用 `size="lg"`

---

## 輸入組件

### Input - 文字輸入框

**引入方式**:
```tsx
import { Input } from '@/components/ui/input'
```

**Props API**:
| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| type | `string` | `'text'` | 輸入類型 |
| placeholder | `string` | - | 佔位文字 |
| disabled | `boolean` | `false` | 禁用狀態 |
| className | `string` | - | 自訂 CSS 類別 |

**基礎用法**:
```tsx
<Input placeholder="請輸入內容" />

<Input type="email" placeholder="your@email.com" />

<Input type="password" placeholder="密碼" />

<Input type="number" placeholder="數量" />
```

**帶標籤的輸入**:
```tsx
<div className="space-y-2">
  <Label htmlFor="email">電子郵件</Label>
  <Input id="email" type="email" placeholder="your@email.com" />
  <p className="text-sm text-gray-500">我們不會分享您的郵件</p>
</div>
```

**帶圖示的輸入**:
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
  <Input className="pl-10" placeholder="搜尋..." />
</div>

<div className="relative">
  <Input className="pr-10" type="password" />
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="absolute right-0 top-0"
  >
    <Eye className="h-4 w-4" />
  </Button>
</div>
```

**錯誤狀態**:
```tsx
<div className="space-y-2">
  <Label htmlFor="email">電子郵件</Label>
  <Input
    id="email"
    type="email"
    className="border-red-500 focus-visible:ring-red-500"
  />
  <p className="text-sm text-red-500">請輸入有效的電子郵件</p>
</div>
```

### Textarea - 多行文字輸入

**引入方式**:
```tsx
import { Textarea } from '@/components/ui/textarea'
```

**基礎用法**:
```tsx
<Textarea placeholder="請輸入備註..." rows={4} />

<Textarea
  placeholder="詳細描述"
  className="resize-none"
  rows={6}
/>
```

**字數限制**:
```tsx
function TextareaWithLimit() {
  const [value, setValue] = useState('')
  const maxLength = 200

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        rows={4}
      />
      <p className="text-sm text-gray-500 text-right">
        {value.length}/{maxLength}
      </p>
    </div>
  )
}
```

### Checkbox - 核取方塊

**引入方式**:
```tsx
import { Checkbox } from '@/components/ui/checkbox'
```

**基礎用法**:
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm">
    我同意服務條款
  </label>
</div>
```

**受控組件**:
```tsx
function CheckboxDemo() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="subscribe"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <label htmlFor="subscribe">訂閱電子報</label>
    </div>
  )
}
```

**多選列表**:
```tsx
function CheckboxList() {
  const [items, setItems] = useState([
    { id: '1', label: '選項 1', checked: false },
    { id: '2', label: '選項 2', checked: false },
    { id: '3', label: '選項 3', checked: false },
  ])

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={item.id}
            checked={item.checked}
            onCheckedChange={(checked) => {
              setItems(items.map(i =>
                i.id === item.id ? { ...i, checked } : i
              ))
            }}
          />
          <label htmlFor={item.id}>{item.label}</label>
        </div>
      ))}
    </div>
  )
}
```

### Switch - 開關切換

**引入方式**:
```tsx
import { Switch } from '@/components/ui/switch'
```

**基礎用法**:
```tsx
<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">啟用通知</Label>
</div>
```

**設定面板**:
```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <Label htmlFor="marketing">行銷郵件</Label>
      <p className="text-sm text-gray-500">接收產品更新和優惠</p>
    </div>
    <Switch id="marketing" />
  </div>

  <div className="flex items-center justify-between">
    <div>
      <Label htmlFor="security">安全警告</Label>
      <p className="text-sm text-gray-500">帳戶安全相關通知</p>
    </div>
    <Switch id="security" defaultChecked />
  </div>
</div>
```

---

## 卡片組件

### Card - 卡片容器

**引入方式**:
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
```

**基礎結構**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>卡片標題</CardTitle>
    <CardDescription>卡片描述文字</CardDescription>
  </CardHeader>
  <CardContent>
    <p>主要內容區域</p>
  </CardContent>
  <CardFooter>
    <Button>操作按鈕</Button>
  </CardFooter>
</Card>
```

**統計卡片**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">
      總收益
    </CardTitle>
    <DollarSign className="h-4 w-4 text-gray-500" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89</div>
    <p className="text-xs text-gray-500">
      +20.1% 比上月
    </p>
  </CardContent>
</Card>
```

**表單卡片**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>建立帳戶</CardTitle>
    <CardDescription>
      輸入您的資料以建立新帳戶
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">姓名</Label>
        <Input id="name" placeholder="張三" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">電子郵件</Label>
        <Input id="email" type="email" />
      </div>
    </form>
  </CardContent>
  <CardFooter>
    <Button className="w-full">建立帳戶</Button>
  </CardFooter>
</Card>
```

**列表卡片**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>最近活動</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <div className="divide-y">
      {activities.map((activity) => (
        <div key={activity.id} className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={activity.avatar} />
              <AvatarFallback>{activity.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.user}</p>
              <p className="text-sm text-gray-500">{activity.action}</p>
            </div>
            <span className="text-xs text-gray-500">
              {activity.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

---

## 對話框組件

### Dialog - 標準對話框

**引入方式**:
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
```

**基礎用法**:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>開啟對話框</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>對話框標題</DialogTitle>
      <DialogDescription>
        這是對話框的描述文字
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* 對話框內容 */}
    </div>
    <DialogFooter>
      <Button variant="outline">取消</Button>
      <Button>確認</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**表單對話框**:
```tsx
function EditProfileDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>編輯個人資料</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯個人資料</DialogTitle>
          <DialogDescription>
            修改您的個人資料，點擊儲存即可更新
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              郵件
            </Label>
            <Input id="email" type="email" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### AlertDialog - 警告對話框

**引入方式**:
```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
```

**危險操作確認**:
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">刪除帳戶</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
      <AlertDialogDescription>
        此操作無法復原。這將永久刪除您的帳戶並移除所有數據。
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        繼續刪除
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 下拉選單組件

### Select - 下拉選單

**引入方式**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
```

**基礎用法**:
```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="選擇選項" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">選項 1</SelectItem>
    <SelectItem value="option2">選項 2</SelectItem>
    <SelectItem value="option3">選項 3</SelectItem>
  </SelectContent>
</Select>
```

**受控組件**:
```tsx
function SelectDemo() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="選擇語言" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">中文</SelectItem>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

**分組選單**:
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="選擇水果" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>柑橘類</SelectLabel>
      <SelectItem value="orange">橙</SelectItem>
      <SelectItem value="lemon">檸檬</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>莓果類</SelectLabel>
      <SelectItem value="strawberry">草莓</SelectItem>
      <SelectItem value="blueberry">藍莓</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### DropdownMenu - 下拉式選單

**引入方式**:
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
```

**基礎用法**:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">開啟選單</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>我的帳戶</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>個人資料</DropdownMenuItem>
    <DropdownMenuItem>設定</DropdownMenuItem>
    <DropdownMenuItem>登出</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**用戶選單**:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar>
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium">張三</p>
        <p className="text-xs text-gray-500">zhang@example.com</p>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      個人資料
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      設定
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-600">
      <LogOut className="mr-2 h-4 w-4" />
      登出
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 表單組件

### Label - 表單標籤

**引入方式**:
```tsx
import { Label } from '@/components/ui/label'
```

**基礎用法**:
```tsx
<div className="space-y-2">
  <Label htmlFor="email">電子郵件</Label>
  <Input id="email" type="email" />
</div>
```

**必填標記**:
```tsx
<Label htmlFor="username">
  用戶名 <span className="text-red-500">*</span>
</Label>
```

### 完整表單範例

```tsx
function ProfileForm() {
  return (
    <form className="space-y-6">
      {/* 姓名（兩欄） */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">名字</Label>
          <Input id="firstName" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">姓氏</Label>
          <Input id="lastName" />
        </div>
      </div>

      {/* 電子郵件 */}
      <div className="space-y-2">
        <Label htmlFor="email">電子郵件</Label>
        <Input id="email" type="email" />
      </div>

      {/* 角色選擇 */}
      <div className="space-y-2">
        <Label htmlFor="role">角色</Label>
        <Select>
          <SelectTrigger id="role">
            <SelectValue placeholder="選擇角色" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">管理員</SelectItem>
            <SelectItem value="user">用戶</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 簡介 */}
      <div className="space-y-2">
        <Label htmlFor="bio">個人簡介</Label>
        <Textarea id="bio" rows={4} />
      </div>

      {/* 偏好設定 */}
      <div className="space-y-4">
        <Label>通知偏好</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-notifications" />
            <label htmlFor="email-notifications" className="text-sm">
              電子郵件通知
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push-notifications" />
            <label htmlFor="push-notifications" className="text-sm">
              推播通知
            </label>
          </div>
        </div>
      </div>

      {/* 提交按鈕 */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">取消</Button>
        <Button type="submit">儲存變更</Button>
      </div>
    </form>
  )
}
```

---

## 反饋組件

### Alert - 警告提示

**引入方式**:
```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
```

**基礎用法**:
```tsx
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>注意</AlertTitle>
  <AlertDescription>
    這是一個重要的提示信息
  </AlertDescription>
</Alert>
```

**變體樣式**:
```tsx
{/* 預設樣式 */}
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>提示</AlertTitle>
  <AlertDescription>一般信息提示</AlertDescription>
</Alert>

{/* 成功提示 */}
<Alert className="border-green-500 text-green-700">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>成功</AlertTitle>
  <AlertDescription>操作已完成</AlertDescription>
</Alert>

{/* 警告提示 */}
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>錯誤</AlertTitle>
  <AlertDescription>發生錯誤，請稍後再試</AlertDescription>
</Alert>
```

### Badge - 徽章標籤

**引入方式**:
```tsx
import { Badge } from '@/components/ui/badge'
```

**基礎用法**:
```tsx
<Badge>預設</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">危險</Badge>
<Badge variant="outline">外框</Badge>
```

**狀態標籤**:
```tsx
<div className="flex gap-2">
  <Badge className="bg-green-500">啟用</Badge>
  <Badge className="bg-yellow-500">待處理</Badge>
  <Badge className="bg-red-500">停用</Badge>
</div>
```

**計數標籤**:
```tsx
<Button variant="outline" className="relative">
  通知
  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
    3
  </Badge>
</Button>
```

### Progress - 進度條

**引入方式**:
```tsx
import { Progress } from '@/components/ui/progress'
```

**基礎用法**:
```tsx
<Progress value={33} />
<Progress value={66} />
<Progress value={100} />
```

**帶標籤的進度條**:
```tsx
function ProgressWithLabel() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10))
    }, 500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>上傳進度</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  )
}
```

### Skeleton - 骨架屏

**引入方式**:
```tsx
import { Skeleton } from '@/components/ui/skeleton'
```

**基礎用法**:
```tsx
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

**卡片骨架**:
```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-3 w-3/4" />
  </CardHeader>
  <CardContent className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </CardContent>
</Card>
```

**列表骨架**:
```tsx
<div className="space-y-2">
  {Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="flex items-center gap-3 p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ))}
</div>
```

---

## 導航組件

### Tabs - 分頁標籤

**引入方式**:
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
```

**基礎用法**:
```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">帳戶</TabsTrigger>
    <TabsTrigger value="password">密碼</TabsTrigger>
    <TabsTrigger value="notifications">通知</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader>
        <CardTitle>帳戶設定</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 帳戶設定表單 */}
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="password">
    {/* 密碼設定內容 */}
  </TabsContent>
  <TabsContent value="notifications">
    {/* 通知設定內容 */}
  </TabsContent>
</Tabs>
```

**受控標籤**:
```tsx
function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">總覽</TabsTrigger>
        <TabsTrigger value="analytics">分析</TabsTrigger>
        <TabsTrigger value="reports">報告</TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab}>
        {/* 內容根據 activeTab 動態渲染 */}
      </TabsContent>
    </Tabs>
  )
}
```

### Avatar - 頭像

**引入方式**:
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
```

**基礎用法**:
```tsx
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

**尺寸變體**:
```tsx
<Avatar className="h-8 w-8">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>S</AvatarFallback>
</Avatar>

<Avatar className="h-10 w-10">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>M</AvatarFallback>
</Avatar>

<Avatar className="h-16 w-16">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>L</AvatarFallback>
</Avatar>
```

**頭像組**:
```tsx
<div className="flex -space-x-2">
  {users.map((user) => (
    <Avatar key={user.id} className="border-2 border-white">
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  ))}
  <Avatar className="border-2 border-white">
    <AvatarFallback>+5</AvatarFallback>
  </Avatar>
</div>
```

---

## 組合模式

### 搜尋列

```tsx
function SearchBar() {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input className="pl-10" placeholder="搜尋..." />
      </div>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="類別" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="docs">文件</SelectItem>
          <SelectItem value="users">用戶</SelectItem>
        </SelectContent>
      </Select>
      <Button>搜尋</Button>
    </div>
  )
}
```

### 資料表操作列

```tsx
function DataTableToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Input
          placeholder="篩選名稱..."
          className="w-64"
        />
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="active">啟用</SelectItem>
            <SelectItem value="inactive">停用</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          更多篩選
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          匯出
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          新增
        </Button>
      </div>
    </div>
  )
}
```

### 狀態卡片

```tsx
function StatusCard({ title, value, change, icon: Icon }) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(change)}%
          </span>
          <span>比上期</span>
        </p>
      </CardContent>
    </Card>
  )
}
```

---

## 最佳實踐總結

### 通用原則

1. **一致性**: 在整個應用中使用相同的組件和樣式
2. **可訪問性**: 確保所有組件支援鍵盤導航和螢幕閱讀器
3. **響應式**: 在不同螢幕尺寸下測試組件
4. **性能**: 避免不必要的重新渲染，使用 memo 和 useMemo

### 表單最佳實踐

- ✅ 始終使用 Label 與 Input 配對
- ✅ 提供清晰的錯誤信息
- ✅ 使用適當的 input type
- ✅ 禁用狀態時提供視覺反饋
- ✅ 表單提交時顯示載入狀態

### 對話框最佳實踐

- ✅ 使用 AlertDialog 進行破壞性操作
- ✅ 提供明確的取消和確認選項
- ✅ 避免巢狀對話框
- ✅ 確保可以用 ESC 鍵關閉

### 導航最佳實踐

- ✅ 保持導航結構簡單清晰
- ✅ 高亮顯示當前頁面
- ✅ 移動端使用漢堡選單
- ✅ 提供麵包屑導航（深層頁面）

---

**相關文檔**:
- [UI-STRUCTURE.md](./UI-STRUCTURE.md) - UI 結構分析
- [LAYOUT-PATTERNS.md](./LAYOUT-PATTERNS.md) - 佈局模式說明
- [README.md](./README.md) - UI 參考文檔總覽
