# NPM 發布檢查清單 - create-ai-webapp

**版本**: 5.0.0
**發布日期**: 2025-10-11

---

## ✅ 發布前檢查

### 1. 包信息驗證
- [x] 包名稱: `create-ai-webapp`
- [x] 版本號: `5.0.0`
- [x] 描述: 完整且準確
- [x] 許可證: MIT
- [x] 作者信息: 已設置
- [x] 倉庫 URL: 已設置

### 2. 文件結構
- [x] `bin/create-ai-webapp.js` - 入口文件存在
- [x] `lib/cli.js` - CLI 核心邏輯
- [x] `lib/file-processor.js` - 文件處理器
- [x] `template/` - 完整模板文件 (366個)
- [x] `README.md` - 使用說明 (7,435字符)
- [x] `LICENSE` - MIT 許可證
- [x] `package.json` - 包配置

### 3. 依賴項
- [x] chalk: ^4.1.2
- [x] fs-extra: ^11.2.0
- [x] inquirer: ^8.2.6
- [x] ora: ^5.4.1

### 4. 本地測試
- [x] `npm link` 成功
- [ ] 零模組配置測試
- [ ] 完整配置測試
- [ ] PostgreSQL 測試
- [ ] MySQL 測試
- [ ] MongoDB 測試
- [ ] SQLite 測試

---

## 📝 首次發布步驟

### Step 1: NPM 登錄
```bash
cd create-ai-webapp
npm login
# 輸入用戶名、密碼、郵箱
```

### Step 2: 驗證包名可用性
```bash
npm view create-ai-webapp
# 如果顯示 "npm ERR! 404" 表示包名可用
# 如果顯示包信息，需要更改包名
```

### Step 3: 最終檢查
```bash
# 檢查將要發布的文件
npm pack --dry-run

# 查看包大小和內容
ls -lh *.tgz
tar -tzf create-ai-webapp-5.0.0.tgz
```

### Step 4: 發布
```bash
# 首次發布
npm publish

# 如果包名被占用，使用作用域包名
npm publish --access public
```

### Step 5: 驗證發布成功
```bash
# 在另一個目錄測試
cd /tmp
npx create-ai-webapp@latest test-project
cd test-project
npm run dev
```

---

## 🔄 後續版本更新流程

### Bug 修復 (Patch: 5.0.0 → 5.0.1)
```bash
# 1. 修復代碼
vim lib/cli.js

# 2. 更新版本
npm version patch

# 3. 發布
npm publish

# 4. 推送到 Git
git push && git push --tags
```

### 新功能 (Minor: 5.0.0 → 5.1.0)
```bash
# 1. 添加新功能
mkdir template/02-modules/module-new-feature

# 2. 更新版本
npm version minor

# 3. 發布
npm publish

# 4. 推送到 Git
git push && git push --tags
```

### 重大變更 (Major: 5.0.0 → 6.0.0)
```bash
# 1. 重大重構
# 修改多個文件

# 2. 更新版本
npm version major

# 3. 更新 CHANGELOG.md
vim CHANGELOG.md

# 4. 發布
npm publish

# 5. 推送到 Git
git push && git push --tags
```

---

## 📊 版本管理最佳實踐

### 版本號選擇指南
| 變更類型 | 版本更新 | 範例 |
|---------|---------|------|
| Bug 修復 | Patch | 5.0.0 → 5.0.1 |
| 新增模組 | Minor | 5.0.0 → 5.1.0 |
| 新增功能 | Minor | 5.0.0 → 5.1.0 |
| API 變更 | Major | 5.0.0 → 6.0.0 |
| 破壞性變更 | Major | 5.0.0 → 6.0.0 |

### 發布頻率建議
- **Bug 修復**: 發現即修復，立即發布
- **新功能**: 累積 2-3 個功能後發布
- **重大變更**: 謹慎規劃，充分測試後發布

### 版本標籤 (Tags)
```bash
# Beta 版本
npm publish --tag beta
npx create-ai-webapp@beta my-app

# Latest (默認)
npm publish --tag latest
npx create-ai-webapp@latest my-app

# 特定版本
npx create-ai-webapp@5.0.0 my-app
```

---

## ⚠️ 注意事項

### 發布前必須檢查
1. ✅ **版本號正確** - 遵循語義化版本
2. ✅ **測試通過** - 至少本地測試成功
3. ✅ **README 更新** - 文檔與代碼同步
4. ✅ **CHANGELOG 更新** - 記錄所有變更
5. ✅ **.npmignore 檢查** - 不發布不必要的文件

### 無法撤銷的操作
- **發布後 24 小時內** 可以使用 `npm unpublish`
- **24 小時後** 無法撤銷，只能發布新版本
- **版本號不可重複使用** - 發布 5.0.0 後無法再發布相同版本

### 常見問題處理

**Q: 包名被占用怎麼辦？**
```bash
# 選項 1: 使用作用域包名
# 修改 package.json: "@your-username/create-ai-webapp"
npm publish --access public

# 選項 2: 更改包名
# 修改 package.json: "create-ai-web-app" 或 "ai-webapp-cli"
```

**Q: 發布失敗怎麼辦？**
```bash
# 查看詳細錯誤
npm publish --verbose

# 常見錯誤:
# 1. 未登錄 → npm login
# 2. 版本重複 → npm version patch
# 3. 包名衝突 → 更改包名
# 4. 網絡問題 → 檢查網絡連接
```

**Q: 如何撤回發布？**
```bash
# 24 小時內可撤回
npm unpublish create-ai-webapp@5.0.0

# 撤回整個包 (謹慎使用)
npm unpublish create-ai-webapp --force
```

---

## 🎯 立即執行

### 命令序列
```bash
# 1. 進入包目錄
cd create-ai-webapp

# 2. 登錄 NPM
npm login

# 3. 檢查包名
npm view create-ai-webapp

# 4. 發布
npm publish

# 5. 驗證
cd ..
mkdir test-npm-package
cd test-npm-package
npx create-ai-webapp@latest my-test-app
```

---

**準備好了就開始發布！** 🚀
