# Patch 5.0.1 Release Notes

**發布日期**: 2025-10-11
**版本**: 5.0.1
**類型**: Bug Fix Release
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🐛 Bug 修復

### 1. 改進錯誤處理 (npm install)

**問題**:
- `npm install` 失敗時，錯誤信息被 `stdio: 'ignore'` 隱藏
- 用戶無法看到詳細的錯誤原因
- 難以排查安裝問題

**修復**:
```javascript
// 之前 (lib/cli.js:561)
execSync('npm install', { stdio: 'ignore' });

// 修復後
execSync('npm install', { stdio: 'inherit' });
console.error(chalk.red('\n詳細錯誤信息:'));
console.error(chalk.gray('請檢查網絡連接或手動運行 npm install\n'));
```

**效果**:
- ✅ 顯示完整的 npm 錯誤輸出
- ✅ 提供友好的錯誤提示
- ✅ 幫助用戶快速定位問題

---

### 2. 修復 Windows 清理目錄問題

**問題**:
- Windows 上文件句柄未及時釋放
- `fs.remove()` 拋出 `EBUSY: resource busy or locked` 錯誤
- 用戶看到未預期的錯誤信息

**修復**:
```javascript
// 之前 (bin/create-ai-webapp.js:95)
await fs.remove(projectPath);

// 修復後
try {
  // 等待文件句柄釋放
  await new Promise(resolve => setTimeout(resolve, 1000));
  await fs.remove(projectPath);
  console.log(chalk.green('✓ 清理完成\n'));
} catch (cleanupError) {
  console.error(chalk.yellow('⚠️  自動清理失敗，請手動刪除目錄:\n'));
  console.error(chalk.gray(`  rm -rf ${targetDirName}\n`));
}
```

**效果**:
- ✅ Windows 上正確處理文件鎖定
- ✅ 失敗時提供手動清理指引
- ✅ 改善用戶體驗

---

## 📊 變更統計

### 修改的文件
- `lib/cli.js` - 改進依賴安裝錯誤處理
- `bin/create-ai-webapp.js` - 修復 Windows 清理邏輯

### 代碼變更
- **新增**: 6 行
- **修改**: 8 行
- **刪除**: 2 行

---

## 🔄 升級指南

### 自動升級 (推薦)

用戶使用 `npx create-ai-webapp@latest` 會自動獲取最新版本：

```bash
# 自動使用 5.0.1
npx create-ai-webapp@latest my-app
```

### 手動指定版本

```bash
# 明確指定 5.0.1
npx create-ai-webapp@5.0.1 my-app
```

---

## ✅ 驗證測試

### 測試場景 1: npm install 失敗

**測試步驟**:
1. 斷網或使用無效的 npm registry
2. 運行 `npx create-ai-webapp test-app`
3. 觀察錯誤輸出

**預期結果**:
- ✅ 顯示 npm 的詳細錯誤信息
- ✅ 提供友好的錯誤提示
- ✅ 建議用戶檢查網絡或手動安裝

### 測試場景 2: Windows 清理目錄

**測試步驟**:
1. Windows 系統上運行創建項目
2. 在過程中觸發失敗（例如 Ctrl+C）
3. 觀察清理行為

**預期結果**:
- ✅ 等待 1 秒後嘗試清理
- ✅ 清理成功或提供手動清理指引
- ✅ 無 EBUSY 錯誤拋出

---

## 🔍 已知問題

### 無重大已知問題

當前版本沒有已知的重大問題。

### 輕微問題 (不影響使用)

1. **NPM 警告**:
   ```
   npm warn publish "bin[create-ai-webapp]" script name was cleaned
   ```
   - **影響**: 無，NPM 自動修正
   - **計劃**: 將在下個版本清理 package.json

---

## 📝 用戶反饋

### 報告的問題

**Issue #1**: npm install 失敗但看不到錯誤
- **狀態**: ✅ 已修復 (5.0.1)
- **報告者**: 內部測試

**Issue #2**: Windows 清理目錄失敗
- **狀態**: ✅ 已修復 (5.0.1)
- **報告者**: 內部測試

---

## 🗺️ 下一步計劃

### v5.0.2 (計劃中)

**可能的改進**:
- [ ] 清理 package.json 警告
- [ ] 優化依賴安裝進度顯示
- [ ] 添加 `--skip-install` 選項
- [ ] 改進 CLI 互動體驗

### v5.1.0 (計劃中)

**新功能**:
- [ ] 添加更多模組
- [ ] 支持自定義模板
- [ ] 改進演示模式
- [ ] 添加交互式教程

---

## 🤝 貢獻

感謝以下方式的貢獻:

- **Bug 報告**: 通過測試發現的問題
- **代碼審查**: 內部代碼質量審查
- **用戶反饋**: 早期用戶的使用反饋

---

## 📞 支持

### 遇到問題？

- **GitHub Issues**: https://github.com/laitim2001/ai-webapp-template/issues
- **NPM**: https://www.npmjs.com/package/create-ai-webapp
- **Email**: laitim20012@gmail.com

### 報告 Bug

請提供以下信息:
1. 操作系統和版本
2. Node.js 版本 (`node --version`)
3. NPM 版本 (`npm --version`)
4. 完整的錯誤信息
5. 重現步驟

---

## 📜 完整變更日誌

### v5.0.1 (2025-10-11)

**Bug Fixes**:
- 改進 npm install 錯誤處理 (lib/cli.js)
- 修復 Windows 清理目錄問題 (bin/create-ai-webapp.js)

**Chores**:
- 更新版本號到 5.0.1
- 更新發布文檔

### v5.0.0 (2025-10-11)

**Features**:
- 初始 NPX 包發布
- 22個功能模組
- 15個演示頁面
- 多數據庫支持

---

**安裝最新版本**: `npx create-ai-webapp@latest my-app`

**查看變更**: https://github.com/laitim2001/ai-webapp-template/releases

---

**發布日期**: 2025-10-11
**發布者**: laitim2001
**版本**: 5.0.1 (Patch Release)
