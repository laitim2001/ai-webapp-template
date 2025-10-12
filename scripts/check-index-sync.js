#!/usr/bin/env node

/**
 * 索引同步檢查腳本
 * Index Synchronization Check Script
 *
 * 用途: 檢查實際文件與索引記錄的同步狀態
 * Purpose: Check sync status between actual files and index records
 *
 * 使用: npm run check:index 或 node scripts/check-index-sync.js
 * Usage: npm run check:index or node scripts/check-index-sync.js
 */

const fs = require('fs');
const path = require('path');

// =====================================================
// 配置
// =====================================================

const CONFIG = {
  // 索引文件路徑
  indexFiles: {
    main: 'TEMPLATE-INDEX.md',
    navigation: 'PROJECT-INDEX.md',
    guide: 'TEMPLATE-DEVELOPMENT-GUIDE.md',
  },

  // 機器可讀索引文件（優先使用）
  machineIndexFile: '.template-files.json',

  // 需要掃描的目錄
  scanDirs: [
    '01-base',
    '02-modules',
    '00-monitoring',
    'Docs',
    'examples',
    'scripts',
  ],

  // 需要索引的文件類型
  importantExtensions: ['.md', '.js', '.ts', '.tsx', '.prisma', '.template'],

  // 排除的目錄
  excludeDirs: [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    'test-projects',
  ],

  // 核心文件（必須100%索引）
  coreFiles: [
    'README.md',
    'CHANGELOG.md',
    'CLAUDE.md',
    'init-project.js',
    'TEMPLATE-DEVELOPMENT-GUIDE.md',
    'TEMPLATE-INDEX.md',
    'PROJECT-INDEX.md',
    'INDEX-MAINTENANCE-GUIDE.md',
  ],
};

// =====================================================
// 工具函數
// =====================================================

/**
 * 遞歸掃描目錄獲取所有文件
 */
function scanDirectory(dir, baseDir = dir) {
  const files = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.relative(baseDir, fullPath);

      // 跳過排除目錄
      if (CONFIG.excludeDirs.some(excluded => relativePath.includes(excluded))) {
        continue;
      }

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 遞歸掃描子目錄
        files.push(...scanDirectory(fullPath, baseDir));
      } else if (stat.isFile()) {
        // 檢查文件擴展名
        const ext = path.extname(item);
        if (CONFIG.importantExtensions.includes(ext)) {
          files.push(relativePath.replace(/\\/g, '/'));
        }
      }
    }
  } catch (error) {
    console.error(`❌ 掃描目錄失敗: ${dir}`, error.message);
  }

  return files;
}

/**
 * 從機器可讀索引文件載入
 */
function loadMachineIndex(indexPath) {
  try {
    const content = fs.readFileSync(indexPath, 'utf-8');
    const index = JSON.parse(content);

    const indexed = new Set();
    if (index.files && Array.isArray(index.files)) {
      for (const file of index.files) {
        if (file.path) {
          indexed.add(file.path);
        }
      }
    }

    return indexed;
  } catch (error) {
    console.error(`❌ 讀取機器索引失敗: ${indexPath}`, error.message);
    return new Set();
  }
}

/**
 * 從索引文件中提取文件路徑
 */
function extractIndexedFiles(indexPath) {
  const indexed = new Set();

  try {
    const content = fs.readFileSync(indexPath, 'utf-8');

    // 提取各種格式的文件路徑
    const patterns = [
      // Markdown 鏈接: [text](path)
      /\[.*?\]\((.*?\.(?:md|js|ts|tsx|prisma|template))\)/g,
      // 表格中的路徑: | path/to/file | 或 | **path/to/file** |
      /\|\s*\*{0,2}([a-zA-Z0-9_\-\/\.]+\.(?:md|js|ts|tsx|prisma|template))\*{0,2}\s*\|/g,
      // 代碼塊中的路徑: `path/to/file`
      /`([a-zA-Z0-9_\-\/\.]+\.(?:md|js|ts|tsx|prisma|template))`/g,
      // 文件樹格式: ├── path/to/file 或 │   ├── path/to/file
      /[├└│]\s*([a-zA-Z0-9_\-\/\.]+\.(?:md|js|ts|tsx|prisma|template))/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        let filePath = match[1];

        // 清理路徑
        filePath = filePath.replace(/^\.\//, ''); // 移除 ./
        filePath = filePath.replace(/\\/g, '/'); // 統一斜線
        filePath = filePath.trim(); // 移除前後空格

        // 跳過 URL 和絕對路徑
        if (filePath.startsWith('http') || filePath.startsWith('/')) {
          continue;
        }

        indexed.add(filePath);
      }
    }
  } catch (error) {
    console.error(`❌ 讀取索引文件失敗: ${indexPath}`, error.message);
  }

  return indexed;
}

/**
 * 生成統計報告
 */
function generateReport(actualFiles, indexedFiles, coreFilesStatus) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 索引同步檢查報告');
  console.log('   Index Synchronization Check Report');
  console.log('='.repeat(70) + '\n');

  // 整體統計
  const actualSet = new Set(actualFiles);
  const indexSet = new Set(indexedFiles);

  const missingInIndex = [...actualSet].filter(f => !indexSet.has(f));
  const ghostEntries = [...indexSet].filter(f => !actualSet.has(f) && !f.includes('http'));

  console.log('📈 整體統計:');
  console.log(`   實際文件總數: ${actualFiles.length}`);
  console.log(`   索引文件數: ${indexedFiles.size}`);
  console.log(`   索引健康度: ${((indexedFiles.size / actualFiles.length) * 100).toFixed(1)}%\n`);

  // 核心文件檢查
  const missingCore = coreFilesStatus.filter(s => !s.indexed);
  if (missingCore.length === 0) {
    console.log('✅ 核心文件檢查: 全部已索引 (100%)\n');
  } else {
    console.log('❌ 核心文件檢查: 發現遺漏');
    missingCore.forEach(s => {
      console.log(`   ✗ ${s.file}`);
    });
    console.log('');
  }

  // 遺漏索引文件
  if (missingInIndex.length === 0) {
    console.log('✅ 索引完整性: 所有文件已索引\n');
  } else {
    console.log(`⚠️  遺漏索引: ${missingInIndex.length} 個文件未索引\n`);

    // 按目錄分組
    const byDir = {};
    missingInIndex.forEach(file => {
      const dir = path.dirname(file);
      if (!byDir[dir]) byDir[dir] = [];
      byDir[dir].push(file);
    });

    // 限制顯示數量
    const maxShow = 20;
    let shown = 0;

    for (const [dir, files] of Object.entries(byDir)) {
      if (shown >= maxShow) {
        console.log(`   ... 還有 ${missingInIndex.length - shown} 個文件未顯示`);
        break;
      }

      console.log(`   📁 ${dir}/`);
      for (const file of files.slice(0, 5)) {
        if (shown >= maxShow) break;
        console.log(`      ✗ ${path.basename(file)}`);
        shown++;
      }
      if (files.length > 5) {
        console.log(`      ... 還有 ${files.length - 5} 個文件`);
      }
    }
    console.log('');
  }

  // 幽靈條目
  if (ghostEntries.length === 0) {
    console.log('✅ 索引準確性: 無幽靈條目\n');
  } else {
    console.log(`⚠️  幽靈條目: ${ghostEntries.length} 個索引條目但文件不存在\n`);
    ghostEntries.slice(0, 10).forEach(entry => {
      console.log(`   ✗ ${entry}`);
    });
    if (ghostEntries.length > 10) {
      console.log(`   ... 還有 ${ghostEntries.length - 10} 個條目`);
    }
    console.log('');
  }

  // 目錄覆蓋率
  console.log('📊 目錄覆蓋率:\n');
  const dirStats = {};
  actualFiles.forEach(file => {
    const dir = file.split('/')[0];
    if (!dirStats[dir]) dirStats[dir] = { total: 0, indexed: 0 };
    dirStats[dir].total++;
    if (indexSet.has(file)) dirStats[dir].indexed++;
  });

  for (const [dir, stats] of Object.entries(dirStats)) {
    const coverage = ((stats.indexed / stats.total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(coverage / 5)) + '░'.repeat(20 - Math.floor(coverage / 5));
    console.log(`   ${dir.padEnd(20)} ${bar} ${coverage}% (${stats.indexed}/${stats.total})`);
  }
  console.log('');

  // 總體評估
  console.log('='.repeat(70));
  const healthScore = ((indexedFiles.size / actualFiles.length) * 100).toFixed(1);
  if (healthScore >= 95 && missingCore.length === 0 && ghostEntries.length === 0) {
    console.log('🎉 索引狀態: 優秀 (健康度 ≥95%, 核心文件100%, 無幽靈條目)');
  } else if (healthScore >= 90 && missingCore.length === 0) {
    console.log('✅ 索引狀態: 良好 (健康度 ≥90%, 核心文件100%)');
  } else if (healthScore >= 80) {
    console.log('⚠️  索引狀態: 需要改進 (健康度 ≥80%)');
  } else {
    console.log('❌ 索引狀態: 需要立即處理 (健康度 <80%)');
  }
  console.log('='.repeat(70) + '\n');

  // 建議
  if (missingInIndex.length > 0 || ghostEntries.length > 0 || missingCore.length > 0) {
    console.log('💡 建議操作:\n');

    if (missingCore.length > 0) {
      console.log('   🔴 優先級1: 更新 TEMPLATE-INDEX.md 添加核心文件');
    }

    if (missingInIndex.length > 0) {
      console.log('   🟡 優先級2: 更新 TEMPLATE-INDEX.md 添加遺漏文件');
      console.log('      參考: INDEX-MAINTENANCE-GUIDE.md 第5節「新增文件維護」');
    }

    if (ghostEntries.length > 0) {
      console.log('   🟢 優先級3: 從索引中移除幽靈條目');
      console.log('      參考: INDEX-MAINTENANCE-GUIDE.md 第8節「常見錯誤」');
    }

    console.log('\n   詳細指南: 參考 INDEX-MAINTENANCE-GUIDE.md\n');
  }

  return {
    healthScore: parseFloat(healthScore),
    missingCount: missingInIndex.length,
    ghostCount: ghostEntries.length,
    coreFilesOk: missingCore.length === 0,
  };
}

// =====================================================
// 主程序
// =====================================================

async function main() {
  console.log('\n🔍 開始索引同步檢查...\n');

  // 1. 掃描實際文件
  console.log('📂 掃描項目文件...');
  let actualFiles = [];

  // 掃描根目錄的核心文件
  const rootFiles = fs.readdirSync('.')
    .filter(file => {
      const ext = path.extname(file);
      return CONFIG.importantExtensions.includes(ext) && fs.statSync(file).isFile();
    });
  actualFiles.push(...rootFiles);

  // 掃描指定目錄
  for (const dir of CONFIG.scanDirs) {
    if (fs.existsSync(dir)) {
      const dirFiles = scanDirectory(dir, '.');
      actualFiles.push(...dirFiles);
    }
  }

  console.log(`   找到 ${actualFiles.length} 個重要文件\n`);

  // 2. 提取索引文件中的記錄
  console.log('📋 讀取索引文件...');
  let allIndexedFiles = new Set();
  let useMachineIndex = false;

  // 優先使用機器可讀索引
  if (fs.existsSync(CONFIG.machineIndexFile)) {
    console.log(`   使用機器可讀索引: ${CONFIG.machineIndexFile}`);
    allIndexedFiles = loadMachineIndex(CONFIG.machineIndexFile);
    console.log(`   載入 ${allIndexedFiles.size} 個條目`);
    useMachineIndex = true;
  } else {
    console.log('   機器可讀索引不存在，使用 Markdown 索引');
    for (const [name, file] of Object.entries(CONFIG.indexFiles)) {
      if (fs.existsSync(file)) {
        const indexed = extractIndexedFiles(file);
        console.log(`   ${file}: ${indexed.size} 個條目`);
        indexed.forEach(f => allIndexedFiles.add(f));
      }
    }
    console.log(`   合併後: ${allIndexedFiles.size} 個唯一條目`);
  }

  console.log('');

  // 3. 檢查核心文件
  console.log('🔍 檢查核心文件...');
  const coreFilesStatus = CONFIG.coreFiles.map(file => ({
    file,
    exists: fs.existsSync(file),
    indexed: allIndexedFiles.has(file) || actualFiles.includes(file),
  }));
  console.log('');

  // 4. 生成報告
  const result = generateReport(actualFiles, allIndexedFiles, coreFilesStatus);

  // 5. 設置退出碼
  if (result.healthScore < 80 || !result.coreFilesOk) {
    console.log('⚠️  退出碼: 1 (發現嚴重問題)\n');
    process.exit(1);
  } else if (result.missingCount > 10 || result.ghostCount > 0) {
    console.log('⚠️  退出碼: 1 (需要改進)\n');
    process.exit(1);
  } else {
    console.log('✅ 退出碼: 0 (索引狀態良好)\n');
    process.exit(0);
  }
}

// 執行
main().catch(error => {
  console.error('\n❌ 執行錯誤:', error);
  process.exit(1);
});
