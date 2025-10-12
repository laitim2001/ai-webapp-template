#!/usr/bin/env node

/**
 * 機器可讀索引生成腳本
 * Machine-Readable Index Generation Script
 *
 * 用途: 掃描項目文件並生成機器可讀的 JSON 索引
 * Purpose: Scan project files and generate machine-readable JSON index
 *
 * 使用: node scripts/generate-machine-index.js
 * Usage: node scripts/generate-machine-index.js
 */

const fs = require('fs');
const path = require('path');

// =====================================================
// 配置
// =====================================================

const CONFIG = {
  // 輸出文件路徑
  outputFile: '.template-files.json',

  // 需要掃描的目錄
  scanDirs: [
    '00-monitoring',
    '01-base',
    '02-modules',
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

  // 核心文件（根目錄）
  coreFiles: [
    'README.md',
    'CHANGELOG.md',
    'CLAUDE.md',
    'init-project.js',
    'TEMPLATE-DEVELOPMENT-GUIDE.md',
    'TEMPLATE-INDEX.md',
    'PROJECT-INDEX.md',
    'INDEX-MAINTENANCE-GUIDE.md',
    'DOCUMENTATION-STRUCTURE.md',
    'IMPLEMENTATION-ROADMAP.md',
    'GAP-ANALYSIS-SUMMARY.md',
    'CURRENT-STATUS.md',
  ],
};

// =====================================================
// 工具函數
// =====================================================

/**
 * 獲取文件統計信息
 */
function getFileStats(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;

    return {
      size: stat.size,
      lines: lines,
      modified: stat.mtime.toISOString(),
    };
  } catch (error) {
    return {
      size: 0,
      lines: 0,
      modified: new Date().toISOString(),
      error: error.message,
    };
  }
}

/**
 * 分類文件類型
 */
function categorizeFile(filePath) {
  const ext = path.extname(filePath);
  const basename = path.basename(filePath);
  const dirname = path.dirname(filePath);

  // 模板文件
  if (basename.endsWith('.template')) {
    return 'template';
  }

  // 文檔文件
  if (ext === '.md') {
    return 'documentation';
  }

  // Schema 文件
  if (ext === '.prisma') {
    return 'schema';
  }

  // 源代碼
  if (['.ts', '.tsx', '.js'].includes(ext)) {
    if (dirname.includes('__tests__') || dirname.includes('tests')) {
      return 'test';
    }
    if (dirname.includes('components')) {
      return 'component';
    }
    if (dirname.includes('lib')) {
      return 'library';
    }
    if (dirname.includes('app')) {
      return 'page';
    }
    return 'code';
  }

  return 'other';
}

/**
 * 獲取文件模組歸屬
 */
function getModuleName(filePath) {
  if (filePath.startsWith('00-monitoring/')) {
    return 'monitoring';
  }
  if (filePath.startsWith('01-base/')) {
    return 'base';
  }
  if (filePath.startsWith('02-modules/')) {
    const parts = filePath.split('/');
    if (parts.length >= 2) {
      return parts[1].replace('module-', '');
    }
  }
  if (filePath.startsWith('Docs/')) {
    return 'docs';
  }
  if (filePath.startsWith('examples/')) {
    return 'examples';
  }
  if (filePath.startsWith('scripts/')) {
    return 'scripts';
  }
  return 'root';
}

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
          const normalizedPath = relativePath.replace(/\\/g, '/');

          files.push({
            path: normalizedPath,
            type: categorizeFile(normalizedPath),
            module: getModuleName(normalizedPath),
            stats: getFileStats(fullPath),
          });
        }
      }
    }
  } catch (error) {
    console.error(`❌ 掃描目錄失敗: ${dir}`, error.message);
  }

  return files;
}

// =====================================================
// 主程序
// =====================================================

async function main() {
  console.log('\n📋 開始生成機器可讀索引...\n');

  const index = {
    version: '1.0',
    generated: new Date().toISOString(),
    description: '機器可讀的模板文件索引 / Machine-readable template file index',
    files: [],
  };

  // 1. 掃描根目錄的核心文件
  console.log('📂 掃描根目錄核心文件...');
  let fileCount = 0;

  for (const coreFile of CONFIG.coreFiles) {
    if (fs.existsSync(coreFile)) {
      index.files.push({
        path: coreFile,
        type: categorizeFile(coreFile),
        module: 'root',
        stats: getFileStats(coreFile),
      });
      fileCount++;
    }
  }

  console.log(`   找到 ${fileCount} 個核心文件\n`);

  // 2. 掃描指定目錄
  console.log('📂 掃描項目目錄...');
  for (const dir of CONFIG.scanDirs) {
    if (fs.existsSync(dir)) {
      console.log(`   掃描 ${dir}/`);
      const dirFiles = scanDirectory(dir, '.');
      index.files.push(...dirFiles);
    }
  }

  console.log(`   總計找到 ${index.files.length} 個文件\n`);

  // 3. 生成統計信息
  console.log('📊 生成統計信息...');

  const stats = {
    totalFiles: index.files.length,
    byType: {},
    byModule: {},
    totalLines: 0,
    totalSize: 0,
  };

  for (const file of index.files) {
    // 按類型統計
    stats.byType[file.type] = (stats.byType[file.type] || 0) + 1;

    // 按模組統計
    stats.byModule[file.module] = (stats.byModule[file.module] || 0) + 1;

    // 總行數和大小
    stats.totalLines += file.stats.lines || 0;
    stats.totalSize += file.stats.size || 0;
  }

  index.stats = stats;

  console.log(`   文件總數: ${stats.totalFiles}`);
  console.log(`   代碼總行數: ${stats.totalLines.toLocaleString()}`);
  console.log(`   總大小: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB\n`);

  // 4. 按類型分組
  console.log('📊 按類型分組:');
  for (const [type, count] of Object.entries(stats.byType).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${type.padEnd(15)} ${count.toString().padStart(4)} 個`);
  }
  console.log('');

  // 5. 按模組分組
  console.log('📊 按模組分組:');
  for (const [module, count] of Object.entries(stats.byModule).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${module.padEnd(20)} ${count.toString().padStart(4)} 個`);
  }
  console.log('');

  // 6. 寫入 JSON 文件
  console.log(`💾 寫入索引文件: ${CONFIG.outputFile}`);

  try {
    fs.writeFileSync(
      CONFIG.outputFile,
      JSON.stringify(index, null, 2),
      'utf-8'
    );
    console.log('   ✅ 索引文件已生成\n');
  } catch (error) {
    console.error('   ❌ 寫入失敗:', error.message);
    process.exit(1);
  }

  // 7. 生成摘要
  console.log('='.repeat(70));
  console.log('✅ 機器可讀索引生成完成');
  console.log('='.repeat(70));
  console.log(`\n輸出文件: ${CONFIG.outputFile}`);
  console.log(`文件總數: ${stats.totalFiles}`);
  console.log(`代碼總行數: ${stats.totalLines.toLocaleString()}`);
  console.log(`索引大小: ${(Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(2)} KB\n`);

  console.log('💡 使用方式:');
  console.log('   1. 查看索引: cat .template-files.json');
  console.log('   2. 查詢文件: jq \'.files[] | select(.module=="auth")\' .template-files.json');
  console.log('   3. 統計信息: jq \'.stats\' .template-files.json');
  console.log('   4. 更新索引: node scripts/generate-machine-index.js\n');
}

// 執行
main().catch(error => {
  console.error('\n❌ 執行錯誤:', error);
  process.exit(1);
});
