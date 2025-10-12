# UI 組件規範

本目錄包含所有 UI 組件的詳細規範文檔。

## 📋 組件列表

### 基礎組件

1. **[Button](./button.md)** - 按鈕組件
   - 多種變體（default, outline, ghost, destructive）
   - 多種尺寸（sm, md, lg）
   - 加載狀態、禁用狀態

2. **[Input](./input.md)** - 輸入框組件
   - 文本輸入、數字輸入、密碼輸入
   - 錯誤狀態、禁用狀態
   - 前綴/後綴圖標

3. **[Card](./card.md)** - 卡片組件
   - 基礎卡片、交互卡片
   - 卡片頭部、內容、底部

4. **[Dialog](./dialog.md)** - 對話框組件
   - 模態框、確認對話框
   - 可拖拽、可調整大小
   - 嵌套支持

5. **[Dropdown](./dropdown.md)** - 下拉菜單組件
   - 單選、多選
   - 分組、搜索
   - 自定義觸發器

6. **[Toast](./toast.md)** - 通知組件
   - 成功、錯誤、警告、信息
   - 自動關閉、手動關閉
   - 位置配置

7. **[Table](./table.md)** - 表格組件
   - 排序、過濾、分頁
   - 行選擇、批量操作
   - 響應式設計

### 表單組件

- **[Checkbox](./checkbox.md)** - 複選框
- **[Radio](./radio.md)** - 單選框
- **[Select](./select.md)** - 選擇器
- **[Switch](./switch.md)** - 開關
- **[Textarea](./textarea.md)** - 多行文本框
- **[DatePicker](./datepicker.md)** - 日期選擇器
- **[Slider](./slider.md)** - 滑塊

### 反饋組件

- **[Alert](./alert.md)** - 警告提示
- **[Badge](./badge.md)** - 徽章
- **[Progress](./progress.md)** - 進度條
- **[Skeleton](./skeleton.md)** - 骨架屏
- **[Spinner](./spinner.md)** - 加載指示器

### 導航組件

- **[Tabs](./tabs.md)** - 標籤頁
- **[Breadcrumb](./breadcrumb.md)** - 面包屑
- **[Pagination](./pagination.md)** - 分頁
- **[Menu](./menu.md)** - 菜單

### 數據展示

- **[Avatar](./avatar.md)** - 頭像
- **[Tooltip](./tooltip.md)** - 工具提示
- **[Popover](./popover.md)** - 彈出層
- **[Accordion](./accordion.md)** - 手風琴

## 📝 組件規範模板

每個組件文檔應包含以下部分：

### 1. 概述
- 組件用途和使用場景
- 設計原則

### 2. 變體
- 所有可用的視覺變體
- 變體使用場景

### 3. 屬性（Props）
- 必需屬性
- 可選屬性
- 默認值

### 4. 狀態
- 默認狀態
- 懸停狀態
- 激活狀態
- 禁用狀態
- 錯誤狀態

### 5. 尺寸
- 可用尺寸選項
- 尺寸使用建議

### 6. 示例代碼
- 基本用法
- 常見場景
- 進階用法

### 7. 無障礙性
- ARIA 屬性
- 鍵盤導航
- 屏幕閱讀器支持

### 8. 最佳實踐
- 使用建議
- 常見錯誤

## 🎨 設計原則

所有組件都應遵循以下原則：

1. **一致性**: 與設計系統保持一致
2. **可訪問性**: 符合 WCAG 2.1 AA 標準
3. **響應式**: 在所有設備上正常工作
4. **可組合**: 可與其他組件組合使用
5. **可定制**: 支持通過 props 和 className 定制

## 🔧 組件開發指南

### 文件命名

```
components/ui/button/
├── button.tsx          # 組件實現
├── button.test.tsx     # 單元測試
└── button.stories.tsx  # Storybook 故事（可選）
```

### TypeScript 類型

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
```

### 樣式

使用 Tailwind CSS 和 `cn()` 工具函數：

```tsx
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-accent',
  // ...
};

<button className={cn(buttonVariants[variant], className)} />
```

## 📚 參考資源

- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind UI](https://tailwindui.com/)
- [Material-UI](https://mui.com/)

---

**注意**: 本項目中的組件是從現有項目提取並經過模板化處理的。所有組件都經過實戰驗證，確保穩定性和可用性。

