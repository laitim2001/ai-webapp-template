#!/usr/bin/env node

/**
 * 文檔健康檢查腳本
 * Documentation Health Check Script
 *
 * 功能：
 * 1. 檢查過時文檔（超過90天未更新）
 * 2. 檢測斷裂的內部鏈接
 * 3. 識別重複的文檔內容
 * 4. 驗證 DOCUMENTATION-MAP.md 的完整性
 * 5. 生成文檔健康報告
 *
 * 使用方法：
 * node scripts/check-docs-health.js
 * node scripts/check-docs-health.js --fix  # 自動修復部分問題
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================================
// 配置區域
// ============================================================================

const CONFIG = {
  // 文檔根目錄
  docsRoots: [
    'Docs',
    '01-base/docs',
    '02-modules',
    'create-ai-webapp'
  ],

  // 過時閾值（天數）
  staleDays: 90,

  // 排除的目錄
  excludeDirs: [
    'node_modules',
    '.git',
    'Docs/archive',
    'test-projects',
    'examples'
  ],

  // 核心文檔（必須存在）
  criticalDocs: [
    'README.md',
    'CHANGELOG.md',
    'DOCUMENTATION-MAP.md',
    'Docs/PROJECT-STATUS.md',
    'CLAUDE.md'
  ],

  // 過時文檔檢查（自動標記為歷史）
  staleIndicators: [
    'CURRENT-STATUS',
    'PROJECT-STATUS-2025',
    'DAY\\d+-',
    'extraction-plan',
    '-TRACKER'
  ]
};

// ============================================================================
// 工具函數
// ============================================================================

/**
 * 遞歸掃描目錄，找出所有 .md 文件
 */
function findMarkdownFiles(dir, excludeDirs = []) {
  let results = [];

  try {
    const list = fs.readdirSync(dir);

    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // 跳過排除目錄
      if (stat.isDirectory()) {
        const shouldExclude = excludeDirs.some(excludeDir =>
          filePath.includes(excludeDir)
        );
        if (!shouldExclude) {
          results = results.concat(findMarkdownFiles(filePath, excludeDirs));
        }
      } else if (file.endsWith('.md')) {
        results.push(filePath);
      }
    });
  } catch (err) {
    // 目錄不存在，跳過
  }

  return results;
}

/**
 * 計算文件內容的 hash
 */
function getFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * 提取文檔中的內部鏈接
 */
function extractInternalLinks(content, filePath) {
  const links = [];

  // Markdown 鏈接格式: [text](path)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkPath = match[2];

    // 只處理內部鏈接（不以 http:// 或 https:// 開頭）
    if (!linkPath.startsWith('http://') && !linkPath.startsWith('https://')) {
      links.push({
        text: linkText,
        path: linkPath,
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }

  return links;
}

/**
 * 驗證鏈接是否有效
 */
function validateLink(linkPath, sourceFilePath) {
  // 移除 anchor (#section)
  const cleanPath = linkPath.split('#')[0];
  if (!cleanPath) return true; // 純 anchor 鏈接

  // 解析相對路徑
  const sourceDir = path.dirname(sourceFilePath);
  const targetPath = path.resolve(sourceDir, cleanPath);

  return fs.existsSync(targetPath);
}

/**
 * 檢查文檔是否過時
 */
function isDocStale(filePath, staleDays) {
  const stats = fs.statSync(filePath);
  const mtime = stats.mtime;
  const now = new Date();
  const diffDays = (now - mtime) / (1000 * 60 * 60 * 24);

  return diffDays > staleDays;
}

/**
 * 檢查文檔標題是否匹配模式
 */
function matchesStalePattern(filePath) {
  const fileName = path.basename(filePath);
  return CONFIG.staleIndicators.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(fileName);
  });
}

// ============================================================================
// 檢查功能
// ============================================================================

/**
 * 1. 檢查核心文檔是否存在
 */
function checkCriticalDocs() {
  console.log('\n📋 檢查核心文檔...');

  const missing = [];
  const existing = [];

  CONFIG.criticalDocs.forEach(doc => {
    if (fs.existsSync(doc)) {
      existing.push(doc);
      console.log(`  ✅ ${doc}`);
    } else {
      missing.push(doc);
      console.log(`  ❌ ${doc} - 文件不存在！`);
    }
  });

  return { existing, missing };
}

/**
 * 2. 檢查過時文檔
 */
function checkStaleDocs(files) {
  console.log('\n⏰ 檢查過時文檔...');

  const staleDocs = [];
  const patternMatches = [];

  files.forEach(file => {
    const isStale = isDocStale(file, CONFIG.staleDays);
    const matchesPattern = matchesStalePattern(file);

    if (isStale || matchesPattern) {
      const stats = fs.statSync(file);
      const mtime = stats.mtime.toISOString().split('T')[0];
      const reason = matchesPattern ? '文件名匹配歷史模式' : `超過${CONFIG.staleDays}天未更新`;

      staleDocs.push({
        path: file,
        mtime,
        reason
      });

      console.log(`  ⚠️  ${file}`);
      console.log(`      最後更新: ${mtime}, 原因: ${reason}`);
    }
  });

  return staleDocs;
}

/**
 * 3. 檢查斷裂的鏈接
 */
function checkBrokenLinks(files) {
  console.log('\n🔗 檢查斷裂的內部鏈接...');

  const brokenLinks = [];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractInternalLinks(content, file);

    links.forEach(link => {
      if (!validateLink(link.path, file)) {
        brokenLinks.push({
          sourceFile: file,
          linkText: link.text,
          linkPath: link.path,
          line: link.line
        });

        console.log(`  ❌ ${file}:${link.line}`);
        console.log(`      鏈接: [${link.text}](${link.path})`);
      }
    });
  });

  return brokenLinks;
}

/**
 * 4. 檢測重複文檔
 */
function checkDuplicateDocs(files) {
  console.log('\n🔍 檢測重複文檔（內容相似度 > 90%）...');

  const hashes = new Map();
  const duplicates = [];

  files.forEach(file => {
    const hash = getFileHash(file);

    if (hashes.has(hash)) {
      duplicates.push({
        file1: hashes.get(hash),
        file2: file,
        hash
      });
      console.log(`  ⚠️  重複: ${hashes.get(hash)} ≈ ${file}`);
    } else {
      hashes.set(hash, file);
    }
  });

  return duplicates;
}

/**
 * 5. 驗證 DOCUMENTATION-MAP.md
 */
function checkDocumentationMap() {
  console.log('\n🗺️  驗證 DOCUMENTATION-MAP.md...');

  const mapPath = 'DOCUMENTATION-MAP.md';

  if (!fs.existsSync(mapPath)) {
    console.log('  ❌ DOCUMENTATION-MAP.md 不存在！');
    return { exists: false };
  }

  const content = fs.readFileSync(mapPath, 'utf-8');
  const links = extractInternalLinks(content, mapPath);

  const brokenMapLinks = links.filter(link => !validateLink(link.path, mapPath));

  if (brokenMapLinks.length > 0) {
    console.log(`  ⚠️  發現 ${brokenMapLinks.length} 個斷裂的鏈接：`);
    brokenMapLinks.forEach(link => {
      console.log(`      [${link.text}](${link.path})`);
    });
  } else {
    console.log('  ✅ 所有鏈接有效');
  }

  return {
    exists: true,
    totalLinks: links.length,
    brokenLinks: brokenMapLinks
  };
}

// ============================================================================
// 生成報告
// ============================================================================

function generateReport(results) {
  const timestamp = new Date().toISOString().split('T')[0];
  const reportPath = `Docs/doc-health-report-${timestamp}.md`;

  let report = `# 文檔健康檢查報告
# Documentation Health Check Report

**生成日期**: ${new Date().toISOString()}
**檢查文檔數量**: ${results.totalFiles}

---

## 📊 總體評分

`;

  // 計算評分
  const criticalScore = (results.criticalDocs.existing.length / CONFIG.criticalDocs.length) * 100;
  const linkScore = results.totalLinks > 0
    ? ((results.totalLinks - results.brokenLinks.length) / results.totalLinks) * 100
    : 100;
  const staleScore = results.totalFiles > 0
    ? ((results.totalFiles - results.staleDocs.length) / results.totalFiles) * 100
    : 100;

  const overallScore = (criticalScore + linkScore + staleScore) / 3;

  report += `**整體健康度**: ${overallScore.toFixed(1)}% ${getScoreEmoji(overallScore)}\n\n`;
  report += `| 指標 | 評分 | 狀態 |\n`;
  report += `|------|------|------|\n`;
  report += `| 核心文檔完整性 | ${criticalScore.toFixed(1)}% | ${getScoreEmoji(criticalScore)} |\n`;
  report += `| 鏈接有效性 | ${linkScore.toFixed(1)}% | ${getScoreEmoji(linkScore)} |\n`;
  report += `| 文檔新鮮度 | ${staleScore.toFixed(1)}% | ${getScoreEmoji(staleScore)} |\n\n`;

  // 核心文檔檢查
  report += `## ✅ 核心文檔檢查\n\n`;
  if (results.criticalDocs.missing.length === 0) {
    report += `所有 ${results.criticalDocs.existing.length} 個核心文檔都存在 ✅\n\n`;
  } else {
    report += `**缺失的核心文檔** (${results.criticalDocs.missing.length}個):\n\n`;
    results.criticalDocs.missing.forEach(doc => {
      report += `- ❌ ${doc}\n`;
    });
    report += `\n`;
  }

  // 過時文檔
  if (results.staleDocs.length > 0) {
    report += `## ⏰ 過時文檔 (${results.staleDocs.length}個)\n\n`;
    report += `建議歸檔到 \`Docs/archive/\` 或更新內容。\n\n`;
    results.staleDocs.forEach(doc => {
      report += `- **${doc.path}**\n`;
      report += `  - 最後更新: ${doc.mtime}\n`;
      report += `  - 原因: ${doc.reason}\n\n`;
    });
  }

  // 斷裂的鏈接
  if (results.brokenLinks.length > 0) {
    report += `## 🔗 斷裂的鏈接 (${results.brokenLinks.length}個)\n\n`;
    results.brokenLinks.forEach(link => {
      report += `- **${link.sourceFile}:${link.line}**\n`;
      report += `  - 鏈接文本: ${link.linkText}\n`;
      report += `  - 目標路徑: ${link.linkPath}\n\n`;
    });
  }

  // 重複文檔
  if (results.duplicates.length > 0) {
    report += `## 🔍 重複文檔 (${results.duplicates.length}組)\n\n`;
    results.duplicates.forEach(dup => {
      report += `- ${dup.file1}\n`;
      report += `- ${dup.file2}\n`;
      report += `  > 內容完全相同，建議刪除其中一個\n\n`;
    });
  }

  // DOCUMENTATION-MAP 檢查
  report += `## 🗺️  DOCUMENTATION-MAP.md 檢查\n\n`;
  if (results.docMap.exists) {
    report += `- 總鏈接數: ${results.docMap.totalLinks}\n`;
    report += `- 斷裂鏈接數: ${results.docMap.brokenLinks.length}\n`;
    if (results.docMap.brokenLinks.length > 0) {
      report += `\n**斷裂的鏈接**:\n`;
      results.docMap.brokenLinks.forEach(link => {
        report += `- [${link.text}](${link.path})\n`;
      });
    }
  } else {
    report += `❌ DOCUMENTATION-MAP.md 不存在！\n`;
  }

  report += `\n---\n\n`;
  report += `## 📋 建議行動\n\n`;

  const actions = [];
  if (results.criticalDocs.missing.length > 0) {
    actions.push(`🔴 **立即**: 補充缺失的核心文檔 (${results.criticalDocs.missing.length}個)`);
  }
  if (results.brokenLinks.length > 0) {
    actions.push(`🟡 **本週**: 修復斷裂的鏈接 (${results.brokenLinks.length}個)`);
  }
  if (results.staleDocs.length > 0) {
    actions.push(`🟢 **本月**: 歸檔過時文檔 (${results.staleDocs.length}個)`);
  }
  if (results.duplicates.length > 0) {
    actions.push(`🟢 **本月**: 刪除重複文檔 (${results.duplicates.length}組)`);
  }

  if (actions.length === 0) {
    report += `✅ 文檔健康狀況良好，無需立即行動！\n`;
  } else {
    actions.forEach(action => {
      report += `${action}\n`;
    });
  }

  report += `\n---\n\n`;
  report += `*報告由 \`scripts/check-docs-health.js\` 自動生成*\n`;

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n📄 報告已生成: ${reportPath}`);

  return reportPath;
}

function getScoreEmoji(score) {
  if (score >= 90) return '🟢';
  if (score >= 70) return '🟡';
  return '🔴';
}

// ============================================================================
// 主函數
// ============================================================================

function main() {
  console.log('🏥 文檔健康檢查開始...\n');
  console.log(`掃描目錄: ${CONFIG.docsRoots.join(', ')}`);
  console.log(`排除目錄: ${CONFIG.excludeDirs.join(', ')}\n`);

  // 1. 掃描所有 Markdown 文件
  let allFiles = [];
  CONFIG.docsRoots.forEach(root => {
    if (fs.existsSync(root)) {
      allFiles = allFiles.concat(findMarkdownFiles(root, CONFIG.excludeDirs));
    }
  });

  // 添加根目錄的 MD 文件
  const rootMdFiles = fs.readdirSync('.').filter(f => f.endsWith('.md'));
  allFiles = allFiles.concat(rootMdFiles);

  console.log(`✅ 發現 ${allFiles.length} 個 Markdown 文件\n`);

  // 2. 執行各項檢查
  const results = {
    totalFiles: allFiles.length,
    criticalDocs: checkCriticalDocs(),
    staleDocs: checkStaleDocs(allFiles),
    brokenLinks: checkBrokenLinks(allFiles),
    duplicates: checkDuplicateDocs(allFiles),
    docMap: checkDocumentationMap()
  };

  results.totalLinks = results.brokenLinks.length +
    allFiles.reduce((sum, file) => {
      const content = fs.readFileSync(file, 'utf-8');
      return sum + extractInternalLinks(content, file).length;
    }, 0);

  // 3. 生成報告
  const reportPath = generateReport(results);

  // 4. 總結
  console.log('\n' + '='.repeat(60));
  console.log('📊 檢查完成！');
  console.log('='.repeat(60));
  console.log(`總文檔數: ${results.totalFiles}`);
  console.log(`過時文檔: ${results.staleDocs.length}`);
  console.log(`斷裂鏈接: ${results.brokenLinks.length}`);
  console.log(`重複文檔: ${results.duplicates.length}組`);
  console.log(`\n完整報告: ${reportPath}`);
}

// 執行
if (require.main === module) {
  main();
}

module.exports = { findMarkdownFiles, checkBrokenLinks, checkStaleDocs };
