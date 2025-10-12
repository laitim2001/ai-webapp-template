# 🐛 修復記錄範例

> **使用說明**:
> 本文件展示如何正確記錄 bug 修復過程。按時間倒序排列，最新的在最上面。
> 完整的修復記錄指南請參考項目根目錄的 `AI-ASSISTANT-GUIDE.md`

---

## BUG-002: 分頁導航異常 (2025-01-18)

### 🐛 問題描述

當內容列表超過 100 條時，分頁器顯示錯誤的頁碼，導致無法正確導航到後續頁面。

**重現步驟**:
1. 進入內容列表頁面 (`/content`)
2. 確保數據庫中有超過 100 條記錄
3. 滾動到頁面底部
4. 點擊第 6 頁或更後的頁碼
5. 觀察到頁碼計算錯誤，總頁數顯示為 10 而不是 11

**影響範圍**:
- 影響模組: 內容列表、項目列表、用戶列表（所有使用分頁的地方）
- 影響用戶: 所有用戶
- 嚴重程度: Medium
- 發現時間: 2025-01-18 10:30
- 發現人: user1@example.com

**錯誤截圖/日誌**:
```
console.error:
  總數據量: 105
  每頁條數: 10
  計算的總頁數: 10 (錯誤，應該是 11)
  當前頁碼: 11 (超出範圍)
```

### 🔍 根本原因分析

分頁計算邏輯中使用了 JavaScript 的整數除法，在處理非整除情況時未正確向上取整。

**問題代碼**:
```typescript
// components/ui/pagination.tsx:45 (錯誤版本)
const totalPages = totalItems / itemsPerPage; // ❌ 整數除法問題

// 當 totalItems = 105, itemsPerPage = 10 時
// JavaScript 計算: 105 / 10 = 10.5
// 但在條件判斷中會被轉換為 10 (向下取整)
```

**為什麼會出現這個問題**:
1. JavaScript 的除法運算符 `/` 返回浮點數
2. 後續的條件判斷 `currentPage > totalPages` 在比較時會自動轉換類型
3. 10.5 被隱式轉換為 10，導致判斷錯誤

**影響鏈**:
```
錯誤的總頁數計算
  ↓
頁碼按鈕生成錯誤
  ↓
用戶無法訪問最後一頁
  ↓
數據無法完整展示
```

### ✅ 修復方案

**解決思路**:
使用 `Math.ceil()` 函數進行向上取整，確保總頁數計算正確。

**修復後的代碼**:
```typescript
// components/ui/pagination.tsx:45 (正確版本)
const totalPages = Math.ceil(totalItems / itemsPerPage); // ✅ 正確向上取整

// 當 totalItems = 105, itemsPerPage = 10 時
// Math.ceil(105 / 10) = Math.ceil(10.5) = 11 (正確)

// 其他測試案例:
// Math.ceil(100 / 10) = 10  ✓
// Math.ceil(99 / 10) = 10   ✓
// Math.ceil(101 / 10) = 11  ✓
```

**修改文件**:
- `components/ui/pagination.tsx` (第 45 行)
- 總變更: 1 行代碼

**Commit 信息**:
```
fix: 修復分頁總頁數計算錯誤

使用 Math.ceil() 向上取整，確保當數據量不能被每頁條數整除時，
總頁數計算正確。

修復前: totalPages = totalItems / itemsPerPage (可能為小數)
修復後: totalPages = Math.ceil(totalItems / itemsPerPage)

Fixes #42
```

### 🧪 測試驗證

**單元測試**:
```typescript
// __tests__/components/ui/pagination.test.tsx
describe('Pagination 組件', () => {
  it('應該正確計算總頁數 - 整除情況', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );
    expect(result.current.totalPages).toBe(10);
  });

  it('應該正確計算總頁數 - 非整除情況', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 105, itemsPerPage: 10 })
    );
    expect(result.current.totalPages).toBe(11); // ✓ 通過
  });

  it('應該正確計算總頁數 - 邊界情況', () => {
    const testCases = [
      { total: 99, perPage: 10, expected: 10 },
      { total: 100, perPage: 10, expected: 10 },
      { total: 101, perPage: 10, expected: 11 },
      { total: 1, perPage: 10, expected: 1 },
      { total: 0, perPage: 10, expected: 0 },
    ];

    testCases.forEach(({ total, perPage, expected }) => {
      const { result } = renderHook(() =>
        usePagination({ totalItems: total, itemsPerPage: perPage })
      );
      expect(result.current.totalPages).toBe(expected);
    });
  });
});
```

**測試結果**:
- ✅ 單元測試: 新增 5 個測試案例，全部通過
- ✅ 邊界測試: 99, 100, 101, 105, 200 條數據測試通過
- ✅ 回歸測試: 所有分頁場景正常工作
- ✅ E2E 測試: 內容列表、項目列表、用戶列表分頁正常

**手動測試**:
- ✅ 數據量 105 條，正確顯示 11 頁
- ✅ 可以正常訪問第 11 頁
- ✅ 最後一頁顯示 5 條數據（105 % 10 = 5）
- ✅ 頁碼按鈕顯示正確

### 🛡️ 防止復發措施

1. **添加單元測試**:
   - 新增邊界情況測試覆蓋
   - 確保 CI 流程包含這些測試

2. **代碼審查清單更新**:
   - 添加項目：檢查分頁邏輯是否使用 `Math.ceil()`
   - 添加項目：驗證邊界情況處理

3. **文檔更新**:
   - 更新 `docs/components/pagination.md`
   - 添加分頁計算的最佳實踐說明

4. **性能監控**:
   - 添加 Sentry 錯誤追蹤
   - 監控分頁相關的錯誤日誌

### 📊 影響評估

**修復前**:
- 約 15% 的用戶受影響（數據量超過 100 條的場景）
- 每天收到 3-5 個相關問題報告

**修復後**:
- 問題完全解決
- 用戶滿意度提升
- 相關問題報告降為 0

---

## BUG-001: 登入後重定向失敗 (2025-01-12)

### 🐛 問題描述

用戶登入成功後，應該重定向到原來訪問的頁面（通過 `callbackUrl` 參數），但實際總是重定向到首頁。

**重現步驟**:
1. 未登入狀態訪問 `/dashboard`
2. 系統自動重定向到 `/login?callbackUrl=/dashboard`
3. 輸入正確的帳號密碼並登入
4. **預期**: 重定向到 `/dashboard`
5. **實際**: 重定向到 `/` (首頁)

**影響範圍**:
- 影響模組: 認證系統
- 影響用戶: 所有需要登入的用戶
- 嚴重程度: High
- 發現時間: 2025-01-12 14:20
- 發現人: manager@example.com

### 🔍 根本原因分析

NextAuth.js 的 `redirect` 回調函數中，未正確處理 `callbackUrl` 參數，總是返回 `baseUrl`。

**問題代碼**:
```typescript
// app/api/auth/[...nextauth]/route.ts (錯誤版本)
callbacks: {
  async redirect({ url, baseUrl }) {
    return baseUrl; // ❌ 總是返回首頁
  }
}
```

### ✅ 修復方案

```typescript
// app/api/auth/[...nextauth]/route.ts (正確版本)
callbacks: {
  async redirect({ url, baseUrl }) {
    // 相對路徑，直接拼接
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    }

    // 同域的絕對路徑，直接返回
    else if (new URL(url).origin === baseUrl) {
      return url;
    }

    // 其他情況（外部 URL），返回首頁確保安全
    return baseUrl;
  }
}
```

**修改文件**:
- `app/api/auth/[...nextauth]/route.ts` (第 25-35 行)

### 🧪 測試驗證

**測試結果**:
- ✅ 從 `/dashboard` 登入 → 正確重定向到 `/dashboard`
- ✅ 從 `/settings` 登入 → 正確重定向到 `/settings`
- ✅ 直接訪問 `/login` → 正確重定向到首頁
- ✅ 惡意外部 URL → 安全拒絕，重定向到首頁
- ✅ 回歸測試通過

### 🛡️ 防止復發措施

1. 添加 E2E 測試覆蓋登入重定向場景
2. 更新認證系統文檔
3. Code Review 加強對 NextAuth 配置的檢查

---

> **💡 提示**: 記錄 bug 修復時請包含以下要素：
> - 問題描述：清晰的問題說明和重現步驟
> - 根本原因：深入分析問題的真正原因
> - 修復方案：具體的代碼修改
> - 測試驗證：完整的測試結果
> - 防止復發：預防措施和改進建議
> - 影響評估：修復前後的對比
